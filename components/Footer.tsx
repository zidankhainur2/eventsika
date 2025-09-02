// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full mt-16 border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
      <p>
        Dibuat oleh{" "}
        <a
          href="https://github.com/zidankhainur2/eventsika"
          target="_blank"
          rel="noreferrer"
          className="font-bold hover:underline"
        >
          Team EventSika
        </a>
      </p>
    </footer>
  );
}
