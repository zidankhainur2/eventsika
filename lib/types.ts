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
  image_url: string | null; // Tambahkan ini
};
