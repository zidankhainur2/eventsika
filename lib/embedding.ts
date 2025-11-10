const EMBEDDING_API_URL =
  "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction";

/**
 * Menghasilkan embedding (vektor) dari sebuah teks menggunakan Hugging Face.
 * @param text Teks yang akan di-embed
 * @returns Array angka (vektor 384 dimensi) atau null jika gagal
 */
export async function generateEmbedding(
  text: string
): Promise<number[] | null> {
  const cleanedText = text.replace(/\n/g, " ").trim();

  if (!cleanedText) {
    console.warn("generateEmbedding: teks kosong atau hanya whitespace");
    return null;
  }

  // Validasi HF_API_TOKEN
  const apiToken = process.env.HF_API_TOKEN;
  if (!apiToken) {
    console.error("HF_API_TOKEN tidak ditemukan di environment variables");
    return null;
  }

  try {
    const response = await fetch(EMBEDDING_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        inputs: cleanedText,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Hugging Face API error (${response.status}):`, errorText);

      // Tambahan info untuk debugging
      if (response.status === 401) {
        console.error(
          "Token tidak valid atau tidak memiliki permission yang cukup"
        );
      } else if (response.status === 404) {
        console.error("Model atau endpoint tidak ditemukan");
      }

      return null;
    }

    const result = await response.json();

    // Validasi format respons
    let embedding: number[] | null = null;

    if (Array.isArray(result)) {
      // Cek apakah nested array [[...]] atau flat array [...]
      if (Array.isArray(result[0]) && typeof result[0][0] === "number") {
        // Format nested: [[...]]
        embedding = result[0];
      } else if (typeof result[0] === "number") {
        // Format flat: [...]
        embedding = result;
      }
    }

    if (!embedding) {
      console.error("Format respons API tidak valid:", result);
      return null;
    }

    // Validasi dimensi vektor (all-MiniLM-L6-v2 = 384 dimensi)
    console.log(`Embedding generated with ${embedding.length} dimensions`);

    if (embedding.length === 384) {
      return embedding;
    } else {
      console.warn(
        `Unexpected embedding dimension: ${embedding.length}, expected 384`
      );
      return embedding; // Tetap return meskipun dimensi tidak sesuai
    }
  } catch (error) {
    console.error("Error saat generate embedding:", error);
    return null;
  }
}
