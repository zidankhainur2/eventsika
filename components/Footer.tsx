"use client";

import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-white mt-auto">
      <div className="w-full py-16 px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
        {/* Brand Column */}
        <div className="space-y-6 md:col-span-1">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Image
                src="/eventsika-logo.png"
                alt="Logo"
                width={32}
                height={32}
              />
              <span className="text-2xl font-heading font-black text-primary tracking-tight">
                EventSika
              </span>
            </div>
            <p className="text-stone-500 text-xs font-semibold tracking-widest uppercase">
              Collegiate Curator
            </p>
          </div>
          <p className="text-stone-400 leading-relaxed text-sm">
            Platform eksplorasi event mahasiswa nomor satu di UNSIKA. Hubungkan
            minatmu dengan kegiatan seru di kampus.
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-stone-400 hover:text-white hover:bg-primary transition-all"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-stone-400 hover:text-white hover:bg-primary transition-all"
            >
              <FaTwitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-stone-400 hover:text-white hover:bg-primary transition-all"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="space-y-6">
          <h4 className="font-heading font-bold text-white uppercase tracking-wider text-sm">
            Perusahaan
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                href="/about"
                className="text-stone-400 hover:text-white hover:underline decoration-primary underline-offset-4 transition-all"
              >
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-stone-400 hover:text-white hover:underline decoration-primary underline-offset-4 transition-all"
              >
                Hubungi Kami
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-stone-400 hover:text-white hover:underline decoration-primary underline-offset-4 transition-all"
              >
                Kebijakan Privasi
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-stone-400 hover:text-white hover:underline decoration-primary underline-offset-4 transition-all"
              >
                Syarat & Ketentuan
              </Link>
            </li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="space-y-6">
          <h4 className="font-heading font-bold text-white uppercase tracking-wider text-sm">
            Kategori Favorit
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                href="/?category=Seminar"
                className="text-stone-400 hover:text-white hover:underline decoration-primary underline-offset-4 transition-all"
              >
                Seminar
              </Link>
            </li>
            <li>
              <Link
                href="/?category=Kompetisi"
                className="text-stone-400 hover:text-white hover:underline decoration-primary underline-offset-4 transition-all"
              >
                Kompetisi
              </Link>
            </li>
            <li>
              <Link
                href="/?category=Hiburan"
                className="text-stone-400 hover:text-white hover:underline decoration-primary underline-offset-4 transition-all"
              >
                Hiburan
              </Link>
            </li>
            <li>
              <Link
                href="/?category=Festival"
                className="text-stone-400 hover:text-white hover:underline decoration-primary underline-offset-4 transition-all"
              >
                Festival
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="space-y-6">
          <h4 className="font-heading font-bold text-white uppercase tracking-wider text-sm">
            Dapatkan Update
          </h4>
          <p className="text-stone-400 text-sm">
            Berlangganan newsletter untuk info event terbaru setiap minggunya.
          </p>
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Email kamu..."
              className="w-full bg-stone-900 border border-stone-800 rounded-xl py-3 px-4 text-sm text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
            <button className="w-full bg-primary text-white px-4 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Berlangganan
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full py-6 px-6 border-t border-stone-900 text-center text-stone-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} EventSika. Dirancang khusus untuk
          mahasiswa UNSIKA.
        </p>
      </div>
    </footer>
  );
}
