// app/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Aksi untuk menambahkan event baru
export async function addEvent(formData: FormData) {
  const eventData = {
    title: formData.get("title") as string,
    organizer: formData.get("organizer") as string,
    category: formData.get("category") as string,
    location: formData.get("location") as string,
    event_date: formData.get("event_date") as string,
    description: formData.get("description") as string,
    registration_link: formData.get("registration_link") as string,
    image_url: formData.get("image_url") as string, // Tambahkan ini
  };

  const supabase = createClient();
  const { error } = await supabase.from("events").insert([eventData]);

  if (error) {
    console.error("Error inserting data:", error);
    return { error: "Gagal menambahkan event." };
  }

  revalidatePath("/");
  redirect("/");
}

// Aksi untuk memperbarui preferensi user
export async function updateUserPreferences(formData: FormData) {
  const major = formData.get("major") as string;
  const interests = formData.get("interests") as string;

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    data: { major, interests },
  });

  if (error) {
    console.error("Error updating user preferences:", error);
    return { error: "Gagal menyimpan perubahan." };
  }

  revalidatePath("/profile", "layout");
  revalidatePath("/", "layout");
}

// Aksi untuk logout
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/login");
}
