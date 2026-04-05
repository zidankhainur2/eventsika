export type Event = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  organizer: string;
  category: string;
  registration_link: string;
  image_url: string | null;
  organizer_id: string | null;
  target_majors: string[] | null;
  slug: string;
  tags: string[] | null;
  embedding: number[] | null; // Jangan expose ke client — hanya untuk type safety
  // Skor dari RPC (opsional — hanya ada jika di-select dari RPC)
  vector_score?: number;
  major_score?: number;
  tag_score?: number;
  rule_score?: number;
  total_score?: number;
};

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  major: string | null;
  interests: string | null;
  role: "user" | "organizer" | "super_admin";
  email?: string;
};

export type TestResultItem = {
  id: string;
  title: string;
  category: string;
  tags: string[] | null;
  target_majors: string[] | null;
  start_date: string;
  end_date: string;
  vector_score: number;
  major_score: number;
  tag_score: number;
  rule_score: number; // = major_score * 0.5 + tag_score * 0.5
  total_score: number; // = vector * alpha + rule * beta
};

export type RecommendationTestResult = {
  profile: Profile | null;
  recommendations: TestResultItem[];
};

export type GroundTruthItem = {
  userId: string;
  eventId: string;
  isRelevant: boolean; // true jika responden menilai 4 atau 5
};

export type EvaluationResult = {
  scenario: string;
  weightSemantic: number;
  weightRule: number;
  precisionAt5: number;
  precisionAt10: number;
  recallAt5: number;
  recallAt10: number;
  f1At5: number;
  f1At10: number;
  map: number; // Mean Average Precision
};
