import Link from "next/link";
import { Button } from "./ui/button";

export default function CtaSection() {
  return (
    <section className="my-16 sm:my-24">
      <div className="max-w-4xl mx-auto text-center bg-surface p-8 sm:p-12 rounded-xl shadow-lg border border-border">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
          Jelajahi event yang kamu suka dan atur notifikasi biar nggak
          ketinggalan keseruannya!
        </h2>
        <Button asChild size="lg" className="mt-8 font-semibold">
          <Link href="#events">Temukan Eventmu!</Link>
        </Button>
      </div>
    </section>
  );
}
