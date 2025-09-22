// lib/supabase.ts
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { type Event } from "./types";

// Fungsi untuk mendapatkan semua event dengan opsi filter dan personalisasi
export async function getEvents(searchParams?: {
  search?: string;
  category?: string;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let interests: string[] = [];
  // PERBAIKAN: Ambil data 'interests' dari tabel 'profiles' jika pengguna sudah login
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

  let query = supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  let isPersonalized = false;
  if (
    interests.length > 0 &&
    !searchParams?.search &&
    !searchParams?.category
  ) {
    const interestFilter = interests
      .map((interest) => `category.ilike.%${interest}%`)
      .join(",");
    query = query.or(interestFilter);
    isPersonalized = true;
  }

  if (searchParams?.search) {
    query = query.ilike("title", `%${searchParams.search}%`);
  }

  if (searchParams?.category) {
    query = query.eq("category", searchParams.category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching events:", error);
    throw new Error("Gagal memuat event.");
  }

  const events: Event[] = data || [];
  const pageTitle = isPersonalized
    ? "Event Pilihan Untukmu"
    : "Event Kampus Terbaru";

  return { events, pageTitle, isPersonalized };
}

// Fungsi untuk mendapatkan satu event berdasarkan ID
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
