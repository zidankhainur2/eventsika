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

  const interests: string[] =
    user?.user_metadata.interests
      ?.split(",")
      .map((item: string) => item.trim()) || [];

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
    // Di aplikasi nyata, bisa diganti dengan error boundary atau logging service
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
  // PENTING: Gunakan createClient dari server, bukan client
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
