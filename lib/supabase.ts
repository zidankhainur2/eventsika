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

export async function getRecommendedEvents(
  supabase: ReturnType<typeof createClient>,
  user: User | null
): Promise<Event[]> {
  if (!user) return [];

  const profile = await getCurrentUserProfile(supabase, user);
  const interests = profile?.interests
    ? profile.interests.split(",").map((i: string) => i.trim())
    : [];

  if (interests.length === 0) return [];

  const interestFilter = interests
    .map((interest: string) => `category.ilike.%${interest}%`)
    .join(",");

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .or(interestFilter)
    .gte("event_date", new Date().toISOString())
    .limit(10);

  if (error) {
    console.error("Error fetching recommended events:", error);
    return [];
  }
  return data ?? [];
}

export async function getMajorRelatedEvents(
  supabase: ReturnType<typeof createClient>,
  user: User | null
): Promise<Event[]> {
  if (!user) return [];

  const profile = await getCurrentUserProfile(supabase, user);
  const major = profile?.major;

  if (!major) return [];

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .ilike("organizer", `%${major}%`)
    .gte("event_date", new Date().toISOString())
    .limit(10);

  if (error) {
    console.error("Error fetching major related events:", error);
    return [];
  }
  return data ?? [];
}

export async function getAllUpcomingEvents(
  supabase: ReturnType<typeof createClient>,
  {
    search,
    category,
  }: {
    search?: string;
    category?: string;
  }
): Promise<Event[]> {
  let query = supabase
    .from("events")
    .select("*")
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true });

  // Filter berdasarkan pencarian (search)
  if (search) {
    const searchTerm = `%${search}%`;
    // Mencari di kolom title, organizer, atau description
    query = query.or(
      `title.ilike.${searchTerm},organizer.ilike.${searchTerm},description.ilike.${searchTerm}`
    );
  }

  // Filter berdasarkan kategori (category)
  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching all upcoming events:", error);
    return [];
  }
  return data ?? [];
}

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
