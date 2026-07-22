import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description: "Hubungi tim pengembang EventSika. Kirimkan pertanyaan, saran, kritik, atau ide kolaborasi Anda di sini.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen py-8 sm:py-12 container mx-auto px-4 md:px-8 max-w-5xl">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Hubungi Kami" }]}
      />

      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="font-heading text-4xl font-bold text-foreground tracking-tight">
          Hubungi Kami
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
          Miliki pertanyaan, ide kolaborasi, atau masukan untuk pengembangan EventSika? Kirim pesan Anda di bawah.
        </p>
      </section>

      {/* Contact Form and Information Grid (Client Side Interactive Component) */}
      <ContactForm />
    </main>
  );
}
