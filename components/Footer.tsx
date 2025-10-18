import Image from "next/image";
import Link from "next/link";
import { Separator } from "./ui/separator";

export default function Footer() {
  return (
    <footer className="w-full mt-16 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Image
              src="/eventsika-logo.png"
              alt="EventSika Logo"
              width={32}
              height={32}
            />
            <span className="font-heading text-xl font-bold text-primary">
              EventSika
            </span>
          </div>

          {/* Menu Section */}
          <div className="flex items-center gap-6 text-sm font-medium text-text-secondary">
            <Link
              href="/about"
              className="hover:text-primary transition-colors"
            >
              Tentang Kami
            </Link>
            <a
              href="mailto:contact@eventsika.com"
              className="hover:text-primary transition-colors"
            >
              Kontak
            </a>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-center text-sm text-text-tertiary">
          <p>
            &copy; {new Date().getFullYear()} EventSika. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
