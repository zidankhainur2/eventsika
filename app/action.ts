"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FormState } from "./(types)/FormState";
import { headers } from "next/headers";
import {
  generateEmbedding,
  buildInterestText,
  buildEventEmbeddingText,
} from "@/lib/embedding";
import { type Event, type RecommendationTestResult } from "@/lib/types";
import { getChildTagsForInterests } from "@/lib/taxonomy";

function parseInterests(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function appendWIBTimezone(dateTimeStr: string) {
  if (!dateTimeStr) return dateTimeStr;
  
  // Input datetime-local biasanya berformat "YYYY-MM-DDTHH:mm" (16 karakter)
  if (dateTimeStr.length === 16) {
    return `${dateTimeStr}:00+07:00`; // Tambahkan detik dan zona waktu WIB (+07:00)
  }
  // Jika kebetulan sudah mengandung detik "YYYY-MM-DDTHH:mm:ss" (19 karakter)
  if (dateTimeStr.length === 19) {
    return `${dateTimeStr}+07:00`;
  }
  
  return dateTimeStr;
}

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

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Ganti spasi dengan -
    .replace(/[^\w\-]+/g, "") // Hapus karakter non-alfanumerik
    .replace(/\-\-+/g, "-"); // Ganti -- ganda dengan satu -
}

function processTags(formData: FormData): string[] | null {
  const tags = formData.getAll("tags") as string[];
  if (!tags || tags.length === 0) return null;

  return tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0);
}

export async function addEvent(
  prevState: FormState,
  formData: FormData,
): Promise<FormState & { slug?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const tags = formData.getAll("tags") as string[];
  const eventContent = buildEventEmbeddingText(
    formData.get("title") as string,
    formData.get("description") as string,
    tags,
  );

  if (!user) {
    return { message: "Anda harus login untuk membuat event.", type: "error" };
  }

  const targetMajors = formData.getAll("target_majors") as string[];
  if (targetMajors.length === 0) {
    return {
      message: "Anda harus memilih setidaknya satu target audiens.",
      type: "error",
    };
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

  const embedding = await generateEmbedding(eventContent);

  // Dapatkan URL publik dari gambar yang baru diunggah
  const {
    data: { publicUrl },
  } = supabase.storage.from("event-posters").getPublicUrl(filePath);

  const title = formData.get("title") as string;
  const slug = slugify(title);
  const rawStartDate = formData.get("start_date") as string;
  const rawEndDate = formData.get("end_date") as string;
  const startDate = formData.get("start_date") as string;
  const endDate = formData.get("end_date") as string;

  if (new Date(startDate) >= new Date(endDate)) {
    return {
      message: "Waktu selesai (end date) harus lebih dari waktu mulai.",
      type: "error",
    };
  }

  const eventData = {
    title: title,
    slug: slug,
    organizer: formData.get("organizer") as string,
    category: formData.get("category") as string,
    location: formData.get("location") as string,
    start_date: startDate,
    end_date: endDate,
    description: formData.get("description") as string,
    registration_link: formData.get("registration_link") as string,
    image_url: publicUrl,
    organizer_id: user.id,
    target_majors: targetMajors,
    tags: processTags(formData),
    embedding: embedding,
  };

  if (!eventData.title || !eventData.organizer || !eventData.end_date) {
    return {
      message: "Field yang wajib diisi tidak boleh kosong.",
      type: "error",
    };
  }

  const { data, error } = await supabase
    .from("events")
    .insert([eventData])
    .select("slug")
    .single();

  if (error) {
    console.error("Error inserting data:", error);
    return {
      message: `Gagal menambahkan event: ${error.message}`,
      type: "error",
    };
  }

  revalidatePath("/");
  return {
    message: "Event berhasil ditambahkan!",
    type: "success",
    slug: data?.slug,
  };
}

export async function updateEvent(
  prevState: FormState,
  formData: FormData,
): Promise<FormState & { slug?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Anda harus login untuk mengubah event.", type: "error" };
  }

  const tags = formData.getAll("tags") as string[];
  const eventContent = buildEventEmbeddingText(
    formData.get("title") as string,
    formData.get("description") as string,
    tags,
  );

  const targetMajors = formData.getAll("target_majors") as string[];
  if (targetMajors.length === 0) {
    return {
      message: "Anda harus memilih setidaknya satu target audiens.",
      type: "error",
    };
  }

  const eventId = formData.get("id") as string;
  const currentImageUrl = formData.get("current_image_url") as string;
  const imageFile = formData.get("image_file") as File;
  let imageUrl = currentImageUrl;

  // Cek apakah ada file gambar baru yang diunggah
  if (imageFile && imageFile.size > 0) {
    if (imageFile.size > 2 * 1024 * 1024) {
      // Batas 2MB
      return {
        message: "Ukuran gambar tidak boleh lebih dari 2MB.",
        type: "error",
      };
    }

    const fileExt = imageFile.name.split(".").pop();
    const filePath = `${user.id}/${eventId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("event-posters")
      .upload(filePath, imageFile, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { message: "Gagal mengunggah gambar baru.", type: "error" };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("event-posters").getPublicUrl(filePath);
    imageUrl = publicUrl;
  }

  const embedding = await generateEmbedding(eventContent);

  const title = formData.get("title") as string;
  const slug = slugify(title);
  const startDate = formData.get("start_date") as string;
  const endDate = formData.get("end_date") as string;

  if (new Date(startDate) >= new Date(endDate)) {
    return {
      message: "Waktu selesai (end date) harus lebih dari waktu mulai.",
      type: "error",
    };
  }

  const eventData = {
    title: title,
    slug: slug,
    organizer: formData.get("organizer") as string,
    category: formData.get("category") as string,
    location: formData.get("location") as string,
    start_date: startDate,
    end_date: endDate,
    description: formData.get("description") as string,
    registration_link: formData.get("registration_link") as string,
    image_url: imageUrl,
    target_majors: targetMajors,
    tags: processTags(formData),
    embedding: embedding,
  };

  const { error } = await supabase
    .from("events")
    .update(eventData)
    .match({ id: eventId, organizer_id: user.id });

  if (error) {
    console.error("Error updating data:", error);
    return {
      message: `Gagal memperbarui event: ${error.message}`,
      type: "error",
    };
  }

  revalidatePath("/");
  revalidatePath(`/event/${slug}`);
  revalidatePath("/organizer/dashboard");
  return {
    message: "Event berhasil diperbarui!",
    type: "success",
    slug: slug,
  };
}

export async function deleteEvent(eventId: string): Promise<FormState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Anda tidak terautentikasi.", type: "error" };
  }

  const { data: eventData } = await supabase
    .from("events")
    .select("image_url")
    .match({ id: eventId, organizer_id: user.id })
    .single();

  const { error } = await supabase
    .from("events")
    .delete()
    .match({ id: eventId, organizer_id: user.id });

  if (error) {
    return {
      message: `Gagal menghapus event: ${error.message}`,
      type: "error",
    };
  }

  if (eventData?.image_url) {
    const filePath = eventData.image_url
      .split("/")
      .slice(-2)
      .join("/")
      .split("?")[0];
    await supabase.storage.from("event-posters").remove([filePath]);
  }

  revalidatePath("/dashboard/events");
  revalidatePath("/");
  return { message: "Event berhasil dihapus.", type: "success" };
}

export async function updateUserPreferences(
  prevState: FormState,
  formData: FormData,
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
  formData: FormData,
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
  p0: null,
  p1: FormData,
  applicationId: string,
  userId: string,
): Promise<FormState> {
  // Ubah return type agar tidak null
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

    revalidatePath("/admin");
    revalidatePath("/profile");
    // Kembalikan pesan sukses
    return {
      message: "Peran pengguna telah diubah menjadi organizer.",
      type: "success",
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan.";
    return { message, type: "error" };
  }
}

export async function rejectOrganizerApplication(
  p0: null,
  p1: FormData,
  applicationId: string,
): Promise<FormState> {
  // Ubah return type agar tidak null
  const supabase = createClient();
  try {
    await verifySuperAdmin(supabase);
    const { error } = await supabase
      .from("organizer_applications")
      .update({ status: "rejected" })
      .eq("id", applicationId);
    if (error) throw error;

    revalidatePath("/admin");
    // Kembalikan pesan sukses
    return { message: "Pengajuan telah ditolak.", type: "success" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan.";
    return { message, type: "error" };
  }
}

export async function signUpWithRedirect(formData: FormData) {
  const supabase = createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const major = formData.get("major") as string;
  const origin = (await headers()).get("origin");

  if (!email || !password || !fullName || !major) {
    return { error: "Semua kolom wajib diisi." };
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        major: major,
      },
      emailRedirectTo: `${origin}/login`,
    },
  });

  if (signUpError) {
    console.error("Sign up error:", signUpError);
    return { error: signUpError.message };
  }

  if (signUpData.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        major: major,
      })
      .eq("id", signUpData.user.id);

    if (profileError) {
      console.error("Error updating profile on signup:", profileError);
      return { error: "Gagal menyimpan data profil." };
    }
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

export async function updateProfile(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { message: "Anda harus login.", type: "error" };
    }

    // Validasi input
    const fullName = formData.get("full_name") as string;
    const major = formData.get("major") as string;
    const interests = formData.get("interests") as string;
    const avatarFile = formData.get("avatar_url") as File;
    let avatarUrl = formData.get("current_avatar_url") as string;

    // Validasi field required
    if (!fullName || fullName.trim().length === 0) {
      return {
        message: "Nama lengkap wajib diisi.",
        type: "error",
      };
    }

    if (!major || major.trim().length === 0) {
      return {
        message: "Jurusan wajib dipilih.",
        type: "error",
      };
    }

    // Handle avatar upload
    if (avatarFile && avatarFile.size > 0) {
      // Validasi ukuran file (5MB)
      if (avatarFile.size > 5 * 1024 * 1024) {
        return {
          message: "Ukuran avatar tidak boleh lebih dari 5MB.",
          type: "error",
        };
      }

      // Validasi tipe file
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];
      if (!allowedTypes.includes(avatarFile.type)) {
        return {
          message: "Format file tidak valid. Gunakan PNG, JPEG, atau WebP.",
          type: "error",
        };
      }

      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Hapus avatar lama jika ada
      if (avatarUrl) {
        const oldFilePath = avatarUrl
          .split("/")
          .slice(-2)
          .join("/")
          .split("?")[0];
        await supabase.storage.from("avatars").remove([oldFilePath]);
      }

      // Upload avatar baru
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return {
          message: `Gagal mengunggah avatar: ${uploadError.message}`,
          type: "error",
        };
      }

      // Dapatkan public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      avatarUrl = `${publicUrl}?t=${new Date().getTime()}`;
    }

    // Ambil profil user saat ini untuk membandingkan interests
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("interests")
      .eq("id", user.id)
      .single();

    // Update profile di database
    const updateData: {
      full_name: string;
      major: string;
      avatar_url: string | null;
      interests: string | null;
    } = {
      full_name: fullName.trim(),
      major: major.trim(),
      avatar_url: avatarUrl || null,
      interests: interests?.trim() || null,
    };

    const { error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return {
        message: `Gagal memperbarui profil: ${updateError.message}`,
        type: "error",
      };
    }

    if (interests !== currentProfile?.interests) {
      const interestArray = parseInterests(interests);
      const interestText = buildInterestText(interestArray);
      const vector = await generateEmbedding(interestText);
      if (vector) {
        await supabase.rpc("update_user_interest_vector", {
          p_user_id: user.id,
          p_interest_vec: vector,
        });
      }
    }

    // Revalidate paths
    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return {
      message: "Profil berhasil diperbarui!",
      type: "success",
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      message: "Terjadi kesalahan yang tidak terduga. Silakan coba lagi.",
      type: "error",
    };
  }
}

// Fungsi helper untuk menghapus avatar
export async function deleteAvatar(): Promise<FormState> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { message: "Anda harus login.", type: "error" };
    }

    // Dapatkan avatar URL saat ini
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (profile?.avatar_url) {
      // Hapus file dari storage
      const filePath = profile.avatar_url
        .split("/")
        .slice(-2)
        .join("/")
        .split("?")[0];
      await supabase.storage.from("avatars").remove([filePath]);

      // Update profile untuk menghapus avatar_url
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        return {
          message: "Gagal menghapus avatar.",
          type: "error",
        };
      }
    }

    revalidatePath("/profile");
    return {
      message: "Avatar berhasil dihapus.",
      type: "success",
    };
  } catch (error) {
    console.error("Delete avatar error:", error);
    return {
      message: "Terjadi kesalahan saat menghapus avatar.",
      type: "error",
    };
  }
}

export async function toggleSaveEvent(eventId: string, isSaved: boolean) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Anda harus login untuk menyimpan event." };
  }

  if (isSaved) {
    // Jika sudah disimpan, hapus dari saved_events
    const { error } = await supabase
      .from("saved_events")
      .delete()
      .match({ user_id: user.id, event_id: eventId });

    if (error) {
      return { error: "Gagal membatalkan penyimpanan event." };
    }
  } else {
    // Jika belum disimpan, tambahkan ke saved_events
    const { error } = await supabase
      .from("saved_events")
      .insert({ user_id: user.id, event_id: eventId });

    if (error) {
      return { error: "Gagal menyimpan event." };
    }
  }

  // Revalidate path agar UI diperbarui di halaman utama dan halaman detail
  revalidatePath("/");
  revalidatePath(`/event/${eventId}`);
  revalidatePath("/profile/saved-events"); // Nanti kita buat halaman ini

  return { success: true };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/login");
}

export async function getVectorRecommendations(
  search?: string,
  category?: string,
  weightSemantic: number = 0.5,
  weightRule: number = 0.5,
): Promise<Event[]> {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return [];

    // Ambil profil user
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        "interests, major, interest_vector, interests_updated_at, updated_at",
      )
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.interests?.trim()) return [];

    // Parse parent interests dari profil
    const parentInterests = parseInterests(profile.interests);

    // ── TAXONOMY EXPANSION ────────────────────────────────────────────
    // Expand parent interests → child tags untuk matching di RPC
    // Contoh: ['Teknologi & IT'] → ['programming', 'coding', 'AI', ...]
    const expandedChildTags = getChildTagsForInterests(parentInterests);
    // ─────────────────────────────────────────────────────────────────

    // Cache interest vector
    let interestVector: number[] | null = null;
    const vectorIsFresh =
      profile.interest_vector &&
      profile.interests_updated_at &&
      profile.updated_at &&
      new Date(profile.interests_updated_at) >= new Date(profile.updated_at);

    if (vectorIsFresh && profile.interest_vector) {
      interestVector = profile.interest_vector as unknown as number[];
    } else {
      const interestText = buildInterestText(parentInterests);
      interestVector = await generateEmbedding(interestText);

      if (interestVector) {
        // Fire-and-forget cache update (tidak block response)
        Promise.resolve(
          supabase.rpc("update_user_interest_vector", {
            p_user_id: user.id,
            p_interest_vec: interestVector,
          }),
        )
          .then()
          .catch((e) =>
            console.warn("[Cache] Gagal update interest_vector:", e),
          );
      }
    }

    if (!interestVector) return [];

    // Panggil RPC yang sudah diperbaiki — bobot sebagai parameter
    let query = supabase.rpc("get_hybrid_recommendations", {
      query_embedding: interestVector,
      p_user_id: user.id,
      p_user_major: profile.major ?? "",
      p_user_interests: expandedChildTags, // ← child tags, bukan parent
      p_weight_semantic: weightSemantic,
      p_weight_rule: weightRule,
      p_threshold: 0.3,
      match_count: 30,
    });

    // Filter search/category diterapkan di dalam query (bukan post-filter)
    // Catatan: filter ini bekerja di atas hasil RPC — acceptable untuk dataset kecil
    // Untuk skala besar, filter harus dimasukkan ke dalam RPC
    if (search) {
      const s = `%${search}%`;
      query = query.or(
        `title.ilike.${s},organizer.ilike.${s},description.ilike.${s}`,
      );
    }
    if (category) {
      query = query.in("category", category.split(","));
    }

    const { data, error } = await query;
    if (error) {
      console.error("[Rekomendasi] RPC error:", error.message);
      return [];
    }
    return (data ?? []) as Event[];
  } catch (error) {
    console.error("[Rekomendasi] Unexpected error:", error);
    return [];
  }
}

export async function runRecommendationTest(
  userId: string,
  weightSemantic = 0.5,
  weightRule = 0.5,
): Promise<RecommendationTestResult> {
  const supabase = createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, major, interests, role, avatar_url")
    .eq("id", userId)
    .single();

  if (profileError || !profile) throw new Error("Profil tidak ditemukan.");
  if (!profile.interests || !profile.major) {
    return { profile, recommendations: [] };
  }

  const parentInterests = parseInterests(profile.interests);

  // Taxonomy expansion untuk eksperimen — sama persis dengan produksi
  const expandedChildTags = getChildTagsForInterests(parentInterests);

  const interestText = buildInterestText(parentInterests);
  const interestVector = await generateEmbedding(interestText);
  if (!interestVector)
    throw new Error("Gagal generate embedding. Periksa HF_API_TOKEN.");

  const { data: recommendations, error: rpcError } = await supabase.rpc(
    "evaluate_recommendations",
    {
      query_embedding: interestVector,
      p_user_id: userId,
      p_user_major: profile.major,
      p_user_interests: expandedChildTags, // ← konsisten dengan produksi
      p_weight_semantic: weightSemantic,
      p_weight_rule: weightRule,
      p_threshold: 0.0,
      match_count: 50,
    },
  );

  if (rpcError) throw new Error(`RPC gagal: ${rpcError.message}`);

  return { profile, recommendations: recommendations ?? [] };
}
