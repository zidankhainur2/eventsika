import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { type Event } from "./types";
import { type User } from "@supabase/supabase-js";

async function getCurrentUserProfile(
  supabase: ReturnType<typeof createClient>,
  user: User
) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("major, interests")
    .eq("id", user.id)
    .single();
  return profile;
}

// 1. Fungsi untuk mendapatkan event rekomendasi berdasarkan minat
export async function getRecommendedEvents(
  supabase: ReturnType<typeof createClient>,
  user: User | null
) {
  if (!user) return [];

  const profile = await getCurrentUserProfile(supabase, user);

  // interests dari DB bisa null, jadi amanin dulu
  const interests: string[] = profile?.interests
    ? profile.interests.split(",").map((i: string) => i.trim())
    : [];

  if (interests.length === 0) return [];

  // buat filter berdasarkan minat
  const interestFilter = interests
    .map((interest) => `category.ilike.%${interest}%`)
    .join(",");

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .or(interestFilter)
    .gte("event_date", new Date().toISOString()) // hanya event mendatang
    .limit(10);

  if (error) {
    console.error("Error fetching recommended events:", error);
    return [];
  }

  return data ?? [];
}

// 2. Fungsi untuk mendapatkan event terkait jurusan
export async function getMajorRelatedEvents(
  supabase: ReturnType<typeof createClient>,
  user: User | null
) {
  if (!user) return [];
  const profile = await getCurrentUserProfile(supabase, user);
  const major = profile?.major;

  if (!major) return [];

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .ilike("organizer", `%${major}%`) // Mencari nama organizer yang cocok dengan jurusan
    .gte("event_date", new Date().toISOString())
    .limit(10);

  if (error) {
    console.error("Error fetching major related events:", error);
    return [];
  }
  return data;
}

// 3. Fungsi untuk mendapatkan semua event mendatang
export async function getAllUpcomingEvents(
  supabase: ReturnType<typeof createClient>
) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("event_date", new Date().toISOString()) // Hanya event mendatang
    .order("event_date", { ascending: true }); // Urutkan dari yang paling dekat

  if (error) {
    console.error("Error fetching all upcoming events:", error);
    return [];
  }
  return data;
}

export async function getEvents(searchParams?: {
  search?: string;
  category?: string;
}) {
  const supabase = createClient();

  // Ambil user yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let interests: string[] = [];

  // Kalau ada user, ambil profil untuk cek minat
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("interests")
      .eq("id", user.id)
      .single();

    if (profile?.interests) {
      interests = profile.interests
        .split(",")
        .map((item: string) => item.trim());
    }
  }

  // Query dasar untuk ambil event mendatang
  let query = supabase
    .from("events")
    .select("*")
    .gte("event_date", new Date().toISOString()) // hanya event mendatang
    .order("event_date", { ascending: true });

  // Filter kategori jika ada
  if (searchParams?.category) {
    query = query.eq("category", searchParams.category);
  }

  // Filter pencarian (title, description, organizer)
  if (searchParams?.search) {
    query = query.or(
      `title.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%,organizer.ilike.%${searchParams.search}%`
    );
  }

  // Filter tambahan berdasarkan interests user
  if (interests.length > 0) {
    const interestFilter = interests
      .map((interest) => `category.ilike.%${interest}%`)
      .join(",");
    query = query.or(interestFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data ?? [];
}

// Fungsi untuk mendapatkan satu event berdasarkan ID (tetap sama)
export async function getEventById(id: string): Promise<Event> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) {
    notFound();
  }
  return data;
}
