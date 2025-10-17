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

  const { data, error } = await supabase.rpc(
    "get_recommended_events_for_user",
    { p_user_id: user.id }
  );

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

  const { data, error } = await supabase.rpc(
    "get_major_related_events_for_user",
    { p_user_id: user.id }
  );

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
    limit,
  }: {
    search?: string;
    category?: string;
    limit?: number;
  }
): Promise<Event[]> {
  let query = supabase
    .from("events")
    .select("*")
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true });

  if (search) {
    const searchTerm = `%${search}%`;
    query = query.or(
      `title.ilike.${searchTerm},organizer.ilike.${searchTerm},description.ilike.${searchTerm}`
    );
  }

  if (category) {
    const categories = category.split(",");
    query = query.in("category", categories);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching all upcoming events:", error);
    return [];
  }
  return data ?? [];
}

export async function getEventBySlug(slug: string): Promise<Event> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug) // <-- Ubah dari 'id' menjadi 'slug'
    .single();

  if (error || !data) {
    notFound();
  }
  return data;
}

type SavedEventRow = {
  events: Event | null;
};

export async function getSavedEvents(
  supabase: ReturnType<typeof createClient>,
  user: User | null
): Promise<Event[]> {
  if (!user) return [];

  const { data, error } = await supabase
    .from("saved_events")
    .select("events(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<SavedEventRow[]>();

  if (error) {
    console.error("Error fetching saved events:", error);
    return [];
  }

  return (data ?? [])
    .map((item) => item.events)
    .filter((e): e is Event => Boolean(e));
}

export async function getSavedEventIds(
  supabase: ReturnType<typeof createClient>,
  user: User | null
): Promise<Set<string>> {
  if (!user) return new Set();

  const { data, error } = await supabase
    .from("saved_events")
    .select("event_id")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching saved event IDs:", error);
    return new Set();
  }

  // Menggunakan Set untuk pengecekan yang lebih cepat (O(1))
  return new Set(data.map((item) => item.event_id));
}

export async function getEventsByOrganizer(
  supabase: ReturnType<typeof createClient>,
  organizerId: string
): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", organizerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching organizer events:", error);
    return [];
  }

  return data ?? [];
}
