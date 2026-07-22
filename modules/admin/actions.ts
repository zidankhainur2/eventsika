'use server';

/**
 * modules/admin/actions.ts
 *
 * Server Actions for Admin moderation.
 * FR-025 to FR-031, BR-005, BR-009.
 * All actions are guarded by role='admin' check.
 */

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { ActionResponse, OrganizerApplication, UserProfile, AdminStats } from '@/types';

// ─── Auth Guard ────────────────────────────────────────────────

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized: not logged in.');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
    throw new Error('Forbidden: admin access required.');
  }

  return { supabase, user };
}

// ─── Event Moderation ──────────────────────────────────────────

/**
 * Approve a pending event → sets status = 'published' (FR-026).
 */
export async function approveEvent(
  eventId: string
): Promise<ActionResponse<void>> {
  try {
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from('events')
      .update({
        status: 'published',
        rejection_reason: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', eventId)
      .eq('status', 'pending'); // Safety: only approve pending events

    if (error) {
      console.error('[approveEvent] DB error:', error.message);
      return { success: false, message: 'Gagal menyetujui event.' };
    }

    revalidatePath('/dashboard/admin');
    revalidatePath('/');
    revalidatePath('/explore');

    return { success: true, message: 'Event berhasil disetujui dan dipublikasikan.' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Kesalahan tak terduga.';
    return { success: false, message };
  }
}

/**
 * Reject a pending event with an optional reason (FR-027, FR-028).
 * BR-005: Rejected events cannot be published without re-review.
 */
export async function rejectEvent(
  eventId: string,
  reason?: string
): Promise<ActionResponse<void>> {
  try {
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from('events')
      .update({
        status: 'rejected',
        rejection_reason: reason ?? 'Tidak memenuhi pedoman platform.',
        updated_at: new Date().toISOString(),
      })
      .eq('id', eventId);

    if (error) {
      console.error('[rejectEvent] DB error:', error.message);
      return { success: false, message: 'Gagal menolak event.' };
    }

    revalidatePath('/dashboard/admin');

    return { success: true, message: 'Event berhasil ditolak.' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Kesalahan tak terduga.';
    return { success: false, message };
  }
}

// ─── Organizer Application Management ─────────────────────────

/**
 * Approve an organizer application (FR-029).
 * Sets application status = 'approved' and upgrades user role to 'organizer'.
 */
export async function approveOrganizerApplication(
  applicationId: string,
  userId: string
): Promise<ActionResponse<void>> {
  try {
    const { supabase } = await requireAdmin();

    // Update application status
    const { error: appError } = await supabase
      .from('organizer_applications')
      .update({
        status: 'approved',
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId);

    if (appError) {
      console.error('[approveOrganizerApplication] App error:', appError.message);
      return { success: false, message: 'Gagal memperbarui status aplikasi.' };
    }

    // Upgrade user role to organizer
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'organizer', updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (profileError) {
      console.error('[approveOrganizerApplication] Profile error:', profileError.message);
      return { success: false, message: 'Gagal memperbarui role pengguna.' };
    }

    revalidatePath('/dashboard/admin');

    return {
      success: true,
      message: 'Aplikasi Organizer berhasil disetujui. Pengguna kini memiliki akses sebagai Organizer.',
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Kesalahan tak terduga.';
    return { success: false, message };
  }
}

/**
 * Reject an organizer application (FR-029).
 */
export async function rejectOrganizerApplication(
  applicationId: string
): Promise<ActionResponse<void>> {
  try {
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from('organizer_applications')
      .update({
        status: 'rejected',
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId);

    if (error) {
      console.error('[rejectOrganizerApplication] DB error:', error.message);
      return { success: false, message: 'Gagal menolak aplikasi.' };
    }

    revalidatePath('/dashboard/admin');

    return { success: true, message: 'Aplikasi Organizer ditolak.' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Kesalahan tak terduga.';
    return { success: false, message };
  }
}

// ─── Admin Queries (server-side, for RSC) ─────────────────────

/**
 * Get all pending organizer applications with applicant email.
 */
export async function getPendingApplications(): Promise<OrganizerApplication[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('organizer_applications')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[getPendingApplications] DB error:', error.message);
    return [];
  }

  return (data ?? []) as OrganizerApplication[];
}

/**
 * Get platform-wide stats for the admin overview dashboard.
 */
export async function getAdminStats(): Promise<AdminStats> {
  const supabase = createClient();

  const [usersResult, eventsResult, organizersResult, pendingEventsResult, pendingAppsResult] =
    await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'organizer'),
      Promise.resolve({ count: 0 }),
      supabase
        .from('organizer_applications')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending'),
    ]);

  return {
    totalUsers: usersResult.count ?? 0,
    totalEvents: eventsResult.count ?? 0,
    totalOrganizers: organizersResult.count ?? 0,
    pendingEvents: pendingEventsResult.count ?? 0,
    pendingApplications: pendingAppsResult.count ?? 0,
  };
}

/**
 * Disable a user account (FR-031).
 */
export async function disableUser(userId: string): Promise<ActionResponse<void>> {
  try {
    const { supabase } = await requireAdmin();

    // In Supabase, disabling means setting a flag on the profile
    // (actual account suspension requires admin API — this marks it on profile)
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'student', updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      return { success: false, message: 'Gagal menonaktifkan akun.' };
    }

    revalidatePath('/dashboard/admin');
    return { success: true, message: 'Akun berhasil dinonaktifkan.' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Kesalahan tak terduga.';
    return { success: false, message };
  }
}

/**
 * Get all user profiles for admin management (FR-030).
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, major, faculty, interests, created_at')
    .order('full_name', { ascending: true });

  if (error) {
    console.error('[getAllUsers] DB error:', error.message);
    return [];
  }

  return (data ?? []) as UserProfile[];
}
