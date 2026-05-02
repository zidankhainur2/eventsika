import { getChildTagsForInterests } from "@/lib/taxonomy";

// ─────────────────────────────────────────────────────────────────────────────
// Model: paraphrase-multilingual-mpnet-base-v2
//
// Alasan pemilihan model ini:
//   • Arsitektur MPNet menghasilkan distribusi cosine-similarity yang lebih
//     tersebar dibandingkan MiniLM/E5 — mengurangi efek over-similarity
//     yang menyebabkan semua skor menumpuk di rentang sempit (mis. 0.85–0.92).
//   • Dilatih khusus untuk paraphrase/semantic similarity lintas bahasa (50+
//     bahasa termasuk Indonesia), cocok untuk matching profil ↔ event.
//   • Dimensi 768 memberikan ruang representasi yang lebih kaya sehingga
//     perbedaan topik (IT vs Seni vs Olahraga) lebih terlihat di ranking.
//   • TIDAK memerlukan prefix khusus (tidak seperti E5 yang perlu
//     "query:" / "passage:") — teks dimasukkan apa adanya.
//
// Trade-off:
//   • Dimensi 768 (bukan 384) → kolom embedding & interest_vector di
//     database harus diubah: ALTER TABLE ... TYPE vector(768)
//   • Ukuran model lebih besar → cold-start HF Inference API ~5–10 detik
//     (timeout dinaikkan menjadi 45 detik)
// ─────────────────────────────────────────────────────────────────────────────

const EMBEDDING_API_URL =
  "https://router.huggingface.co/hf-inference/models/" +
  "sentence-transformers/paraphrase-multilingual-mpnet-base-v2/pipeline/feature-extraction";

const EXPECTED_DIM = 768;
const API_TIMEOUT_MS = 45_000; // Dinaikkan dari 30s karena model lebih besar

/**
 * Menghasilkan embedding dari teks menggunakan Hugging Face Inference API.
 * Mengembalikan null jika teks kosong, API error, atau dimensi tidak valid.
 *
 * Model paraphrase-multilingual-mpnet-base-v2 TIDAK memerlukan prefix
 * "query:" atau "passage:" — masukkan teks apa adanya.
 */
export async function generateEmbedding(
  text: string,
): Promise<number[] | null> {
  const cleanedText = text.replace(/\n+/g, " ").trim();

  if (!cleanedText || cleanedText.length < 3) {
    console.warn(
      "[Embedding] Teks terlalu pendek atau kosong, skip embedding.",
    );
    return null;
  }

  const apiToken = process.env.HF_API_TOKEN;
  if (!apiToken) {
    console.error("[Embedding] HF_API_TOKEN tidak ditemukan di environment.");
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(EMBEDDING_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({ inputs: cleanedText }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response
        .text()
        .catch(() => "(tidak bisa dibaca)");
      console.error(`[Embedding] API error ${response.status}: ${errorBody}`);
      return null;
    }

    const result = await response.json();

    // Normalisasi format respons: nested [[...]] atau flat [...]
    let embedding: number[] | null = null;

    if (Array.isArray(result)) {
      if (Array.isArray(result[0]) && typeof result[0][0] === "number") {
        // Format nested: [[0.1, 0.2, ...]]
        embedding = result[0] as number[];
      } else if (typeof result[0] === "number") {
        // Format flat: [0.1, 0.2, ...]
        embedding = result as number[];
      }
    }

    if (!embedding) {
      console.error(
        "[Embedding] Format respons tidak dikenal:",
        JSON.stringify(result).slice(0, 100),
      );
      return null;
    }

    // VALIDASI KETAT: dimensi harus tepat 768
    if (embedding.length !== EXPECTED_DIM) {
      console.error(
        `[Embedding] Dimensi tidak valid: dapat ${embedding.length}, ` +
          `diharapkan ${EXPECTED_DIM}. Embedding TIDAK digunakan.`,
      );
      return null;
    }

    return embedding;
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      console.error(
        `[Embedding] Timeout setelah ${API_TIMEOUT_MS}ms. ` +
          `HF API mungkin cold start — coba lagi dalam beberapa detik.`,
      );
    } else {
      console.error("[Embedding] Error tidak terduga:", error);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Membuat teks embedding dari parent interests user.
 *
 * Strategi: gabungkan nama parent topic + sample child tags untuk
 * representasi embedding yang kaya konteks tanpa prefix khusus.
 *
 * Model mpnet tidak memerlukan prefix "query:" / "passage:".
 *
 * @example
 *   buildInterestText(['Teknologi & IT', 'Bisnis & Wirausaha'])
 *   // → "Teknologi IT programming coding web development machine learning
 *   //     Bisnis Wirausaha entrepreneurship startup marketing finance"
 */
export function buildInterestText(parentInterests: string[]): string {
  if (!parentInterests.length) return "";

  // Ambil child tags untuk enrichment embedding
  const childTags = getChildTagsForInterests(parentInterests);

  // Bersihkan simbol dari nama parent, lalu gabungkan dengan child tags
  const parentNames = parentInterests
    .map((p) => p.replace(/[&]/g, "").replace(/\s+/g, " ").trim())
    .join(" ");

  // Ambil maksimal 20 child tags agar tidak melebihi max sequence length (128 token)
  const childSample = childTags.slice(0, 20).join(" ");

  return `${parentNames} ${childSample}`.trim();
}

/**
 * Membuat string konten event dari field-field event untuk di-embed.
 * Menggabungkan judul + deskripsi + tags agar embedding kaya konteks.
 *
 * Model mpnet tidak memerlukan prefix "passage:" seperti model E5.
 */
export function buildEventEmbeddingText(
  title: string,
  description: string,
  tags: string[],
): string {
  const parts = [
    `Judul: ${title}`,
    `Deskripsi: ${description}`,
    tags.length > 0 ? `Topik: ${tags.join(", ")}` : "",
  ].filter(Boolean);

  return parts.join(". ");
}
