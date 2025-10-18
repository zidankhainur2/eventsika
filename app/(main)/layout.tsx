import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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
