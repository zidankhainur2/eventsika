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
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Anda harus login terlebih dahulu.", type: "error" };
  }

  const major = formData.get("major") as string;
  const interests = formData.get("interests") as string;

  const { error } = await supabase
    .from("profiles")
    .update({ major, interests })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating user preferences:", error);
    return {
      message: `Gagal menyimpan perubahan: ${error.message}`,
      type: "error",
    };
  }

  revalidatePath("/profile");
  revalidatePath("/");
  return { message: "Preferensi berhasil disimpan!", type: "success" };
}

export async function submitOrganizerApplication(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Anda harus login untuk mengajukan.", type: "error" };
  }

  // Cek apakah user sudah pernah mengajukan dan masih pending
  const { data: existingApplication, error: checkError } = await supabase
    .from("organizer_applications")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .maybeSingle();

  if (checkError) {
    console.error("Error checking existing application:", checkError);
    return { message: "Terjadi kesalahan pada server.", type: "error" };
  }

  if (existingApplication) {
    return {
      message: "Anda sudah memiliki pengajuan yang sedang ditinjau.",
      type: "error",
    };
  }

  const applicationData = {
    user_id: user.id,
    organization_name: formData.get("organization_name") as string,
    contact_person: formData.get("contact_person") as string,
  };

  // Validasi sederhana
  if (!applicationData.organization_name || !applicationData.contact_person) {
    return { message: "Semua field wajib diisi.", type: "error" };
  }

  const { error } = await supabase
    .from("organizer_applications")
    .insert([applicationData]);

  if (error) {
    console.error("Error inserting application:", error);
    return {
      message: `Gagal mengirim pengajuan: ${error.message}`,
      type: "error",
    };
  }

  revalidatePath("/profile"); // Perbarui cache halaman profil
  return {
    message: "Terima kasih! Pengajuan Anda akan segera kami tinjau.",
    type: "success",
  };
}

export async function approveOrganizerApplication(
  applicationId: string,
  userId: string
) {
  const supabase = createClient();

  // Pastikan hanya super_admin yang bisa menjalankan ini
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "super_admin") throw new Error("Not authorized");

  // 1. Ubah peran di tabel 'profiles'
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ role: "organizer" })
    .eq("id", userId);

  if (profileError) {
    console.error("Error updating profile role:", profileError);
    return { message: "Gagal mengubah peran pengguna.", type: "error" };
  }

  // 2. Ubah status di tabel 'organizer_applications'
  const { error: appError } = await supabase
    .from("organizer_applications")
    .update({ status: "approved" })
    .eq("id", applicationId);

  if (appError) {
    console.error("Error updating application status:", appError);
    // Rollback? Tergantung kebutuhan, untuk sekarang kita log saja.
    return { message: "Gagal memperbarui status pengajuan.", type: "error" };
  }

  revalidatePath("/admin"); // Refresh halaman admin
  revalidatePath("/profile"); // Refresh halaman profil user terkait
}

// Fungsi untuk MENOLAK pengajuan
export async function rejectOrganizerApplication(applicationId: string) {
  const supabase = createClient();

  // Security check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "super_admin") throw new Error("Not authorized");

  const { error } = await supabase
    .from("organizer_applications")
    .update({ status: "rejected" })
    .eq("id", applicationId);

  if (error) {
    console.error("Error rejecting application:", error);
    return { message: "Gagal menolak pengajuan.", type: "error" };
  }

  revalidatePath("/admin");
}

// Aksi untuk logout
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/login");
}
