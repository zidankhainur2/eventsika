'use server';

/**
 * modules/profile/actions.ts
 *
 * Server Actions for User Profile management.
 * FR-006: Edit profile, FR-007 + FR-008: Manage interests.
 * PROFILE-002, PROFILE-003.
 */

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { ActionResponse, UserProfile } from '@/types';

// ─── Validation Schemas ────────────────────────────────────────

const ProfileUpdateSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama terlalu panjang'),
  major: z.string().min(1, 'Program studi wajib dipilih'),
});

const InterestsSchema = z.object({
  interests: z
    .array(z.string())
    .min(1, 'Pilih minimal satu minat (PROFILE-003)'),
});

// ─── Auth Guard ────────────────────────────────────────────────

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized: not logged in.');
  return { supabase, user };
}

// ─── Get Profile ───────────────────────────────────────────────

/**
 * Fetch the current user's profile.
 */
export async function getProfile(): Promise<UserProfile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('[getProfile] Query error:', error.message);
    return null;
  }

  return {
    ...data,
    email: user.email,
  } as UserProfile;
}

// ─── Update Profile ────────────────────────────────────────────

/**
 * Update user profile information.
 * FR-006, PROFILE-002.
 */
export async function updateProfile(
  formData: FormData
): Promise<ActionResponse<UserProfile>> {
  try {
    const { supabase, user } = await requireUser();

    const rawInput = {
      full_name: formData.get('full_name') as string,
      major: formData.get('major') as string,
    };

    const parsed = ProfileUpdateSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        message: 'Validasi gagal.',
        error: parsed.error.issues.map((e) => e.message).join(', '),
      };
    }

    // Ambil profil user saat ini untuk mendapatkan avatar lama
    const { data: currentProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (fetchError) {
      console.error('[updateProfile] Fetch profile error:', fetchError.message);
      return { success: false, message: 'Gagal memuat data profil.' };
    }

    let avatarUrl = currentProfile.avatar_url;
    const avatarFile = formData.get('avatar_url') as File | null;

    // Handle avatar upload jika file baru diunggah
    if (avatarFile && avatarFile.size > 0) {
      // Validasi ukuran file (5MB)
      if (avatarFile.size > 5 * 1024 * 1024) {
        return {
          success: false,
          message: 'Ukuran avatar tidak boleh lebih dari 5MB.',
        };
      }

      // Validasi tipe file
      const allowedTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
      ];
      if (!allowedTypes.includes(avatarFile.type)) {
        return {
          success: false,
          message: 'Format file tidak valid. Gunakan PNG, JPEG, atau WebP.',
        };
      }

      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Hapus avatar lama jika ada
      if (avatarUrl) {
        try {
          const oldFilePath = avatarUrl
            .split('/')
            .slice(-2)
            .join('/')
            .split('?')[0];
          await supabase.storage.from('avatars').remove([oldFilePath]);
        } catch (e) {
          console.warn('[updateProfile] Gagal menghapus avatar lama:', e);
        }
      }

      // Upload avatar baru
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('[updateProfile] Upload error:', uploadError.message);
        return {
          success: false,
          message: `Gagal mengunggah avatar: ${uploadError.message}`,
        };
      }

      // Dapatkan public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      avatarUrl = `${publicUrl}?t=${new Date().getTime()}`;
    }

    const interests = formData.get('interests') as string;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: parsed.data.full_name,
        major: parsed.data.major,
        avatar_url: avatarUrl,
        interests: interests || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('[updateProfile] DB error:', error.message);
      return { success: false, message: 'Gagal memperbarui profil.' };
    }

    // Revalidate home page and profile page
    revalidatePath('/');
    revalidatePath('/profile');

    return {
      success: true,
      message: 'Profil berhasil diperbarui.',
      data: {
        ...data,
        email: user.email,
      } as UserProfile,
    };
  } catch (err) {
    console.error('[updateProfile] Unexpected error:', err);
    return { success: false, message: 'Terjadi kesalahan tak terduga.' };
  }
}

// ─── Update Interests ──────────────────────────────────────────

/**
 * Update user's interest preferences.
 * These interests drive the AI recommendation engine.
 * FR-007, FR-008, PROFILE-003.
 */
export async function updateInterests(
  interests: string[]
): Promise<ActionResponse<void>> {
  try {
    const { supabase, user } = await requireUser();

    const parsed = InterestsSchema.safeParse({ interests });
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0].message,
      };
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        interests: parsed.data.interests,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      console.error('[updateInterests] DB error:', error.message);
      return { success: false, message: 'Gagal memperbarui minat.' };
    }

    // Revalidate home page so recommendations reflect updated interests
    revalidatePath('/');
    revalidatePath('/profile');

    return {
      success: true,
      message:
        'Minat berhasil diperbarui. Rekomendasi Anda akan diperbarui pada sesi berikutnya.',
    };
  } catch (err) {
    console.error('[updateInterests] Unexpected error:', err);
    return { success: false, message: 'Terjadi kesalahan tak terduga.' };
  }
}

// ─── Update Avatar ─────────────────────────────────────────────

/**
 * Update user avatar URL after upload to Supabase Storage.
 */
export async function updateAvatar(
  avatarUrl: string
): Promise<ActionResponse<void>> {
  try {
    const { supabase, user } = await requireUser();

    if (!avatarUrl || !avatarUrl.startsWith('http')) {
      return { success: false, message: 'URL avatar tidak valid.' };
    }

    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      console.error('[updateAvatar] DB error:', error.message);
      return { success: false, message: 'Gagal memperbarui avatar.' };
    }

    revalidatePath('/profile');
    return { success: true, message: 'Foto profil berhasil diperbarui.' };
  } catch (err) {
    console.error('[updateAvatar] Unexpected error:', err);
    return { success: false, message: 'Terjadi kesalahan tak terduga.' };
  }
}
