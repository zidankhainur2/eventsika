"use client";

import { useState } from "react";
import { FiChevronDown, FiHelpCircle } from "react-icons/fi";
import { Card } from "@/components/ui/card";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "Apa itu EventSika?",
    answer: "EventSika adalah platform pusat informasi kegiatan dan event kampus Universitas Singaperbangsa Karawang (UNSIKA). Platform ini dirancang untuk memudahkan mahasiswa menemukan seminar, workshop, kompetisi, dan kegiatan organisasi yang relevan.",
  },
  {
    question: "Bagaimana cara kerja Sistem Rekomendasi di EventSika?",
    answer: "EventSika menggunakan teknologi Hybrid Recommendation System. Sistem menggabungkan pencarian semantik AI (menggunakan Hugging Face API Vector Embeddings dengan bobot 80%) dan pencocokan berbasis aturan/program studi (dengan bobot 20%) untuk memberikan rekomendasi event yang paling sesuai dengan minat dan program studi Anda.",
  },
  {
    question: "Mengapa saya tidak melihat rekomendasi event yang personal?",
    answer: "Rekomendasi personal membutuhkan data minat Anda. Silakan masuk ke akun Anda, lalu kunjungi halaman Profil untuk memilih minimal 3 minat/topik favorit Anda. Jika data minat belum lengkap, sistem akan menampilkan rekomendasi default berupa event terbaru atau terpopuler.",
  },
  {
    question: "Bagaimana cara mempublikasikan event saya di EventSika?",
    answer: "Untuk membuat dan mempublikasikan event, Anda harus mendaftar sebagai Penyelenggara (Organizer). Anda dapat mengajukan permohonan melalui halaman Profil -> Ajukan Penyelenggara. Setelah disetujui oleh admin, Anda akan memiliki akses ke Dashboard Organizer untuk mengelola event Anda.",
  },
  {
    question: "Apakah mahasiswa luar UNSIKA bisa mendaftar?",
    answer: "Saat ini, pendaftaran akun dan sistem rekomendasi dioptimalkan untuk mahasiswa UNSIKA. Namun, informasi event yang bersifat publik dapat dijelajahi oleh siapa saja secara bebas.",
  },
  {
    question: "Apakah platform EventSika ini berbayar?",
    answer: "Tidak, platform EventSika sepenuhnya gratis untuk digunakan oleh seluruh mahasiswa dan organisasi mahasiswa di lingkungan kampus UNSIKA.",
  },
];

function AccordionItem({ item, isOpen, onClick }: { item: FaqItem; isOpen: boolean; onClick: () => void }) {
  return (
    <Card className="border border-border rounded-2xl overflow-hidden shadow-sm transition-all duration-200 bg-card text-card-foreground">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left font-semibold text-foreground hover:bg-muted/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-3">
          <FiHelpCircle className="h-5 w-5 text-primary shrink-0" />
          {item.question}
        </span>
        <FiChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] border-t border-border" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <p className="p-5 text-sm text-muted-foreground leading-relaxed">
          {item.answer}
        </p>
      </div>
    </Card>
  );
}

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 my-8">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={index}
          item={faq}
          isOpen={openIndex === index}
          onClick={() => handleToggle(index)}
        />
      ))}
    </div>
  );
}
