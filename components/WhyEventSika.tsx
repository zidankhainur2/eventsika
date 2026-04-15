import { FiUserCheck, FiZap, FiGrid } from "react-icons/fi";

const features = [
  {
    icon: <FiUserCheck className="h-7 w-7 text-primary" />,
    title: "Rekomendasi Personal",
    description:
      "Dapatkan rekomendasi event yang paling relevan dengan jurusan dan aktivitasmu.",
  },
  {
    icon: <FiZap className="h-7 w-7 text-primary" />,
    title: "Daftar Cepat & Praktis",
    description:
      "Simpan event dan akses link pendaftaran hanya dengan satu klik langsung dari dashboard.",
  },
  {
    icon: <FiGrid className="h-7 w-7 text-primary" />,
    title: "Semua di Satu Tempat",
    description:
      "Tidak perlu lagi FOMO. Semua informasi event kampus UNSIKA ada di genggamanmu.",
  },
];

export default function WhyEventSika() {
  return (
    <section>
      <div className="text-center mb-12 space-y-3">
        <span className="text-sm font-bold text-primary tracking-wider uppercase">
          Keunggulan
        </span>
        <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          Kenapa Harus Pilih EventSika?
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="group relative bg-white dark:bg-card p-8 rounded-3xl border border-gray-100 dark:border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center"
          >
            {/* Dekorasi Abstract Hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="font-heading text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
