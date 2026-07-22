'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  generateEmbedding,
  buildInterestText,
} from '@/lib/embedding';
import { type Event, type RecommendationTestResult } from '@/lib/types';
import { getChildTagsForInterests } from '@/lib/taxonomy';

import {
  signOut as moduleSignOut,
  signUpWithRedirect as moduleSignUpWithRedirect,
  saveUserInterests as moduleSaveUserInterests,
} from '@/modules/auth/actions';

import {
  createEvent as moduleCreateEvent,
  updateEvent as moduleUpdateEvent,
  deleteEvent as moduleDeleteEvent,
  submitEventForReview as moduleSubmitEventForReview,
} from '@/modules/events/actions';

import {
  updateProfile as moduleUpdateProfile,
  updateInterests as moduleUpdateInterests,
} from '@/modules/profile/actions';

import {
  approveEvent as moduleApproveEvent,
  rejectEvent as moduleRejectEvent,
  approveOrganizerApplication as moduleApproveOrganizerApplication,
  rejectOrganizerApplication as moduleRejectOrganizerApplication,
} from '@/modules/admin/actions';


function parseInterests(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * app/action.ts — V2.0 Re-export Hub
 *
 * This file no longer contains business logic.
 * All logic has been extracted to domain-specific modules under /modules/.
 *
 * This file exists solely for backward compatibility with existing
 * components that import from '@/app/action'.
 *
 * Migration guide:
 *  - Auth actions     → @/modules/auth/actions
 *  - Event actions    → @/modules/events/actions
 *  - Bookmark actions → @/modules/bookmark/actions
 *  - Profile actions  → @/modules/profile/actions
 *  - Admin actions    → @/modules/admin/actions
 */

// ── Auth ─────────────────────────────────────────────────────
export async function signOut() {
  return moduleSignOut();
}

export async function signUpWithRedirect(first: any, second?: any) {
  let res;
  if (first instanceof FormData) {
    res = await moduleSignUpWithRedirect(null, first);
  } else {
    res = await moduleSignUpWithRedirect(first, second);
  }
  if (!res.success) {
    return { error: res.message || res.error };
  }
  return { success: true };
}

export async function saveUserInterests(input: string[] | FormData) {
  let interests: string[];
  if (input instanceof FormData) {
    const interestsStr = input.get("interests") as string;
    interests = interestsStr ? interestsStr.split(",").map(i => i.trim()).filter(Boolean) : [];
  } else {
    interests = input;
  }
  const res = await moduleSaveUserInterests(interests);
  if (!res.success) {
    return { error: res.message || res.error };
  }
  return { success: true };
}

// ── Events ────────────────────────────────────────────────────
export async function createEvent(prevState: any, formData: FormData) {
  return moduleCreateEvent(prevState, formData);
}

export async function updateEvent(prevState: any, formData: FormData) {
  return moduleUpdateEvent(prevState, formData);
}

export async function deleteEvent(eventId: string) {
  const res = await moduleDeleteEvent(eventId);
  if (!res.success) {
    return { type: 'error', message: res.message || res.error || 'Gagal menghapus event.' };
  }
  return { type: 'success', message: res.message };
}

export async function submitEventForReview(eventId: string) {
  return moduleSubmitEventForReview(eventId);
}

// Alias: addEvent → createEvent (backward compat for old EventForm usage)
export async function addEvent(prevState: any, formData: FormData) {
  return moduleCreateEvent(prevState, formData);
}


// ── Bookmark ──────────────────────────────────────────────────
import { toggleBookmark } from '@/modules/bookmark/actions';
export async function toggleSaveEvent(
  eventId: string,
  _isSaved?: boolean
): Promise<{ success?: boolean; error?: string }> {
  const res = await toggleBookmark(eventId);
  if (!res.success) {
    return { error: res.message || res.error };
  }
  return { success: true };
}

// ── Profile ───────────────────────────────────────────────────
export async function updateProfile(first: any, second?: any): Promise<{ type: 'success' | 'error', message: string }> {
  let formData: FormData;
  if (second instanceof FormData) {
    formData = second;
  } else {
    formData = first;
  }
  const res = await moduleUpdateProfile(formData);
  if (!res.success) {
    return { type: 'error', message: res.message || res.error || 'Gagal memperbarui profil.' };
  }
  return { type: 'success', message: res.message };
}

export async function updateInterests(interests: string[]) {
  return moduleUpdateInterests(interests);
}

// ── Admin ─────────────────────────────────────────────────────
export async function approveEvent(eventId: string) {
  return moduleApproveEvent(eventId);
}

export async function rejectEvent(eventId: string, reason: string) {
  return moduleRejectEvent(eventId, reason);
}

export async function approveOrganizerApplication(applicationId: string, userId: string) {
  return moduleApproveOrganizerApplication(applicationId, userId);
}

export async function rejectOrganizerApplication(applicationId: string) {
  return moduleRejectOrganizerApplication(applicationId);
}


// ── Legacy stubs (functions that no longer exist — return graceful fallback) ──

export async function getVectorRecommendations(
  search?: string,
  category?: string,
  weightSemantic: number = 0.5,
  weightRule: number = 0.5,
): Promise<Event[]> {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return [];

    // Ambil profil user
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        "interests, major, interest_vector, interests_updated_at, updated_at",
      )
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.interests?.trim()) return [];

    // Parse parent interests dari profil
    const parentInterests = parseInterests(profile.interests);

    // ── TAXONOMY EXPANSION ────────────────────────────────────────────
    // Expand parent interests → child tags untuk matching di RPC
    const expandedChildTags = getChildTagsForInterests(parentInterests);
    // ─────────────────────────────────────────────────────────────────

    // Cache interest vector
    let interestVector: number[] | null = null;
    const vectorIsFresh =
      profile.interest_vector &&
      profile.interests_updated_at &&
      profile.updated_at &&
      new Date(profile.interests_updated_at) >= new Date(profile.updated_at);

    if (vectorIsFresh && profile.interest_vector) {
      interestVector = profile.interest_vector as unknown as number[];
    } else {
      const interestText = buildInterestText(parentInterests);
      interestVector = await generateEmbedding(interestText);

      if (interestVector) {
        // Fire-and-forget cache update (tidak block response)
        Promise.resolve(
          supabase.rpc("update_user_interest_vector", {
            p_user_id: user.id,
            p_interest_vec: interestVector,
          }),
        )
          .then()
          .catch((e) =>
            console.warn("[Cache] Gagal update interest_vector:", e),
          );
      }
    }

    if (!interestVector) return [];

    // Panggil RPC yang sudah diperbaiki — bobot sebagai parameter
    let query = supabase.rpc("get_hybrid_recommendations", {
      query_embedding: interestVector,
      p_user_id: null,
      p_user_major: profile.major ?? "",
      p_user_interests: expandedChildTags, // ← child tags, bukan parent
      p_weight_semantic: weightSemantic,
      p_weight_rule: weightRule,
      p_threshold: 0.5,
      match_count: 30,
    });

    if (search) {
      const s = `%${search}%`;
      query = query.or(
        `title.ilike.${s},organizer.ilike.${s},description.ilike.${s}`,
      );
    }
    if (category) {
      query = query.in("category", category.split(","));
    }

    const { data, error } = await query;
    if (error) {
      console.error("[Rekomendasi] RPC error:", error.message);
      return [];
    }
    return (data ?? []) as Event[];
  } catch (error) {
    console.error("[Rekomendasi] Unexpected error:", error);
    return [];
  }
}

/**
 * @deprecated submitOrganizerApplication — use the form directly with the module action.
 */
export async function submitOrganizerApplication(
  _prevState: any,
  formData: FormData
): Promise<{ type: 'success' | 'error' | null; message: string }> {
  const supabase = (await import('@/lib/supabase/server')).createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { type: 'error', message: 'Tidak terautentikasi.' };

  const organizationName = formData.get('organization_name') as string;
  const contactPerson = formData.get('contact_person') as string;
  const phone = formData.get('phone') as string;
  const description = formData.get('description') as string;

  const { error } = await supabase.from('organizer_applications').insert({
    user_id: user.id,
    organization_name: organizationName,
    contact_person: contactPerson,
    phone,
    description,
    status: 'pending',
  });

  if (error) return { type: 'error', message: 'Gagal mengajukan aplikasi.' };
  return { type: 'success', message: 'Aplikasi berhasil dikirim. Admin akan meninjau permohonan Anda.' };
}

export async function deleteAvatar(): Promise<{ type: 'success' | 'error'; message: string }> {
  const supabase = (await import('@/lib/supabase/server')).createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { type: 'error', message: 'Tidak terautentikasi.' };

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: null })
    .eq('id', user.id);

  if (error) return { type: 'error', message: 'Gagal menghapus avatar.' };
  return { type: 'success', message: 'Avatar berhasil dihapus.' };
}

export async function runRecommendationTest(
  userId: string,
  weightSemantic = 0.0,
  weightRule = 0.0,
): Promise<RecommendationTestResult> {
  const supabase = createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, major, interests, role, avatar_url")
    .eq("id", userId)
    .single();

  if (profileError || !profile) throw new Error("Profil tidak ditemukan.");
  if (!profile.interests || !profile.major) {
    return { profile, recommendations: [] };
  }

  const parentInterests = parseInterests(profile.interests);

  // Taxonomy expansion untuk eksperimen — sama persis dengan produksi
  const expandedChildTags = getChildTagsForInterests(parentInterests);

  const interestText = buildInterestText(parentInterests);
  const interestVector = await generateEmbedding(interestText);
  if (!interestVector)
    throw new Error("Gagal generate embedding. Periksa HF_API_TOKEN.");

  const { data: recommendations, error: rpcError } = await supabase.rpc(
    "evaluate_recommendations",
    {
      query_embedding: interestVector,
      p_user_id: userId,
      p_user_major: profile.major,
      p_user_interests: expandedChildTags, // ← konsisten dengan produksi
      p_weight_semantic: weightSemantic,
      p_weight_rule: weightRule,
      p_threshold: 0.0,
      match_count: 50,
    },
  );

  if (rpcError) throw new Error(`RPC gagal: ${rpcError.message}`);

  return { profile, recommendations: recommendations ?? [] };
}

export async function bulkExportRecommendations(): Promise<string> {
  const supabase = createClient();

  // ── Konstanta ──────────────────────────────────────────────────────────────
  const DELAY_BETWEEN_HF_MS = 1000; // jeda antar HF call — hindari rate limit
  const MAX_RETRY = 3; // maksimal retry jika HF gagal
  const RETRY_DELAY_BASE_MS = 3000; // jeda sebelum retry (×attempt = backoff)

  const SCENARIOS = [
    { id: "S1", alpha: 1.0, beta: 0.0 },
    { id: "S2", alpha: 0.8, beta: 0.2 },
    { id: "S3", alpha: 0.5, beta: 0.5 },
    { id: "S4", alpha: 0.2, beta: 0.8 },
    { id: "S5", alpha: 0.0, beta: 1.0 },
  ];

  // ── Helper ─────────────────────────────────────────────────────────────────
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async function generateEmbeddingWithRetry(
    text: string,
    label: string,
  ): Promise<number[] | null> {
    for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
      const result = await generateEmbedding(text);
      if (result) return result;

      if (attempt < MAX_RETRY) {
        const waitMs = RETRY_DELAY_BASE_MS * attempt;
        console.warn(
          `[BulkExport] Embedding retry ${attempt}/${MAX_RETRY - 1} untuk "${label}" — tunggu ${waitMs}ms`,
        );
        await sleep(waitMs);
      }
    }
    console.error(
      `[BulkExport] ❌ Embedding GAGAL setelah ${MAX_RETRY}x retry: "${label}"`,
    );
    return null;
  }

  // ── Ambil semua profil user ────────────────────────────────────────────────
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, major, interests")
    .not("interests", "is", null)
    .not("major", "is", null)
    .eq("role", "user");

  if (profilesError) {
    throw new Error(`Gagal fetch profil: ${profilesError.message}`);
  }
  if (!profiles?.length) {
    throw new Error("Tidak ada profil ditemukan.");
  }

  console.log(
    `[BulkExport] Mulai — ${profiles.length} profil × ${SCENARIOS.length} skenario`,
  );

  // Map: user_id → { vector, expandedTags }
  type EmbedCache = { vector: number[]; expandedTags: string[] };
  const embedCache = new Map<string, EmbedCache>();
  const failedEmbeds: string[] = [];

  for (let i = 0; i < profiles.length; i++) {
    const profile = profiles[i];
    const label = profile.full_name ?? profile.id;
    const progress = `[${i + 1}/${profiles.length}]`;

    const parentInterests = parseInterests(profile.interests);
    if (!parentInterests.length) {
      console.warn(
        `[BulkExport] ${progress} Skip "${label}" — interests kosong`,
      );
      failedEmbeds.push(profile.id);
      continue;
    }

    const expandedTags = getChildTagsForInterests(parentInterests);
    const interestText = buildInterestText(parentInterests);

    const vector = await generateEmbeddingWithRetry(interestText, label);

    if (!vector) {
      failedEmbeds.push(profile.id);
      console.warn(
        `[BulkExport] ${progress} ⚠️  "${label}" akan di-skip di semua skenario`,
      );
    } else {
      embedCache.set(profile.id, { vector, expandedTags });
      console.log(`[BulkExport] ${progress} ✅ Embedding OK: "${label}"`);
    }

    if (i < profiles.length - 1) {
      await sleep(DELAY_BETWEEN_HF_MS);
    }
  }

  console.log(
    `\n[BulkExport] Fase 1 selesai: ✅ ${embedCache.size} berhasil | ❌ ${failedEmbeds.length} gagal`,
  );

  const rows: string[] = [];
  rows.push(
    "user_id,full_name,major,scenario,rank,event_id,title,vector_score,rule_score,total_score",
  );

  const profilesToProcess = profiles.filter((p) => embedCache.has(p.id));
  let rpcErrors = 0;

  for (let i = 0; i < profilesToProcess.length; i++) {
    const profile = profilesToProcess[i];
    const cached = embedCache.get(profile.id)!;
    const label = profile.full_name ?? profile.id;

    for (const scenario of SCENARIOS) {
      const { data: recs, error: rpcError } = await supabase.rpc(
        "evaluate_recommendations",
        {
          query_embedding: cached.vector,
          p_user_id: profile.id,
          p_user_major: profile.major,
          p_user_interests: cached.expandedTags,
          p_weight_semantic: scenario.alpha,
          p_weight_rule: scenario.beta,
          p_threshold: 0.0,
          match_count: 50,
        },
      );

      if (rpcError) {
        rpcErrors++;
        console.error(
          `[BulkExport] ❌ RPC error — "${label}" skenario ${scenario.id}: ${rpcError.message}`,
        );
        continue;
      }

      if (!recs || recs.length === 0) {
        console.warn(
          `[BulkExport] ⚠️  0 hasil — "${label}" skenario ${scenario.id}`,
        );
        continue;
      }

      (recs as any[]).forEach((r, idx) => {
        rows.push(
          [
            profile.id,
            `"${(profile.full_name ?? "").replace(/"/g, '""')}"`,
            `"${(profile.major ?? "").replace(/"/g, '""')}"`,
            scenario.id,
            idx + 1,
            r.id,
            `"${(r.title ?? "").replace(/"/g, '""')}"`,
            r.vector_score?.toFixed(4) ?? "0",
            r.rule_score?.toFixed(4) ?? "0",
            r.total_score?.toFixed(4) ?? "0",
          ].join(","),
        );
      });
    }

    if ((i + 1) % 5 === 0 || i === profilesToProcess.length - 1) {
      console.log(
        `[BulkExport] Progress Fase 2: ${i + 1}/${profilesToProcess.length} profil selesai`,
      );
    }
  }

  return rows.join("\n");
}