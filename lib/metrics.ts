// Kalkulasi metrik evaluasi sistem rekomendasi
// Digunakan di halaman uji algoritma DAN bisa dijalankan offline

import {
  type GroundTruthItem,
  type EvaluationResult,
  type TestResultItem,
} from "./types";

/**
 * Precision@K: proporsi item relevan dalam K rekomendasi teratas
 */
export function precisionAtK(
  recommendations: TestResultItem[],
  groundTruth: Set<string>,
  k: number,
): number {
  const topK = recommendations.slice(0, k);
  if (topK.length === 0) return 0;

  const relevantCount = topK.filter((r) => groundTruth.has(r.id)).length;
  return relevantCount / k;
}

/**
 * Recall@K: proporsi item relevan yang berhasil ditemukan dalam top-K
 */
export function recallAtK(
  recommendations: TestResultItem[],
  groundTruth: Set<string>,
  k: number,
): number {
  if (groundTruth.size === 0) return 0;

  const topK = recommendations.slice(0, k);
  const relevantCount = topK.filter((r) => groundTruth.has(r.id)).length;
  return relevantCount / groundTruth.size;
}

/**
 * F1@K: harmonic mean dari Precision@K dan Recall@K
 */
export function f1AtK(
  recommendations: TestResultItem[],
  groundTruth: Set<string>,
  k: number,
): number {
  const p = precisionAtK(recommendations, groundTruth, k);
  const r = recallAtK(recommendations, groundTruth, k);

  if (p + r === 0) return 0;
  return (2 * p * r) / (p + r);
}

/**
 * Average Precision (AP) untuk satu user
 * Mempertimbangkan posisi item relevan dalam ranking
 */
export function averagePrecision(
  recommendations: TestResultItem[],
  groundTruth: Set<string>,
): number {
  if (groundTruth.size === 0) return 0;

  let sumPrecision = 0;
  let relevantFound = 0;

  for (let i = 0; i < recommendations.length; i++) {
    if (groundTruth.has(recommendations[i].id)) {
      relevantFound++;
      sumPrecision += relevantFound / (i + 1); // Precision at this position
    }
  }

  return groundTruth.size > 0 ? sumPrecision / groundTruth.size : 0;
}

/**
 * Mean Average Precision (MAP) — rata-rata AP lintas semua user
 */
export function meanAveragePrecision(perUserAP: number[]): number {
  if (perUserAP.length === 0) return 0;
  return perUserAP.reduce((sum, ap) => sum + ap, 0) / perUserAP.length;
}

/**
 * Hitung semua metrik untuk satu skenario pembobotan
 * @param allUsersRecs - Map userId → sorted recommendations
 * @param allGroundTruths - Map userId → Set of relevant eventIds
 * @param scenario - Label skenario (misal: "S2 (0.8:0.2)")
 * @param weightSemantic - Nilai alpha
 * @param weightRule - Nilai beta
 */
export function evaluateScenario(
  allUsersRecs: Map<string, TestResultItem[]>,
  allGroundTruths: Map<string, Set<string>>,
  scenario: string,
  weightSemantic: number,
  weightRule: number,
): EvaluationResult {
  const users = Array.from(allUsersRecs.keys());

  const p5List: number[] = [];
  const p10List: number[] = [];
  const r5List: number[] = [];
  const r10List: number[] = [];
  const f1_5List: number[] = [];
  const f1_10List: number[] = [];
  const apList: number[] = [];

  for (const userId of users) {
    const recs = allUsersRecs.get(userId) ?? [];
    const gt = allGroundTruths.get(userId) ?? new Set();

    p5List.push(precisionAtK(recs, gt, 5));
    p10List.push(precisionAtK(recs, gt, 10));
    r5List.push(recallAtK(recs, gt, 5));
    r10List.push(recallAtK(recs, gt, 10));
    f1_5List.push(f1AtK(recs, gt, 5));
    f1_10List.push(f1AtK(recs, gt, 10));
    apList.push(averagePrecision(recs, gt));
  }

  const avg = (arr: number[]) =>
    arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  return {
    scenario,
    weightSemantic,
    weightRule,
    precisionAt5: avg(p5List),
    precisionAt10: avg(p10List),
    recallAt5: avg(r5List),
    recallAt10: avg(r10List),
    f1At5: avg(f1_5List),
    f1At10: avg(f1_10List),
    map: meanAveragePrecision(apList),
  };
}
