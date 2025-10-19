import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { FiTarget, FiLink, FiZap } from "react-icons/fi";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";

const teamMembers = [
  {
    name: "Siti Nurlaela",
    role: "Sprint Master & UI/UX Designer",
    imageUrl:
      "https://ojulwbepgvaidozbrxae.supabase.co/storage/v1/object/sign/event-images/Salinan%20_MG_6531_2_11zon.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OTYwNDk1OS0zZTY3LTRlNmMtYmU4Yy1kNTg0OGY2MTY5MmYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvU2FsaW5hbiBfTUdfNjUzMV8yXzExem9uLmpwZyIsImlhdCI6MTc2MDg3NzIwMywiZXhwIjoxNzkyNDEzMjAzfQ.smElcPW2ux23epfIXt6vGZvMqtDfiIo-M0foZo9J01M",
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
    <main className="min-h-screen py-8 sm:py-12">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Tentang Kami" }]}
      />

      {/* Hero Section */}
      <section className="text-center py-16">
        <Image
          src="/eventsika-logo.png"
          alt="EventSika Logo"
          width={100}
          height={100}
          className="mx-auto mb-4"
        />
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary tracking-tight">
          Dari Mahasiswa, Untuk Mahasiswa
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          EventSika lahir dari sebuah ide sederhana: bagaimana jika semua
          informasi event kampus UNSIKA ada di satu tempat yang mudah diakses?
        </p>
      </section>

      {/* Misi Kami */}
      <section className="my-16">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-text-primary">
            Misi Kami
          </h2>
          <p className="mt-2 text-muted-foreground">
            Tiga pilar utama yang menjadi fondasi EventSika.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center p-6">
            <FiLink className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold font-heading">Menghubungkan</h3>
            <p className="text-muted-foreground mt-2">
              Menjadi platform terpusat yang menghubungkan mahasiswa dengan
              berbagai peluang dan kegiatan di dalam maupun luar kampus.
            </p>
          </Card>
          <Card className="text-center p-6">
            <FiTarget className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold font-heading">Memberdayakan</h3>
            <p className="text-muted-foreground mt-2">
              Memberikan rekomendasi yang dipersonalisasi agar setiap mahasiswa
              dapat menemukan event yang sesuai dengan minat dan jurusannya.
            </p>
          </Card>
          <Card className="text-center p-6">
            <FiZap className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold font-heading">Memudahkan</h3>
            <p className="text-muted-foreground mt-2">
              Menyediakan alat yang mudah bagi para penyelenggara event untuk
              menjangkau audiens yang lebih luas dan tepat sasaran.
            </p>
          </Card>
        </div>
      </section>

      {/* Tim di Balik Layar */}
      <section className="my-16">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-text-primary">
            Tim di Balik Layar
          </h2>
        </div>
        <div className="flex justify-center flex-wrap gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={member.imageUrl} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-lg text-center">{member.name}</p>
                <p className="text-muted-foreground text-center">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hubungi Kami */}
      <section className="text-center my-16 py-12 bg-muted/50 rounded-lg">
        <h2 className="font-heading text-3xl font-bold text-text-primary">
          Punya Ide atau Masukan?
        </h2>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
          Kami selalu terbuka untuk kolaborasi dan ide-ide segar untuk membuat
          EventSika menjadi lebih baik lagi.
        </p>
        <a
          href="mailto:contact@eventsika.com"
          className="mt-6 inline-block bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Hubungi Kami
        </a>
      </section>
    </main>
  );
}
