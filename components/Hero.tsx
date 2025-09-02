// components/Hero.tsx
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative text-center py-20 sm:py-28 bg-cover bg-center rounded-xl shadow-md overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative max-w-3xl mx-auto px-4 z-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
          Temukan dan Bagikan Event Kampus Terbaik
        </h1>
        <p className="mt-6 text-lg text-gray-200 drop-shadow">
          EventSika adalah pusat informasi untuk semua kegiatan dan acara di
          lingkungan kampus. Jangan lewatkan kesempatan untuk berkembang!
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            href="#events"
            className="bg-primary text-white font-bold py-3 px-6 rounded-lg bg-blue-500 hover:bg-blue-800 transition-colors"
          >
            Jelajahi Event
          </Link>
          <Link
            href="/submit-event"
            className="bg-accent text-white font-bold py-3 px-6 rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors"
          >
            Submit Event Gratis
          </Link>
        </div>
      </div>
    </section>
  );
}
