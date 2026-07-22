'use server';

/**
 * modules/bookmark/actions.ts
 *
 * Server Actions for Bookmark (Saved Events) feature.
 * FR-017: Save event, FR-018: Remove bookmark, FR-019: View saved events.
 */

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { ActionResponse, Event } from '@/types';

// ─── Toggle Bookmark ───────────────────────────────────────────

/**
 * Toggles the saved state of an event for the current user.
 * If already saved → removes. If not saved → adds.
 * FR-017 + FR-018.
 */
export async function toggleBookmark(
  eventId: string
): Promise<ActionResponse<{ saved: boolean }>> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: 'Anda harus masuk untuk menyimpan event.',
      };
    }

    // Check if already saved
    const { data: existing } = await supabase
      .from('saved_events')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .maybeSingle();

    if (existing) {
      // Remove bookmark (FR-018)
      const { error } = await supabase
        .from('saved_events')
        .delete()
        .eq('id', existing.id);

      if (error) {
        console.error('[toggleBookmark] Remove error:', error.message);
        return { success: false, message: 'Gagal menghapus bookmark.' };
      }

      revalidatePath('/bookmarks');
      return {
        success: true,
        message: 'Event berhasil dihapus dari bookmark.',
        data: { saved: false },
      };
    } else {
      // Add bookmark (FR-017)
      const { error } = await supabase.from('saved_events').insert({
        user_id: user.id,
        event_id: eventId,
      });

      if (error) {
        console.error('[toggleBookmark] Insert error:', error.message);
        return { success: false, message: 'Gagal menyimpan event.' };
      }

      revalidatePath('/bookmarks');
      return {
        success: true,
        message: 'Event berhasil disimpan ke bookmark.',
        data: { saved: true },
      };
    }
  } catch (err) {
    console.error('[toggleBookmark] Unexpected error:', err);
    return { success: false, message: 'Terjadi kesalahan. Coba lagi.' };
  }
}

// ─── Check Bookmark Status ─────────────────────────────────────

/**
 * Check if a specific event is bookmarked by the current user.
 */
export async function isEventBookmarked(eventId: string): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from('saved_events')
    .select('id')
    .eq('user_id', user.id)
    .eq('event_id', eventId)
    .maybeSingle();

  return !!data;
}

// ─── Get Saved Events ──────────────────────────────────────────

type SavedEventRow = {
  event_id: string;
  created_at: string;
  events: Event | null;
};

/**
 * Fetch all bookmarked events for the current user.
 * FR-019.
 */
export async function getSavedEvents(): Promise<Event[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('saved_events')
    .select('event_id, created_at, events(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .returns<SavedEventRow[]>();

  if (error) {
    console.error('[getSavedEvents] Query error:', error.message);
    return [];
  }

  return (data ?? [])
    .map((row) => row.events)
    .filter((e): e is Event => Boolean(e));
}

/**
 * Get IDs of all events saved by current user (for bookmark indicator in cards).
 */
export async function getSavedEventIds(): Promise<string[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('saved_events')
    .select('event_id')
    .eq('user_id', user.id);

  if (error) {
    console.error('[getSavedEventIds] Query error:', error.message);
    return [];
  }

  return (data ?? []).map((row) => row.event_id);
}
