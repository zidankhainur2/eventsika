// lib/types.ts

export type Event = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  organizer: string;
  category: string;
  registration_link: string;
  image_url: string | null;
};

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  major: string | null;
  interests: string | null;
  role: "user" | "organizer" | "super_admin";
};
