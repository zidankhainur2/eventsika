import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import FaqAccordion from "@/components/faq/FaqAccordion";

export const metadata: Metadata = {
  title: "Pertanyaan Umum (FAQ)",
  description: "Pertanyaan yang sering diajukan mengenai cara kerja platform EventSika dan sistem rekomendasi berbasis kecerdasan buatan.",
};

export default function FaqPage() {
  return (
    <main className="min-h-screen py-8 sm:py-12 container mx-auto px-4 md:px-8 max-w-4xl">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />

      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="font-heading text-4xl font-bold text-foreground tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
          Temukan jawaban cepat untuk pertanyaan yang sering diajukan mengenai penggunaan platform EventSika.
        </p>
      </section>

      {/* FAQ Accordion List (Client Side Interactive Component) */}
      <FaqAccordion />
    </main>
  );
}
