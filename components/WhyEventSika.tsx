import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FiUserCheck, FiZap, FiGrid } from "react-icons/fi";

const features = [
  {
    icon: <FiUserCheck className="h-8 w-8 text-primary" />,
    title: "Rekomendasi Personal",
    description:
      "Dapatkan rekomendasi event yang paling relevan dengan jurusan dan minatmu.",
  },
  {
    icon: <FiZap className="h-8 w-8 text-primary" />,
    title: "Daftar Cepat & Praktis",
    description:
      "Simpan event dan akses link pendaftaran hanya dengan satu klik.",
  },
  {
    icon: <FiGrid className="h-8 w-8 text-primary" />,
    title: "Semua Event di Satu Tempat",
    description:
      "Tidak perlu lagi mencari info di banyak tempat. Semua ada di sini.",
  },
];

export default function WhyEventSika() {
  return (
    <section className="my-16 sm:my-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
            Kenapa Harus Pilih EventSika?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="text-center p-6 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <CardHeader>
                <div className="mx-auto bg-primary-subtle p-3 rounded-full w-max mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="font-heading text-xl">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardDescription>{feature.description}</CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
