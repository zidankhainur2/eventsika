// lib/types.ts

// Definisi tipe untuk sebuah Event
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
};

// Kamu juga bisa menambahkan tipe lain di sini di masa depan
// export type UserProfile = { ... };
