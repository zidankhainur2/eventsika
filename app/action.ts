"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FormState } from "./(types)/FormState";
import { headers } from "next/headers";

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

  const imageFile = formData.get("image_file") as File;

  // Validasi file
  if (!imageFile || imageFile.size === 0) {
    return { message: "Gambar poster wajib diisi.", type: "error" };
  }
  if (imageFile.size > 2 * 1024 * 1024) {
    // Batas 2MB
    return {
      message: "Ukuran gambar tidak boleh lebih dari 2MB.",
      type: "error",
    };
  }

  // Unggah gambar ke Supabase Storage
  const fileExt = imageFile.name.split(".").pop();
  const filePath = `${user.id}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("event-posters")
    .upload(filePath, imageFile);

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return { message: "Gagal mengunggah gambar.", type: "error" };
  }

  // Dapatkan URL publik dari gambar yang baru diunggah
  const {
    data: { publicUrl },
  } = supabase.storage.from("event-posters").getPublicUrl(filePath);

  const eventData = {
    title: formData.get("title") as string,
    organizer: formData.get("organizer") as string,
    category: formData.get("category") as string,
    location: formData.get("location") as string,
    event_date: formData.get("event_date") as string,
    description: formData.get("description") as string,
    registration_link: formData.get("registration_link") as string,
    image_url: publicUrl, // Gunakan URL dari Supabase Storage
    organizer_id: user.id,
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
      organizer_id: user.id,
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

  revalidatePath("/profile");
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

export async function signUpWithRedirect(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const origin = headers().get("origin");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/login`,
    },
  });

  if (error) {
    console.error("Sign up error:", error);
    return { error: error.message };
  }

  return redirect("/onboarding");
}

export async function saveUserInterests(formData: FormData) {
  "use server";

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Anda harus login untuk menyimpan minat." };
  }

  const interests = formData.get("interests") as string;

  if (!interests || interests.split(",").length < 3) {
    return { error: "Silakan pilih minimal 3 minat." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ interests: interests })
    .eq("id", user.id);

  if (error) {
    console.error("Error saving interests:", error);
    return { error: "Gagal menyimpan minat Anda." };
  }

  revalidatePath("/");
  redirect("/");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/login");
}
