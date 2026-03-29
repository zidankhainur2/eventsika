import { getChildTagsForInterests } from "@/lib/taxonomy";

const EMBEDDING_API_URL =
  "https://router.huggingface.co/hf-inference/models/" +
  "sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction";

const EXPECTED_DIM = 384;
const API_TIMEOUT_MS = 30_000; // 30 detik — HF cold start bisa lama

/**
 * Menghasilkan embedding dari teks menggunakan Hugging Face Inference API.
 * Mengembalikan null jika teks kosong, API error, atau dimensi tidak valid.
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
        embedding = result[0] as number[];
      } else if (typeof result[0] === "number") {
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

    // VALIDASI KETAT: dimensi harus tepat 384
    if (embedding.length !== EXPECTED_DIM) {
      console.error(
        `[Embedding] Dimensi tidak valid: dapat ${embedding.length}, diharapkan ${EXPECTED_DIM}. ` +
          `Embedding TIDAK digunakan.`,
      );
      return null; // Tidak return embedding yang salah dimensi
    }

    return embedding;
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      console.error(
        `[Embedding] Timeout setelah ${API_TIMEOUT_MS}ms. HF API mungkin cold start.`,
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
 * Menggabungkan nama parent + sample child tags untuk
 * representasi embedding yang lebih kaya.
 *
 * @example
 *   buildInterestText(['Teknologi & IT', 'Bisnis & Wirausaha'])
 *   // → "Teknologi IT programming coding web development machine learning
 *   //     Bisnis Wirausaha entrepreneurship startup marketing finance"
 */
export function buildInterestText(parentInterests: string[]): string {
  if (!parentInterests.length) return '';

  // Ambil child tags untuk enrichment embedding
  const childTags = getChildTagsForInterests(parentInterests);

  // Gabungkan parent names (cleaned) + child tags
  const parentNames = parentInterests
    .map((p) => p.replace(/[&]/g, '').replace(/\s+/g, ' ').trim())
    .join(' ');

  const childSample = childTags.slice(0, 20).join(' ');

  return `${parentNames} ${childSample}`.trim();
}

/**
 * Membuat string konten event dari FormData untuk di-embed.
 * Menggabungkan judul + deskripsi + tags agar embedding kaya konteks.
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
