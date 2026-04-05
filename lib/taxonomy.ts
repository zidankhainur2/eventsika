// constants/taxonomy.ts
// Taxonomy hierarki topik untuk sistem rekomendasi EventSika
// Parent = pilihan user (onboarding interests)
// Child = tag yang diinput admin saat membuat event
//
// ATURAN untuk admin event:
// - Pilih tags dari daftar child di bawah ini
// - Satu event bisa punya multiple tags dari parent berbeda
// - Ini menjamin matching dengan interests user dapat terjadi

export const TOPIC_TAXONOMY: Record<string, string[]> = {
  "Teknologi & IT": [
    "programming",
    "coding",
    "web development",
    "mobile development",
    "artificial intelligence",
    "machine learning",
    "data science",
    "cybersecurity",
    "cloud computing",
    "IoT",
    "blockchain",
    "UI/UX",
    "game development",
    "open source",
    "linux",
    "otomotif",
  ],
  "Bisnis & Wirausaha": [
    "entrepreneurship",
    "startup",
    "marketing",
    "digital marketing",
    "finance",
    "investasi",
    "wirausaha",
    "e-commerce",
    "branding",
    "business plan",
    "pitch",
    "manajemen",
    "akuntansi",
  ],
  "Akademik & Riset": [
    "penelitian",
    "riset",
    "publikasi",
    "jurnal",
    "skripsi",
    "thesis",
    "seminar ilmiah",
    "konferensi",
    "lomba karya tulis",
    "PKMP",
    "PKMK",
    "olimpiade",
    "kompetisi akademik",
  ],
  "Seni & Budaya": [
    "musik",
    "seni rupa",
    "fotografi",
    "videografi",
    "desain grafis",
    "teater",
    "tari",
    "film",
    "sastra",
    "budaya",
    "pameran",
    "pertunjukan",
  ],
  "Olahraga & Kesehatan": [
    "futsal",
    "basket",
    "voli",
    "badminton",
    "renang",
    "atletik",
    "esports",
    "gaming",
    "hiking",
    "kesehatan mental",
    "wellness",
    "yoga",
  ],
  "Sosial & Lingkungan": [
    "volunteering",
    "komunitas",
    "lingkungan hidup",
    "sosial",
    "bakti sosial",
    "kemanusiaan",
    "sustainability",
    "go green",
    "pemberdayaan masyarakat",
  ],
  "Pengembangan Diri": [
    "leadership",
    "public speaking",
    "soft skills",
    "career development",
    "networking",
    "mentoring",
    "self-improvement",
    "time management",
    "komunikasi",
    "workshop",
    "pelatihan",
  ],
  Keagamaan: [
    "rohani",
    "kajian",
    "Islam",
    "keagamaan",
    "pesantren",
    "spiritual",
    "dakwah",
    "ibadah",
  ],
};

// ─── Derived helpers (digunakan di frontend + backend) ───────────────

/** Semua parent topics — digunakan sebagai pilihan interests di onboarding */
export const PARENT_TOPICS = Object.keys(TOPIC_TAXONOMY);

/** Semua child tags dari seluruh taxonomy — digunakan di event form dropdown */
export const ALL_TAGS: string[] = Object.values(TOPIC_TAXONOMY).flat();

/**
 * Dapatkan parent topics dari satu tag.
 * Satu tag bisa punya lebih dari satu parent (overlap taxonomy).
 *
 * @example
 *   getParentsOfTag('machine learning')
 *   // → ['Teknologi & IT']
 */
export function getParentsOfTag(tag: string): string[] {
  return PARENT_TOPICS.filter((parent) => TOPIC_TAXONOMY[parent].includes(tag));
}

/**
 * Hitung tag score berdasarkan taxonomy matching.
 *
 * Logika:
 * - Ambil semua parent dari setiap tag event
 * - Cek apakah parent tersebut ada di interests user
 * - Hitung berapa parent yang match, normalisasi ke [0, 1]
 *
 * Formula: min(matched_parents / 3, 1.0) — konsisten dengan S_tag di RPC
 *
 * @param eventTags     - Array tag event (child-level)
 * @param userInterests - Array interests user (parent-level)
 */
export function computeTagScore(
  eventTags: string[],
  userInterests: string[],
): number {
  if (!eventTags?.length || !userInterests?.length) return 0;

  // Kumpulkan semua parent yang tercover oleh tags event
  const eventParents = new Set<string>(
    eventTags.flatMap((tag) => getParentsOfTag(tag)),
  );

  // Hitung irisan antara parent event dengan interests user
  const matchedParents = userInterests.filter((interest) =>
    eventParents.has(interest),
  ).length;

  // Normalisasi: 3+ parent yang match = skor penuh 1.0
  return Math.min(matchedParents / 3, 1.0);
}

/**
 * Dapatkan semua child tags dari daftar parent interests.
 * Digunakan untuk menampilkan "tag yang relevan" atau untuk
 * keperluan debugging di halaman uji algoritma.
 */
export function getChildTagsForInterests(interests: string[]): string[] {
  return interests.flatMap((interest) => TOPIC_TAXONOMY[interest] ?? []);
}
