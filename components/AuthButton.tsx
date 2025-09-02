// src/components/AuthButton.tsx
import { signOut } from "@/app/action";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AuthButton() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <Link href="/profile" className="text-sm hover:underline">
        <span className="text-sm">Halo, {user.email}</span>
      </Link>
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-red-500 text-white hover:bg-red-600">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-4 rounded-md no-underline bg-accent text-white hover:bg-orange-600"
    >
      Login
    </Link>
  );
}
