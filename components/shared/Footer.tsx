import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-4">
            <Link href="/"><Image
              src="/eventsika-logo-text.png"
              alt="EventSika Logo"
              width={165}
              height={32}
              className="w-24 h-auto object-contain"
            /></Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Platform pusat informasi kegiatan kemahasiswaan. Temukan dan ikuti seminar, workshop, kompetisi, dan kegiatan menarik lainnya di lingkungan kampus.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Beranda</Link></li>
              <li><Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Eksplorasi Event</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Bantuan</h4>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Hubungi Kami</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Kebijakan Privasi</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EventSika. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}