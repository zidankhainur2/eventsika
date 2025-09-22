"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FormState } from "./(types)/FormState"; // Buat tipe ini di file terpisah jika perlu

// Helper untuk verifikasi Super Admin
async function verifySuperAdmin(supabase: ReturnType<typeof createClient>) {
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
}

export async function addEvent(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Anda harus login untuk membuat event.", type: "error" };
  }

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

  if (!eventData.title || !eventData.organizer || !eventData.event_date) {
    return {
      message: "Field yang wajib diisi tidak boleh kosong.",
      type: "error",
    };
  }

  const { error } = await supabase.from("events").insert([
    {
      ...eventData,
      organizer_id: user.id, // PERBAIKAN: Tambahkan ID penyelenggara
    },
  ]);

  if (error) {
    console.error("Error inserting data:", error);
    return {
      message: `Gagal menambahkan event: ${error.message}`,
      type: "error",
    };
  }

  revalidatePath("/");
  redirect("/");
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
  userId: string,
  prevState: FormState | null,
  formData: FormData
): Promise<FormState | null> {
  const supabase = createClient();
  try {
    await verifySuperAdmin(supabase);

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role: "organizer" })
      .eq("id", userId);
    if (profileError) throw profileError;

    const { error: appError } = await supabase
      .from("organizer_applications")
      .update({ status: "approved" })
      .eq("id", applicationId);
    if (appError) throw appError;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan.";
    return { message, type: "error" };
  }
  revalidatePath("/admin");
  revalidatePath("/profile");
  return null;
}

export async function rejectOrganizerApplication(
  applicationId: string,
  prevState: FormState | null,
  formData: FormData
): Promise<FormState | null> {
  const supabase = createClient();
  try {
    await verifySuperAdmin(supabase);
    const { error } = await supabase
      .from("organizer_applications")
      .update({ status: "rejected" })
      .eq("id", applicationId);
    if (error) throw error;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan.";
    return { message, type: "error" };
  }
  revalidatePath("/admin");
  return null;
}

// Aksi untuk logout
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/login");
}
