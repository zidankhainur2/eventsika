// ============================================================
// EventSika V2.0 — Domain Types
// All types must be strict (no `any`). Mirror the Supabase DB schema.
// ============================================================

// ─── Role & Status Enums ──────────────────────────────────────
export type Role = 'student' | 'organizer' | 'admin';

export type EventStatus = 'draft' | 'pending' | 'published' | 'rejected';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

// ─── Core Domain: User Profile ────────────────────────────────
export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: Role;
  // Academic information
  student_id?: string;    // NIM
  faculty?: string;
  major?: string;
  academic_year?: string; // Angkatan
  // Personalization
  interests: string[];
  interest_vector?: number[]; // pgvector stored as number[]
  created_at: string;
  updated_at?: string;
}

// Alias kept for backward compatibility with lib/queries.ts
export type Profile = UserProfile;

// ─── Core Domain: Event ───────────────────────────────────────
export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;

  // Organizer info (denormalized for performance)
  organizer_id: string;
  organizer_name: string;
  /** @deprecated use `organizer_name`. Legacy field from old schema. */
  organizer?: string;

  // Classification
  category: string;
  tags: string[];
  target_majors?: string[];

  // Scheduling — V2 uses start_date + end_date
  start_date: string;
  end_date: string;
  /**
   * @deprecated Use `start_date`. Kept as alias for V1 compatibility.
   * Some queries may still return `date` from legacy DB columns.
   */
  date?: string;

  // Location
  location: string;

  // Media
  /** New canonical field: poster/banner image URL */
  image_url: string;
  /**
   * @deprecated Use `image_url`. Old field name.
   */
  poster_url?: string;

  // Status & moderation
  status: EventStatus;
  rejection_reason?: string;

  // Registration
  registration_link?: string;

  // Analytics
  save_count?: number;
  view_count?: number;

  // AI embedding (stored via pgvector)
  embedding?: number[];

  // Timestamps
  created_at: string;
  updated_at?: string;
}

// ─── Core Domain: Organizer Application ───────────────────────
export interface OrganizerApplication {
  id: string;
  user_id: string;
  organization_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  description?: string;
  document_url?: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at?: string;
}

// ─── Core Domain: Bookmark (Saved Events) ─────────────────────
export interface SavedEvent {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
  /** Joined event data */
  event?: Event;
}

// ─── Shared Response Type ─────────────────────────────────────
export interface ActionResponse<T = void> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// ─── Recommendation Types ─────────────────────────────────────
export interface RecommendationResult {
  events: Event[];
  /** Human-readable explanation shown in the UI */
  explanation: string;
  /** Which strategy was used */
  strategy: 'ai_vector' | 'category_match' | 'latest_fallback' | 'cold_start';
}

// ─── Query / Filter Types ─────────────────────────────────────
export interface EventFilters {
  search?: string;
  category?: string;
  faculty?: string;
  sort?: 'newest' | 'oldest' | 'upcoming' | 'popular';
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
}

export interface PaginatedEvents {
  events: Event[];
  meta: PaginationMeta;
}

// ─── Dashboard Stats ──────────────────────────────────────────
export interface OrganizerStats {
  total: number;
  published: number;
  pending: number;
  rejected: number;
  draft: number;
}

export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalOrganizers: number;
  pendingEvents: number;
  pendingApplications: number;
}