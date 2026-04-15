import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main
        id="main-content"
        className="w-full max-w-6xl mx-auto px-4 flex-grow"
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
