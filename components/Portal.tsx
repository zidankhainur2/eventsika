"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
}

export default function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Hanya render di client-side setelah komponen ter-mount
  // dan pastikan document.body tersedia.
  return mounted ? createPortal(children, document.body) : null;
}
