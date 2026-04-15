"use client";

import { Toaster as SonnerToaster } from "sonner";

export function ToastProvider() {
  return (
    <SonnerToaster
      position="top-center"
      toastOptions={{
        style: {
          background: "white",
          border: "1px solid #e7e5e4", // stone-200
          borderRadius: "1.25rem", // rounded-2xl
          padding: "1rem",
        },
        className: "font-sans shadow-lg",
      }}
      // Menambahkan icon sukses/error kustom jika diinginkan
      richColors
      closeButton
    />
  );
}
