'use server';

/**
 * modules/auth/actions.ts
 *
 * Server Actions for Authentication.
 * AUTH-001 (Register), AUTH-002 (Login), AUTH-003 (Logout), AUTH-004 (Reset Password).
 */

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { ActionResponse } from '@/types';

// ─── Schemas ───────────────────────────────────────────────────

const RegisterSchema = z.object({
  full_name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

// ─── Sign Up ───────────────────────────────────────────────────

export async function signUpWithRedirect(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const parsed = RegisterSchema.safeParse({
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0].message,
    };
  }

  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name },
    },
  });

  if (error) {
    console.error('[signUpWithRedirect] Auth error:', error.message);
    return { success: false, message: 'Gagal mendaftar. Email mungkin sudah digunakan.' };
  }

  return {
    success: true,
    message:
      'Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi, lalu masuk.',
  };
}

// ─── Sign Out ──────────────────────────────────────────────────

export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

// ─── Save User Interests (Onboarding) ─────────────────────────

export async function saveUserInterests(
  interests: string[]
): Promise<ActionResponse> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, message: 'Tidak terautentikasi.' };

  if (!interests || interests.length === 0) {
    return { success: false, message: 'Pilih minimal satu minat.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ interests, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  if (error) {
    console.error('[saveUserInterests] DB error:', error.message);
    return { success: false, message: 'Gagal menyimpan minat.' };
  }

  revalidatePath('/');
  return { success: true, message: 'Minat berhasil disimpan.' };
}
