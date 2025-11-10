import { createClient } from "@/utils/supabase/client";
import { type Event } from "./types";
import { type User } from "@supabase/supabase-js";
import { type Profile } from "./types";
import { getVectorRecommendations } from "@/app/action";

const supabase = createClient();

export const getAllUpcomingEvents = async ({
  search,
  category,
}: {
  search?: string;
  category?: string;
}): Promise<Event[]> => {
  let query = supabase
    .from("events")
    .select("*")
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true });

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,organizer.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  if (category) {
    const categories = category.split(",");
    query = query.in("category", categories);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
};

export const getRecommendedEvents = async (): Promise<Event[]> => {
  return getVectorRecommendations();
};

export const getMajorRelatedEvents = async (): Promise<Event[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase.rpc(
    "get_major_related_events_for_user",
    { p_user_id: user.id }
  );
  if (error) throw new Error(error.message);
  return data || [];
};

export const getSavedEventIds = async (): Promise<Set<string>> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data, error } = await supabase
    .from("saved_events")
    .select("event_id")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching saved event IDs:", error);
    return new Set();
  }
  return new Set(data.map((item) => item.event_id));
};

export const getUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const getEventBySlug = async (slug: string): Promise<Event> => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    throw new Error(error.message || "Event tidak ditemukan.");
  }
  return data;
};

export async function getEventsByOrganizer(): Promise<Event[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching organizer events:", error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function getProfile(): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    throw new Error(error.message);
  }
  return data;
}

export const getRelatedEvents = async (
  category: string,
  currentEventId: string
): Promise<Event[]> => {
  if (!category || !currentEventId) return [];

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("category", category)
    .neq("id", currentEventId)
    .gte("event_date", new Date().toISOString())
    .limit(3);
  if (error) {
    console.error("Error fetching related events:", error);
    return [];
  }
  return data || [];
};

type SavedEventRow = {
  events: Event | null;
};

export async function getSavedEvents(): Promise<Event[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("saved_events")
    .select("events(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<SavedEventRow[]>();

  if (error) {
    console.error("Error fetching saved events:", error);
    throw new Error(error.message);
  }

  return (data ?? [])
    .map((item) => item.events)
    .filter((e): e is Event => Boolean(e));
}

type ApplicationWithEmail = {
  id: string;
  user_id: string;
  organization_name: string;
  contact_person: string;
  created_at: string;
  email: string;
};

export async function getPendingApplications(): Promise<
  ApplicationWithEmail[]
> {
  const { data, error } = await supabase.rpc(
    "get_pending_applications_with_email"
  );

  if (error) {
    console.error("Error fetching pending applications:", error);
    throw new Error(error.message);
  }
  return data || [];
}

export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, major, interests, role")
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Error fetching profiles:", error);
    throw new Error(error.message);
  }
  return data || [];
}
