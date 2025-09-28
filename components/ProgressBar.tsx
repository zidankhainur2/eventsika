"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    // Ini adalah event listener untuk link kustom atau tombol yang memicu navigasi
    const handleMutation = () => {
      const allLinks = document.querySelectorAll("a");
      allLinks.forEach((link) => {
        link.addEventListener("click", () => {
          NProgress.start();
        });
      });
    };

    // Panggil saat komponen dimuat
    handleMutation();

    // Panggil lagi jika DOM berubah (misalnya, setelah data dimuat)
    const observer = new MutationObserver(handleMutation);
    observer.observe(document.body, { childList: true, subtree: true });

    // Membersihkan saat komponen di-unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // Komponen ini tidak me-render apa pun, hanya mengelola NProgress
}
