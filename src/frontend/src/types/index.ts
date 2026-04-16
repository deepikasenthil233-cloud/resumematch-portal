export type {
  CandidateProfile,
  Job,
  JobRequirements,
  MatchResult,
  RequirementScore,
  Resume,
  JobId,
  MatchId,
  ResumeId,
  UserId,
  Timestamp,
} from "../backend.d";

export {
  EducationLevel,
  ExperienceLevel,
  JobStatus,
  UserRole,
} from "../backend.d";

export type ScoreLevel = "high" | "medium" | "low";

export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  return "low";
}

export function scoreColor(score: number): string {
  if (score >= 75) return "text-accent";
  if (score >= 50) return "text-[oklch(0.75_0.15_70)]";
  return "text-destructive";
}

export function scoreBgColor(score: number): string {
  if (score >= 75) return "bg-accent/10 border-accent/20";
  if (score >= 50)
    return "bg-[oklch(0.75_0.15_70)]/10 border-[oklch(0.75_0.15_70)]/20";
  return "bg-destructive/10 border-destructive/20";
}

export function scoreBarColor(score: number): string {
  if (score >= 75) return "bg-accent";
  if (score >= 50) return "bg-[oklch(0.75_0.15_70)]";
  return "bg-destructive";
}
