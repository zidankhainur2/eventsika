"use client";

import { useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";

interface ButtonProps {
  link: string;
  user: User | null;
}

export default function RegisterButton({ link, user }: ButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!user) {
      router.push("/login");
    } else {
      window.open(link, "_blank", "noopener noreferrer");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-center block bg-accent text-on-accent font-bold py-3 px-10 rounded-lg text-lg hover:bg-yellow-500 transition-colors"
    >
      Daftar Sekarang
    </button>
  );
}
