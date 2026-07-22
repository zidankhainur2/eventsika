import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FiTarget, FiLink, FiZap } from "react-icons/fi";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SplashBlobBlue, SplashBlobLime, SplashDotBlue } from "@/components/ui/splashes";

export const metadata: Metadata = {
  title: "Tentang Kami — EventSika",
  description: "Cari tahu visi, misi, dan tim di balik pengembangan EventSika, platform penemuan event terbaik di UNSIKA.",
};

const teamMembers = [
  {
    name: "Siti Nurlaela",
    role: "Sprint Master & UI/UX Designer",
    imageUrl:
      "https://ojulwbepgvaidozbrxae.supabase.co/storage/v1/object/sign/event-images/Salinan%20_MG_6531_2_11zon.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OTYwNDk1OS0zZTY3LTRlNmMtYmU4Yy1kNTg0OGY2MTY5MmYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvU2FsaW5hbiBfTUdfNjUzMV8yXzExem9uLmpwZyIsImlhdCI6MTc2MDg3NzIwMywiZXhwIjoxNzkyNDEzMjM3fQ.smElcPW2ux23epfIXt6vGZvMqtDfiIo-M0foZo9J01M",
  },
  {
    name: "Ahmad Fauzidan",
    role: "Team Leader & Fullstack Developer",
    imageUrl:
      "https://ojulwbepgvaidozbrxae.supabase.co/storage/v1/object/sign/event-images/dann.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OTYwNDk1OS0zZTY3LTRlNmMtYmU4Yy1kNTg0OGY2MTY5MmYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvZGFubi5qcGciLCJpYXQiOjE3NjA4NzY0NzUsImV4cCI6MTc5MjQxMjQ3NX0.g54kAZgaNP__UMOiAGBpU8lM6r0Zgfw6MUF_XEddo2Q",
  },
  {
    name: "Muhammad Hafiz",
    role: "Sprint Master & UI/UX Designer",
    imageUrl:
      "https://ojulwbepgvaidozbrxae.supabase.co/storage/v1/object/sign/event-images/Salinan%20_MG_6541_1_11zon.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OTYwNDk1OS0zZTY3LTRlNmMtYmU4Yy1kNTg0OGY2MTY5MmYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvU2FsaW5hbiBfTUdfNjU0MV8xXzExem9uLmpwZyIsImlhdCI6MTc2MDg3NzIzNywiZXhwIjoxNzkyNDEzMjM3fQ.SwI6MUIaXs-hcpf0cGU_yz7ZkxhGE_iT7fPQrZ3jkDA",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen py-8 sm:py-12 bg-white relative overflow-hidden">
      {/* Decorative Splashes */}
      <SplashBlobBlue className="absolute -top-20 -right-20 w-96 h-96 pointer-events-none z-0 opacity-10" />
      <SplashBlobLime className="absolute -bottom-24 -left-20 w-80 h-80 pointer-events-none z-0" />

      <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Tentang Kami" }]}
        />

        {/* Hero Section */}
        <section className="text-center py-16">
          <Image
            src="/eventsika-logo.png"
            alt="EventSika Logo"
            width={200}
            height={32}
            className="mx-auto mb-8"
          />
          <h1 className="text-2xl sm:text-5xl font-extrabold text-[#1E45FB] tracking-tight uppercase leading-none mb-4">
            Dari Mahasiswa,<br />
            <span className="text-[#0A0A0A]">Untuk Mahasiswa</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-[#6B6B6B] font-semibold leading-relaxed">
            EventSika lahir dari sebuah ide sederhana: bagaimana jika semua
            informasi event kampus UNSIKA ada di satu tempat yang mudah diakses?
          </p>
        </section>

        {/* Misi Kami */}
        <section className="my-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
              Misi Kami
            </h2>
            <p className="mt-2 text-[#6B6B6B] font-semibold">
              Tiga pilar utama yang menjadi fondasi EventSika.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-white border-2 border-[#0A0A0A] rounded-xl shadow-[4px_4px_0px_#0A0A0A] hover:shadow-[2px_2px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#CDF22B] border-2 border-[#0A0A0A] rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#0A0A0A]">
                <FiLink className="h-8 w-8 text-[#0A0A0A]" />
              </div>
              <h3 className="text-xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">Menghubungkan</h3>
              <p className="text-[#6B6B6B] font-medium mt-2">
                Menjadi platform terpusat yang menghubungkan mahasiswa dengan
                berbagai peluang dan kegiatan di dalam maupun luar kampus.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white border-2 border-[#0A0A0A] rounded-xl shadow-[4px_4px_0px_#0A0A0A] hover:shadow-[2px_2px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#CDF22B] border-2 border-[#0A0A0A] rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#0A0A0A]">
                <FiTarget className="h-8 w-8 text-[#0A0A0A]" />
              </div>
              <h3 className="text-xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">Memberdayakan</h3>
              <p className="text-[#6B6B6B] font-medium mt-2">
                Dapatkan rekomendasi personal berdasarkan minat agar setiap mahasiswa
                dapat menemukan event yang sesuai dengan minat dan jurusannya.
              </p>
            </div>

            <div className="text-center p-6 bg-white border-2 border-[#0A0A0A] rounded-xl shadow-[4px_4px_0px_#0A0A0A] hover:shadow-[2px_2px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#CDF22B] border-2 border-[#0A0A0A] rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#0A0A0A]">
                <FiZap className="h-8 w-8 text-[#0A0A0A]" />
              </div>
              <h3 className="text-xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">Memudahkan</h3>
              <p className="text-[#6B6B6B] font-medium mt-2">
                Menyediakan alat yang mudah bagi para penyelenggara event untuk
                menjangkau audiens yang lebih luas dan tepat sasaran.
              </p>
            </div>
          </div>
        </section>

        {/* Tim di Balik Layar */}
        <section className="my-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
              Tim di Balik Layar
            </h2>
          </div>
          <div className="flex justify-center flex-wrap gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="flex flex-col items-center gap-4 bg-white border-2 border-[#0A0A0A] p-6 rounded-xl shadow-[4px_4px_0px_#0A0A0A] w-full sm:w-64 hover:shadow-[2px_2px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                <Avatar className="h-24 w-24 border-2 border-[#0A0A0A] ring-4 ring-[#CDF22B]/30">
                  <AvatarImage src={member.imageUrl} alt={member.name} className="object-cover" />
                  <AvatarFallback className="font-extrabold uppercase text-lg">{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="font-extrabold text-lg text-[#0A0A0A] uppercase tracking-tight">{member.name}</p>
                  <p className="text-sm text-[#6B6B6B] font-semibold mt-1">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hubungi Kami */}
        <section className="text-center my-16 py-12 bg-[#F7F7F5] border-2 border-[#0A0A0A] rounded-xl shadow-[4px_4px_0px_#0A0A0A] relative overflow-hidden">
          <SplashBlobBlue className="absolute -top-10 -right-10 w-48 h-48 pointer-events-none z-0 opacity-10" />
          <SplashDotBlue className="absolute bottom-4 left-6 w-6 h-6 pointer-events-none z-0" />
          <div className="relative z-10 space-y-4 px-4">
            <h2 className="text-3xl font-extrabold text-[#0A0A0A] uppercase tracking-tight">
              Punya Ide atau Masukan?
            </h2>
            <p className="text-[#6B6B6B] max-w-xl mx-auto font-semibold">
              Kami selalu terbuka untuk kolaborasi dan ide-ide segar untuk membuat
              EventSika menjadi lebih baik lagi.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-block bg-[#1E45FB] text-white border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] transition-all duration-100 hover:shadow-[2px_2px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] font-extrabold uppercase tracking-wide rounded-lg px-8 py-3.5"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
