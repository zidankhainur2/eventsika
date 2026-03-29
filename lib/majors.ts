// constants/majors.ts
// Daftar program studi UNSIKA yang terdaftar di sistem

export const UNSIKA_MAJORS = [
  "Agribisnis",
  "Agroteknologi",
  "Akuntansi",
  "Farmasi",
  "Hubungan Internasional",
  "Ilmu Gizi",
  "Ilmu Hukum",
  "Ilmu Keolahragaan",
  "Ilmu Komunikasi",
  "Ilmu Pemerintahan",
  "Informatika",
  "Kebidanan",
  "Manajemen",
  "Manajemen Pendidikan Islam",
  "Pendidikan Agama Islam",
  "Pendidikan Bahasa & Sastra Indonesia",
  "Pendidikan Bahasa Inggris",
  "Pendidikan Islam Anak Usia Dini",
  "Pendidikan Jasmani, Kesehatan & Rekreasi",
  "Pendidikan Luar Sekolah",
  "Pendidikan Matematika",
  "Sistem Informasi",
  "Teknik Elektro",
  "Teknik Industri",
  "Teknik Kimia",
  "Teknik Lingkungan",
  "Teknik Mesin",
  "Umum", // Untuk event yang tidak terikat jurusan
] as const;

export type UnsikaMinor = (typeof UNSIKA_MAJORS)[number];
