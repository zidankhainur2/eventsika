// lib/supabase.ts
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { type Event } from "./types";
import { type User } from "@supabase/supabase-js";

// Helper untuk mendapatkan profil pengguna saat ini
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
  const interests = profile?.interests?.split(",").map((i) => i.trim()) || [];

  if (interests.length === 0) return [];

  const interestFilter = interests
    .map((interest) => `category.ilike.%${interest}%`)
    .join(",");
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .or(interestFilter)
    .gte("event_date", new Date().toISOString()) // Hanya event mendatang
    .limit(10);

  if (error) {
    console.error("Error fetching recommended events:", error);
    return [];
  }
  return data;
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

// Fungsi lama `getEvents` bisa disimpan untuk halaman pencarian nanti, atau dihapus jika tidak perlu.
// ...

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
