// src/components/AuthButton.tsx
import Link from "next/link";
import { signOut } from "@/app/action";

export default function AuthButton({ user }: { user: any }) {
  return user ? (
    <div className="flex items-center gap-4">
      <Link
        href="/profile"
        className="text-sm font-medium text-neutral-dark/80 hover:text-primary transition-colors"
        title={user.email}
      >
        <span className="hidden lg:inline truncate max-w-[150px]">
          Halo, {user.email}
        </span>
        <span className="lg:hidden">Profil</span>
      </Link>
      <form action={signOut}>
        <button className="py-2 px-3 rounded-md text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-4 rounded-md text-sm no-underline bg-accent text-on-accent font-semibold hover:bg-yellow-500 transition-colors"
    >
      Login
    </Link>
  );
}
