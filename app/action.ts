// app/action.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Tipe untuk state form
export interface FormState {
  message: string;
  type: "success" | "error";
}

// Aksi untuk menambahkan event baru dengan validasi
export async function addEvent(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const eventData = {
    title: formData.get("title") as string,
    organizer: formData.get("organizer") as string,
    category: formData.get("category") as string,
    location: formData.get("location") as string,
    event_date: formData.get("event_date") as string,
    description: formData.get("description") as string,
    registration_link: formData.get("registration_link") as string,
    image_url: formData.get("image_url") as string,
  };

  // Validasi Sederhana di Server
  if (
    !eventData.title ||
    !eventData.organizer ||
    !eventData.event_date ||
    !eventData.registration_link
  ) {
    return {
      message: "Field yang wajib diisi tidak boleh kosong.",
      type: "error",
    };
  }

  // Validasi tanggal tidak boleh di masa lalu
  if (new Date(eventData.event_date) < new Date()) {
    return {
      message: "Tanggal event tidak boleh di masa lalu.",
      type: "error",
    };
  }

  const supabase = createClient();
  const { error } = await supabase.from("events").insert([eventData]);

  if (error) {
    console.error("Error inserting data:", error);
    return {
      message: `Gagal menambahkan event: ${error.message}`,
      type: "error",
    };
  }

  revalidatePath("/");
  redirect("/"); // Redirect hanya jika sukses total
}

// Aksi untuk memperbarui preferensi user dengan validasi
export async function updateUserPreferences(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const major = formData.get("major") as string;
  const interests = formData.get("interests") as string;

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    data: { major, interests },
  });

  if (error) {
    console.error("Error updating user preferences:", error);
    return {
      message: `Gagal menyimpan perubahan: ${error.message}`,
      type: "error",
    };
  }

  revalidatePath("/profile", "layout");
  revalidatePath("/", "layout");
  return { message: "Preferensi berhasil disimpan!", type: "success" };
}

// Aksi untuk logout
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/login");
}
