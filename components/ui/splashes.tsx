import React from "react";

// Blob organik besar — untuk hero section
export function SplashBlobBlue({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M200 40 C280 20, 370 80, 380 160 C390 240, 340 330, 260 360 C180 390, 80 360, 40 280 C0 200, 20 80, 100 50 C140 35, 160 55, 200 40Z"
        fill="#1E45FB"
        opacity="0.15"
      />
    </svg>
  );
}

// Blob organik — lime green
export function SplashBlobLime({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 300"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M150 20 C230 10, 290 70, 280 150 C270 230, 200 280, 120 270 C40 260, -10 190, 10 110 C30 30, 90 30, 150 20Z"
        fill="#CDF22B"
        opacity="0.6"
      />
    </svg>
  );
}

// Lingkaran solid kecil — aksen
export function SplashDotBlue({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="30" cy="30" r="30" fill="#1E45FB" />
    </svg>
  );
}

// Persegi outline — aksen geometrik
export function SplashSquareLime({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="72"
        height="72"
        stroke="#CDF22B"
        strokeWidth="8"
      />
    </svg>
  );
}
