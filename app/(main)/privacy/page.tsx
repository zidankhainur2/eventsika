import Breadcrumb from "@/components/Breadcrumb";
import { ShieldCheck, Info, Eye, ShieldAlert, FileText } from "lucide-react";
import type { Metadata } from "next";
import { SplashBlobBlue, SplashBlobLime, SplashDotBlue } from "@/components/ui/splashes";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — EventSika",
  description: "Kebijakan Privasi EventSika. Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-8 sm:py-12 bg-white relative overflow-hidden">
      {/* Decorative Splashes */}
      <SplashBlobBlue className="absolute -top-20 -right-20 w-96 h-96 pointer-events-none z-0 opacity-10" />
      <SplashBlobLime className="absolute -bottom-24 -left-20 w-80 h-80 pointer-events-none z-0" />
      <SplashDotBlue className="absolute top-1/3 left-10 w-6 h-6 pointer-events-none z-0 opacity-20" />

      <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Kebijakan Privasi" }]}
        />

        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E45FB] tracking-tight uppercase leading-none mb-4">
            Kebijakan<br />
            <span className="text-[#0A0A0A]">Privasi</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-[#6B6B6B] font-semibold leading-relaxed">
            Kebijakan ini menjelaskan bagaimana tim pengembang EventSika mengumpulkan, menyimpan, dan mengolah informasi pribadi Anda.
          </p>
        </section>

        {/* Content Card */}
        <div className="bg-white border-2 border-[#0A0A0A] p-6 sm:p-10 rounded-xl shadow-[6px_6px_0px_#0A0A0A] space-y-10 relative z-10">
          
          {/* Intro */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#CDF22B] border-2 border-[#0A0A0A] rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#0A0A0A] shrink-0">
                <ShieldCheck className="h-5 w-5 text-[#0A0A0A]" />
              </div>
              <h2 className="text-lg md:text-xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
                Komitmen Kami Terhadap Privasi
              </h2>
            </div>
            <p className="text-sm md:text-base text-[#6B6B6B] font-medium leading-relaxed">
              Di EventSika, kami sangat menghargai privasi Anda sebagai mahasiswa dan pengguna platform. Kami berkomitmen untuk melindungi informasi pribadi Anda dan memastikan pengalaman menjelajah kegiatan kampus yang aman, transparan, dan dapat dipercaya. Kebijakan ini berlaku untuk seluruh pengguna platform EventSika.
            </p>
          </div>

          {/* 1. Data yang Dikumpulkan */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#CDF22B] border-2 border-[#0A0A0A] rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#0A0A0A] shrink-0">
                <Info className="h-5 w-5 text-[#0A0A0A]" />
              </div>
              <h2 className="text-lg md:text-xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
                1. Informasi yang Kami Kumpulkan
              </h2>
            </div>
            <p className="text-sm md:text-base text-[#6B6B6B] font-medium leading-relaxed">
              Kami mengumpulkan data tertentu untuk memberikan layanan personalisasi dan sistem rekomendasi yang akurat. Data tersebut mencakup:
            </p>
            <ul className="space-y-3 pl-2">
              <li className="flex items-start gap-2.5 text-sm md:text-base text-[#6B6B6B] font-medium leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-[#1E45FB] mt-2 shrink-0" />
                <span>
                  <strong className="text-[#0A0A0A]">Data Profil Akun:</strong> Nama Lengkap, Alamat Email Kampus, Foto Profil (opsional).
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-sm md:text-base text-[#6B6B6B] font-medium leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-[#1E45FB] mt-2 shrink-0" />
                <span>
                  <strong className="text-[#0A0A0A]">Informasi Akademik:</strong> Program Studi / Jurusan Anda untuk keperluan pencocokan rule-based.
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-sm md:text-base text-[#6B6B6B] font-medium leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-[#1E45FB] mt-2 shrink-0" />
                <span>
                  <strong className="text-[#0A0A0A]">Preferensi Personalisasi:</strong> Daftar minat atau topik kegiatan kampus yang Anda pilih (contoh: Teknologi, Seminar, Olahraga).
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-sm md:text-base text-[#6B6B6B] font-medium leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-[#1E45FB] mt-2 shrink-0" />
                <span>
                  <strong className="text-[#0A0A0A]">Vektor Embeddings:</strong> Representasi numerik terenkripsi dari preferensi minat Anda yang dihitung oleh API Hugging Face AI untuk keperluan penggerak mesin rekomendasi semantik.
                </span>
              </li>
            </ul>
          </div>

          {/* 2. Cara Mengolah Data */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#CDF22B] border-2 border-[#0A0A0A] rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#0A0A0A] shrink-0">
                <Eye className="h-5 w-5 text-[#0A0A0A]" />
              </div>
              <h2 className="text-lg md:text-xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
                2. Bagaimana Kami Menggunakan Informasi Anda
              </h2>
            </div>
            <p className="text-sm md:text-base text-[#6B6B6B] font-medium leading-relaxed">
              Data Anda diolah semata-mata untuk meningkatkan utilitas dan kegunaan platform, khususnya untuk:
            </p>
            <ul className="space-y-3 pl-2">
              <li className="flex items-start gap-2.5 text-sm md:text-base text-[#6B6B6B] font-medium leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-[#1E45FB] mt-2 shrink-0" />
                <span>Menghasilkan dan mengurutkan daftar rekomendasi event kampus yang paling relevan untuk Anda di halaman utama.</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm md:text-base text-[#6B6B6B] font-medium leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-[#1E45FB] mt-2 shrink-0" />
                <span>Mendeteksi event-event yang sesuai dengan jurusan/program studi Anda.</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm md:text-base text-[#6B6B6B] font-medium leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-[#1E45FB] mt-2 shrink-0" />
                <span>Memproses permohonan pendaftaran peran Penyelenggara Event (Organizer).</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm md:text-base text-[#6B6B6B] font-medium leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-[#1E45FB] mt-2 shrink-0" />
                <span>Mengirimkan konfirmasi notifikasi permohonan organizer Anda melalui email.</span>
              </li>
            </ul>
          </div>

          {/* 3. Keamanan Data */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#CDF22B] border-2 border-[#0A0A0A] rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#0A0A0A] shrink-0">
                <ShieldAlert className="h-5 w-5 text-[#0A0A0A]" />
              </div>
              <h2 className="text-lg md:text-xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
                3. Keamanan dan Penyimpanan Data
              </h2>
            </div>
            <p className="text-sm md:text-base text-[#6B6B6B] font-medium leading-relaxed">
              Seluruh data akun dan profil disimpan dengan aman di database terenkripsi <strong className="text-[#0A0A0A]">Supabase</strong>. Kami tidak membagikan, menjual, atau mendistribusikan data pribadi Anda kepada pihak ketiga mana pun di luar fungsionalitas platform EventSika.
            </p>
          </div>

          {/* 4. Hak Pengguna */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#CDF22B] border-2 border-[#0A0A0A] rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#0A0A0A] shrink-0">
                <FileText className="h-5 w-5 text-[#0A0A0A]" />
              </div>
              <h2 className="text-lg md:text-xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
                4. Hak Anda Sebagai Pengguna
              </h2>
            </div>
            <p className="text-sm md:text-base text-[#6B6B6B] font-medium leading-relaxed">
              Anda memiliki kontrol penuh atas data Anda sendiri. Melalui antarmuka platform, Anda dapat:
            </p>
            <ul className="space-y-3 pl-2">
              <li className="flex items-start gap-2.5 text-sm md:text-base text-[#6B6B6B] font-medium leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-[#1E45FB] mt-2 shrink-0" />
                <span>Melihat profil akun dan informasi akademik Anda yang terdaftar.</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm md:text-base text-[#6B6B6B] font-medium leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-[#1E45FB] mt-2 shrink-0" />
                <span>Memperbarui nama lengkap, program studi, dan pilihan minat Anda kapan saja secara mandiri.</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm md:text-base text-[#6B6B6B] font-medium leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-[#1E45FB] mt-2 shrink-0" />
                <span>Menghapus foto profil Anda dari penyimpanan media awan (Storage).</span>
              </li>
            </ul>
          </div>

          {/* Footer info */}
          <div className="pt-6 border-t border-stone-200 text-center text-xs text-[#6B6B6B] font-semibold">
            Terakhir diperbarui: 21 Juli 2026. Kebijakan ini dapat diperbarui sewaktu-waktu seiring dengan pengembangan fitur platform.
          </div>

        </div>
      </div>
    </main>
  );
}

