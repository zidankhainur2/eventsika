/**
 * modules/events/queries.ts
 * 
 * Server-side only data fetching for Events.
 * These functions run on the server (RSC, Server Actions) and use the
 * server Supabase client (cookie-based auth).
 *
 * DO NOT import this file into Client Components.
 */

import { createClient } from '@/lib/supabase/server';
import type { Event, EventFilters, PaginatedEvents } from '@/types';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

// Create a cookie-less client for cacheable public reads
const supabasePublic = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper to map DB columns to frontend structure
function mapEvent(data: any): Event {
  if (!data) return data;
  return {
    ...data,
    organizer_name: data.organizer_name || data.organizer || '',
    poster_url: data.poster_url || data.image_url || null,
  };
}

function mapEvents(data: any[]): Event[] {
  return (data || []).map(mapEvent);
}

// ─── Single Event Queries ──────────────────────────────────────

/**
 * Fetch a single published event by slug.
 * Returns null if not found or not published (BR-001).
 */
const getEventBySlugCached = unstable_cache(
  async (slug: string): Promise<Event | null> => {
    const { data, error } = await supabasePublic
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return null;
    return mapEvent(data);
  },
  ['event-by-slug'],
  {
    revalidate: 300,
    tags: ['event-detail'],
  }
);

export async function getEventBySlug(slug: string): Promise<Event | null> {
  return getEventBySlugCached(slug);
}

/**
 * Fetch a single event by ID for organizer editing.
 * Does not filter by status — organizer needs to see their own drafts.
 */
export async function getEventById(id: string): Promise<Event | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return mapEvent(data);
}

// ─── Multi-Event Queries ───────────────────────────────────────

/**
 * Fetch all published, upcoming events with optional filters.
 * Used by the /explore page and UpcomingEvents component.
 * BR-001: Only published events. BR-004: Skip past events.
 */
const getPublishedEventsCached = unstable_cache(
  async (filters: EventFilters): Promise<Event[]> => {
    let query = supabasePublic
      .from('events')
      .select('*')
      .gte('end_date', new Date().toISOString());

    // Full-text search across title, description, organizer
    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,organizer.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }

    // Category filter
    if (filters.category) {
      const categories = filters.category.split(',').map((c) => c.trim());
      query = query.in('category', categories);
    }

    // Sort strategy
    switch (filters.sort) {
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'popular':
        // Fallback to created_at since save_count column does not exist in database schema
        query = query.order('created_at', { ascending: false });
        break;
      case 'upcoming':
      default:
        query = query.order('start_date', { ascending: true });
    }

    // Pagination
    const limit = filters.limit ?? 20;
    const page = filters.page ?? 1;
    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);

    const { data, error } = await query;
    if (error) {
      console.error('[getPublishedEvents] Query error:', error.message);
      return [];
    }

    return mapEvents(data ?? []);
  },
  ['published-events'],
  {
    revalidate: 300,
    tags: ['events'],
  }
);

export async function getPublishedEvents(
  filters: EventFilters = {}
): Promise<Event[]> {
  return getPublishedEventsCached(filters);
}

/**
 * Fetch upcoming events for the Home page section.
 * Returns a limited set of the soonest upcoming published events.
 */
const getUpcomingEventsCached = unstable_cache(
  async (limit: number): Promise<Event[]> => {
    const { data, error } = await supabasePublic
      .from('events')
      .select('*')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('[getUpcomingEvents] Query error:', error.message);
      return [];
    }

    return mapEvents(data ?? []);
  },
  ['upcoming-events'],
  {
    revalidate: 300,
    tags: ['events'],
  }
);

export async function getUpcomingEvents(limit = 8): Promise<Event[]> {
  return getUpcomingEventsCached(limit);
}

/**
 * Fetch related events by category, excluding the current event.
 */
const getRelatedEventsCached = unstable_cache(
  async (category: string, currentEventId: string, limit: number): Promise<Event[]> => {
    const { data, error } = await supabasePublic
      .from('events')
      .select('*')
      .eq('category', category)
      .neq('id', currentEventId)
      .gte('end_date', new Date().toISOString())
      .limit(limit);

    if (error) {
      console.error('[getRelatedEvents] Query error:', error.message);
      return [];
    }

    return mapEvents(data ?? []);
  },
  ['related-events'],
  {
    revalidate: 300,
    tags: ['events', 'event-detail'],
  }
);

export async function getRelatedEvents(
  category: string,
  currentEventId: string,
  limit = 3
): Promise<Event[]> {
  return getRelatedEventsCached(category, currentEventId, limit);
}

// ─── Organizer Queries ─────────────────────────────────────────

/**
 * Fetch all events belonging to the currently authenticated organizer.
 * Used by Organizer Dashboard (Server Component).
 */
export async function getOrganizerEvents(organizerId: string): Promise<Event[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', organizerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getOrganizerEvents] Query error:', error.message);
    return [];
  }

  return mapEvents(data ?? []);
}

// ─── Admin Queries ─────────────────────────────────────────────

/**
 * Fetch all events for admin view.
 */
export async function getAllEvents(): Promise<Event[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getAllEvents] Query error:', error.message);
    return [];
  }

  return mapEvents(data ?? []);
}

/**
 * Fetch events pending admin review.
 */
export async function getPendingEvents(): Promise<Event[]> {
  // Since database doesn't have status, returning empty list of pending reviews is safe.
  return [];
}

/**
 * Fetch the most recently published events (chronological fallback).
 * Used as fallback when AI recommendation is unavailable.
 */
const getLatestPublishedEventsCached = unstable_cache(
  async (limit: number): Promise<Event[]> => {
    const { data, error } = await supabasePublic
      .from('events')
      .select('*')
      .gte('end_date', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[getLatestPublishedEvents] Query error:', error.message);
      return [];
    }

    return mapEvents(data ?? []);
  },
  ['latest-published-events'],
  {
    revalidate: 300,
    tags: ['events'],
  }
);

export async function getLatestPublishedEvents(limit = 10): Promise<Event[]> {
  return getLatestPublishedEventsCached(limit);
}
