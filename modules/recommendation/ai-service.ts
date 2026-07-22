/**
 * modules/recommendation/ai-service.ts
 *
 * AI Recommendation Engine — EventSika V2.0
 *
 * Strategy (Multi-Tier Fallback per NFR-009, NFR-010):
 *  1. AI Vector: Generate embedding from user interests → pgvector cosine similarity
 *  2. Category Match: Filter by top interest category if AI fails
 *  3. Latest Fallback: Show latest published events (chronological)
 *  4. Cold Start: User has no interests → show popular/latest events
 *
 * Business Rules enforced:
 *  - BR-001: Only published events
 *  - BR-004: No past events
 *  - BR-006: Profile must have interests for personalized recs
 *  - REC-005 (Cold Start): Gracefully handled
 *  - REC-006 (AI Failure): Graceful degradation guaranteed
 */

import { createClient } from '@/lib/supabase/server';
import { getLatestPublishedEvents } from '@/modules/events/queries';
import { generateEmbedding, buildInterestText } from '@/lib/embedding';
import type { Event, RecommendationResult } from '@/types';

// Helper to map DB columns to frontend structure
function mapEvents(events: any[]): Event[] {
  return (events || []).map(event => ({
    ...event,
    organizer_name: event.organizer_name || event.organizer || '',
    poster_url: event.poster_url || event.image_url || null,
  }));
}

// ─── Constants ────────────────────────────────────────────────

const AI_TIMEOUT_MS = 50000; // 50s timeout for Hugging Face inference API (handling cold start)
const MATCH_THRESHOLD = 0.6; // Cosine similarity threshold
const MATCH_COUNT = 10;

// ─── Main Entry Point ─────────────────────────────────────────

/**
 * Get personalized event recommendations for a user.
 * Guaranteed to return events — will never crash or return empty if events exist.
 */
export async function getPersonalizedRecommendations(
  userId: string,
  userInterests: string[] | string
): Promise<RecommendationResult> {
  const interests = typeof userInterests === 'string'
    ? userInterests.split(',').map((i) => i.trim()).filter(Boolean)
    : (userInterests || []);

  // ── Tier 4: Cold Start ─────────────────────────────────────
  // BR-006: User must have interests set for personal recommendations
  if (!interests || interests.length === 0) {
    return await getColdStartFallback();
  }

  let finalEvents: Event[] = [];
  let strategy: 'ai_vector' | 'category_match' | 'latest_fallback' | 'cold_start' = 'cold_start';
  let explanation = '';

  // ── Tier 1: AI Vector Search ───────────────────────────────
  try {
    const aiResult = await withTimeout(
      runAiVectorSearch(userId, interests),
      AI_TIMEOUT_MS
    );

    if (aiResult && aiResult.length > 0) {
      finalEvents = [...aiResult];
      strategy = 'ai_vector';
      explanation = `Direkomendasikan karena sesuai dengan minat Anda: ${interests.slice(0, 2).join(', ')}.`;
    }
  } catch (err) {
    console.warn('[AI-Recommendation] AI vector search failed, using fallback:', 
      err instanceof Error ? err.message : 'Unknown error');
  }

  // ── Tier 2: Category-Based Match (Blending) ────────────────
  // Jika hasil AI kurang dari MATCH_COUNT, tambahkan dengan pencocokan kategori
  if (finalEvents.length < MATCH_COUNT) {
    try {
      const categoryResult = await runCategoryMatch(interests);
      const existingIds = new Set(finalEvents.map((e) => e.id));
      const newCategoryEvents = categoryResult.filter((e) => !existingIds.has(e.id));

      if (newCategoryEvents.length > 0) {
        if (finalEvents.length === 0) {
          strategy = 'category_match';
          explanation = `Menampilkan event yang sesuai dengan kategori minat Anda.`;
        }
        finalEvents = [...finalEvents, ...newCategoryEvents].slice(0, MATCH_COUNT);
      }
    } catch (err) {
      console.warn('[AI-Recommendation] Category match failed:', 
        err instanceof Error ? err.message : 'Unknown error');
    }
  }

  // ── Tier 3: Latest Fallback (Blending) ─────────────────────
  // Jika hasil gabungan masih kurang dari 5 event, tambahkan dengan event terbaru
  if (finalEvents.length < 5) {
    try {
      const latestResult = await getLatestPublishedEvents(MATCH_COUNT);
      const existingIds = new Set(finalEvents.map((e) => e.id));
      const newLatestEvents = latestResult.filter((e) => !existingIds.has(e.id));

      if (newLatestEvents.length > 0) {
        if (finalEvents.length === 0) {
          strategy = 'latest_fallback';
          explanation = 'Rekomendasi personal belum tersedia. Menampilkan event terbaru untuk Anda.';
        }
        finalEvents = [...finalEvents, ...newLatestEvents].slice(0, MATCH_COUNT);
      }
    } catch (err) {
      console.warn('[AI-Recommendation] Latest fallback failed:', err);
    }
  }

  return {
    events: finalEvents,
    explanation,
    strategy,
  };
}

// ─── Tier 1: AI Vector Search ─────────────────────────────────

async function runAiVectorSearch(userId: string, interests: string[]): Promise<Event[]> {
  const supabase = createClient();
  
  // 1. Ambil data program studi (major), interest_vector, dan timestamps
  const { data: profile } = await supabase
    .from('profiles')
    .select('major, interest_vector, interests_updated_at, updated_at')
    .eq('id', userId)
    .single();

  const major = profile?.major || '';

  // 2. Expand parent interests to child tags
  const { getChildTagsForInterests } = await import('@/lib/taxonomy');
  const expandedChildTags = getChildTagsForInterests(interests);

  // 3. Ambil atau generate embedding dari parent interests
  let embedding: number[] | null = null;
  const vectorIsFresh =
    profile?.interest_vector &&
    profile?.interests_updated_at &&
    profile?.updated_at &&
    new Date(profile.interests_updated_at) >= new Date(profile.updated_at);

  if (vectorIsFresh && profile?.interest_vector) {
    embedding = profile.interest_vector as unknown as number[];
  } else {
    const interestText = buildInterestText(interests);
    embedding = await generateEmbedding(interestText);

    if (embedding && embedding.length > 0) {
      // Update cache in profiles table asynchronously
      Promise.resolve(
        supabase
          .from('profiles')
          .update({
            interest_vector: embedding,
            interests_updated_at: new Date().toISOString(),
          })
          .eq('id', userId)
      ).catch((e) =>
        console.warn('[AI-Recommendation] Gagal update interest_vector cache:', e)
      );
    }
  }

  if (!embedding || embedding.length === 0) {
    throw new Error('Gagal membuat embedding dari Hugging Face');
  }

  // 4. Panggil RPC get_hybrid_recommendations yang ada di DB
  const { data, error } = await supabase.rpc('get_hybrid_recommendations', {
    query_embedding: embedding,
    p_user_id: null,
    p_user_major: major,
    p_user_interests: expandedChildTags,
    p_weight_semantic: 0.8, // Bobot 80% semantik
    p_weight_rule: 0.2,     // Bobot 20% program studi
    p_threshold: 0.5,       // Threshold > 0.5 sesuai tesis
    match_count: MATCH_COUNT,
  });

  if (error) {
    throw new Error(`get_hybrid_recommendations RPC error: ${error.message}`);
  }

  return mapEvents(data ?? []);
}

// ─── Tier 2: Category-Based Match ─────────────────────────────

async function runCategoryMatch(interests: string[]): Promise<Event[]> {
  const supabase = createClient();

  // Use top 2 interests as category filters
  const topInterests = interests.slice(0, 3);

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('end_date', new Date().toISOString())
    .in('category', topInterests)
    .order('created_at', { ascending: false })
    .limit(MATCH_COUNT);

  if (error) {
    throw new Error(`Category match error: ${error.message}`);
  }

  return mapEvents(data ?? []);
}

// ─── Tier 3: Latest Fallback ───────────────────────────────────

async function getLatestFallback(): Promise<RecommendationResult> {
  const events = await getLatestPublishedEvents(MATCH_COUNT);
  return {
    events,
    explanation:
      'Rekomendasi personal belum tersedia. Menampilkan event terbaru untuk Anda.',
    strategy: 'latest_fallback',
  };
}

// ─── Tier 4: Cold Start ────────────────────────────────────────

async function getColdStartFallback(): Promise<RecommendationResult> {
  const supabase = createClient();

  // Show popular events (fallback to created_at since save_count column does not exist) for cold start
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('end_date', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(MATCH_COUNT);

  const events = error ? [] : mapEvents(data ?? []);

  return {
    events,
    explanation:
      'Lengkapi profil Anda dengan menambahkan minat untuk mendapatkan rekomendasi yang lebih personal.',
    strategy: 'cold_start',
  };
}

// ─── Utility ──────────────────────────────────────────────────

/**
 * Wraps a promise with a timeout.
 * If the operation exceeds `ms` milliseconds, it rejects.
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}