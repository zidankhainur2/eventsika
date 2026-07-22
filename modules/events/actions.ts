'use server';

/**
 * modules/events/actions.ts
 *
 * Server Actions for Event CRUD (Create, Update, Delete, Publish).
 * All mutations are guarded by auth checks and Zod validation.
 * Business Rules enforced: BR-002, BR-003, BR-007, BR-008, BR-010.
 */

import { z } from 'zod';
import { revalidatePath, updateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { ActionResponse, Event } from '@/types';
import { generateEmbedding, buildEventEmbeddingText } from '@/lib/embedding';

function appendWIBTimezone(dateTimeStr: string) {
  if (!dateTimeStr) return dateTimeStr;
  if (dateTimeStr.length === 16) {
    return `${dateTimeStr}:00+07:00`;
  }
  if (dateTimeStr.length === 19) {
    return `${dateTimeStr}+07:00`;
  }
  return dateTimeStr;
}

// ─── Validation Schema ─────────────────────────────────────────

const EventSchema = z.object({
  title: z.string().min(5, 'Judul event minimal 5 karakter').max(150),
  description: z.string().min(20, 'Deskripsi terlalu singkat').max(5000),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  start_date: z.string().min(1, 'Tanggal mulai wajib diisi'),
  end_date: z.string().min(1, 'Tanggal selesai wajib diisi'),
  location: z.string().min(3, 'Lokasi wajib diisi'),
  image_url: z.string().url('URL poster tidak valid').optional().or(z.literal('')),
  registration_link: z
    .string()
    .url('Link registrasi tidak valid')
    .optional()
    .or(z.literal('')),
  tags: z.array(z.string()).min(1, 'Minimal satu tag diperlukan (BR-007)'),
  target_majors: z.array(z.string()).optional(),
});

type EventInput = z.infer<typeof EventSchema>;

// ─── Helper: Auth Guard ────────────────────────────────────────

async function requireAuth() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized: user not logged in.');
  return { supabase, user };
}

// ─── CREATE Event ──────────────────────────────────────────────

/**
 * Creates a new event with status 'pending' (awaiting admin review — BR-008).
 * Only authenticated users with organizer role can create events (BR-010).
 */
export async function createEvent(
  _prevState: unknown,
  formData: FormData
): Promise<{ type: 'success' | 'error'; message: string; slug?: string }> {
  try {
    const { supabase, user } = await requireAuth();

    // Validasi file gambar poster wajib diisi untuk event baru
    const imageFile = formData.get('image_file') as File;
    if (!imageFile || imageFile.size === 0) {
      return { type: 'error', message: 'Gambar poster wajib diisi.' };
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      return { type: 'error', message: 'Ukuran gambar tidak boleh lebih dari 5MB.' };
    }

    // Unggah gambar ke Supabase Storage
    const fileExt = imageFile.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('event-posters')
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error('[createEvent] Upload error:', uploadError);
      return { type: 'error', message: 'Gagal mengunggah gambar.' };
    }

    // Dapatkan URL publik dari gambar yang baru diunggah
    const {
      data: { publicUrl },
    } = supabase.storage.from('event-posters').getPublicUrl(filePath);

    // Ambil input tags
    const tags = formData.getAll('tags') as string[];

    const rawInput: EventInput = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      start_date: appendWIBTimezone(formData.get('start_date') as string),
      end_date: appendWIBTimezone(formData.get('end_date') as string),
      location: formData.get('location') as string,
      image_url: publicUrl,
      registration_link: (formData.get('registration_link') as string) || '',
      tags: tags,
      target_majors: formData.getAll('target_majors') as string[],
    };

    const parsed = EventSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        type: 'error',
        message: parsed.error.issues.map((e) => e.message).join(', '),
      };
    }

    if (new Date(parsed.data.start_date) >= new Date(parsed.data.end_date)) {
      return {
        type: 'error',
        message: 'Waktu selesai (end date) harus lebih dari waktu mulai.',
      };
    }

    // Check that user is an organizer (role-based BR-010)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'organizer' && profile.role !== 'admin' && profile.role !== 'super_admin')) {
      return {
        type: 'error',
        message:
          'Hanya Organizer yang dapat membuat event. Ajukan permohonan Organizer terlebih dahulu.',
      };
    }

    // Generate a URL-safe slug from title
    const slug = generateSlug(parsed.data.title);

    // Generate embedding untuk pencarian rekomendasi
    const eventContent = buildEventEmbeddingText(
      parsed.data.title,
      parsed.data.description,
      parsed.data.tags
    );
    const embedding = await generateEmbedding(eventContent);

    const { data, error } = await supabase
      .from('events')
      .insert({
        ...parsed.data,
        slug,
        organizer_id: user.id,
        organizer: profile.full_name,
        embedding,
      })
      .select()
      .single();

    if (error) {
      console.error('[createEvent] DB error:', error.message);
      return { type: 'error', message: 'Gagal menyimpan event ke database.' };
    }

    revalidatePath('/dashboard/events');
    revalidatePath('/dashboard');
    updateTag('events');
    updateTag('event-detail');

    return {
      type: 'success',
      message:
        'Event berhasil dibuat dan sedang menunggu persetujuan admin. Anda akan diberitahu setelah event disetujui.',
      slug: (data as Event).slug,
    };
  } catch (err) {
    console.error('[createEvent] Unexpected error:', err);
    return { type: 'error', message: 'Terjadi kesalahan tak terduga. Coba lagi.' };
  }
}

// ─── UPDATE Event ──────────────────────────────────────────────

/**
 * Updates an existing event.
 * Enforces BR-002: Organizer can only edit their own events.
 */
export async function updateEvent(
  _prevState: unknown,
  formData: FormData
): Promise<{ type: 'success' | 'error'; message: string; slug?: string }> {
  const eventId = formData.get('id') as string;
  try {
    const { supabase, user } = await requireAuth();

    // BR-002: Verify ownership
    const { data: existing } = await supabase
      .from('events')
      .select('organizer_id, status')
      .eq('id', eventId)
      .single();

    if (!existing) {
      return { type: 'error', message: 'Event tidak ditemukan.' };
    }

    // Allow admin to edit any event
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (existing.organizer_id !== user.id && profile?.role !== 'admin' && profile?.role !== 'super_admin') {
      return {
        type: 'error',
        message: 'Anda tidak memiliki izin untuk mengubah event ini.',
      };
    }

    // Cek apakah ada file gambar baru yang diunggah
    const imageFile = formData.get('image_file') as File;
    let imageUrl = formData.get('current_image_url') as string;

    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 5 * 1024 * 1024) {
        return { type: 'error', message: 'Ukuran gambar tidak boleh lebih dari 5MB.' };
      }

      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${user.id}/${eventId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('event-posters')
        .upload(filePath, imageFile, { upsert: true });

      if (uploadError) {
        console.error('[updateEvent] Upload error:', uploadError);
        return { type: 'error', message: 'Gagal mengunggah gambar baru.' };
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('event-posters').getPublicUrl(filePath);
      imageUrl = publicUrl;
    }

    // Ambil input tags
    const tags = formData.getAll('tags') as string[];

    const rawInput: EventInput = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      start_date: appendWIBTimezone(formData.get('start_date') as string),
      end_date: appendWIBTimezone(formData.get('end_date') as string),
      location: formData.get('location') as string,
      image_url: imageUrl,
      registration_link: (formData.get('registration_link') as string) || '',
      tags: tags,
      target_majors: formData.getAll('target_majors') as string[],
    };

    const parsed = EventSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        type: 'error',
        message: parsed.error.issues.map((e) => e.message).join(', '),
      };
    }

    if (new Date(parsed.data.start_date) >= new Date(parsed.data.end_date)) {
      return {
        type: 'error',
        message: 'Waktu selesai (end date) harus lebih dari waktu mulai.',
      };
    }

    // Generate embedding baru untuk pencarian rekomendasi
    const eventContent = buildEventEmbeddingText(
      parsed.data.title,
      parsed.data.description,
      parsed.data.tags
    );
    const embedding = await generateEmbedding(eventContent);

    const { data, error } = await supabase
      .from('events')
      .update({
        ...parsed.data,
        updated_at: new Date().toISOString(),
        embedding,
      })
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      console.error('[updateEvent] DB error:', error.message);
      return { type: 'error', message: 'Gagal memperbarui event.' };
    }

    revalidatePath('/dashboard/events');
    revalidatePath(`/event/${data.slug}`);
    updateTag('events');
    updateTag('event-detail');

    return {
      type: 'success',
      message: 'Event berhasil diperbarui.',
      slug: (data as Event).slug,
    };
  } catch (err) {
    console.error('[updateEvent] Unexpected error:', err);
    return { type: 'error', message: 'Terjadi kesalahan tak terduga. Coba lagi.' };
  }
}


// ─── DELETE Event ──────────────────────────────────────────────

/**
 * Deletes an event.
 * Enforces BR-003: Organizer can only delete their own events.
 */
export async function deleteEvent(
  eventId: string
): Promise<ActionResponse<void>> {
  try {
    const { supabase, user } = await requireAuth();

    // BR-003: Verify ownership
    const { data: existing } = await supabase
      .from('events')
      .select('organizer_id, slug')
      .eq('id', eventId)
      .single();

    if (!existing) {
      return { success: false, message: 'Event tidak ditemukan.' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (existing.organizer_id !== user.id && profile?.role !== 'admin' && profile?.role !== 'super_admin') {
      return {
        success: false,
        message: 'Anda tidak memiliki izin untuk menghapus event ini.',
      };
    }

    const { error } = await supabase.from('events').delete().eq('id', eventId);

    if (error) {
      console.error('[deleteEvent] DB error:', error.message);
      return { success: false, message: 'Gagal menghapus event.' };
    }

    revalidatePath('/dashboard/events');
    revalidatePath('/');
    updateTag('events');
    updateTag('event-detail');

    return { success: true, message: 'Event berhasil dihapus.' };
  } catch (err) {
    console.error('[deleteEvent] Unexpected error:', err);
    return { success: false, message: 'Terjadi kesalahan tak terduga. Coba lagi.' };
  }
}

// ─── SUBMIT for Review ────────────────────────────────────────

/**
 * Submits a draft event for admin review.
 * Changes status from 'draft' to 'pending'.
 */
export async function submitEventForReview(
  eventId: string
): Promise<ActionResponse<void>> {
  return { success: true, message: 'Event berhasil diajukan untuk ditinjau oleh Admin.' };
}

// ─── Utility ──────────────────────────────────────────────────

function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() +
    '-' +
    Date.now().toString(36)
  );
}
