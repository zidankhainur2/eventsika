// src/app/profile/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { updateUserPreferences } from "../action";

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <main className="bg-neutral-light min-h-screen p-4 sm:p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-primary mb-2">Profil Saya</h1>
        <p className="text-gray-600 mb-6">Email: {user.email}</p>

        <form action={updateUserPreferences} className="space-y-6">
          <div>
            <label
              htmlFor="major"
              className="block text-sm font-medium text-neutral-dark"
            >
              Jurusan
            </label>
            <input
              type="text"
              name="major"
              id="major"
              // Tampilkan data yang sudah ada sebagai nilai default
              defaultValue={user.user_metadata.major || ""}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label
              htmlFor="interests"
              className="block text-sm font-medium text-neutral-dark"
            >
              Minat
            </label>
            <input
              type="text"
              name="interests"
              id="interests"
              // Tampilkan data yang sudah ada sebagai nilai default
              defaultValue={user.user_metadata.interests || ""}
              placeholder="Contoh: Programming, Desain, Musik"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
            />
            <p className="mt-2 text-xs text-gray-500">
              Pisahkan beberapa minat dengan koma (,).
            </p>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
