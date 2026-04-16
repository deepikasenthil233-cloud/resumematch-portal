import { Link } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Inbox,
  RefreshCw,
  Target,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import ScoreBadge from "../components/ui/ScoreBadge";
import Spinner from "../components/ui/Spinner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import {
  useGetCandidateProfile,
  useGetMyMatches,
  useGetMyResume,
  useListAllJobs,
} from "../hooks/useBackend";
import {
  type Job,
  type MatchResult,
  type RequirementScore,
  scoreBarColor,
  scoreBgColor,
  scoreColor,
} from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function matchLabel(score: number): string {
  if (score >= 80) return "Strong Match";
  if (score >= 60) return "Good Match";
  return "Partial Match";
}

function accentBarColor(score: number): string {
  if (score >= 80) return "bg-[oklch(0.65_0.15_146)]"; // emerald
  if (score >= 60) return "bg-[oklch(0.72_0.18_70)]"; // yellow-amber
  return "bg-destructive";
}

function accentTextColor(score: number): string {
  if (score >= 80) return "text-[oklch(0.55_0.14_146)]";
  if (score >= 60) return "text-[oklch(0.58_0.17_70)]";
  return "text-destructive";
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  accent = false,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent?: boolean;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">
            {label}
          </p>
          <p
            className={`font-display text-2xl font-bold leading-none ${
              accent ? "text-[oklch(0.55_0.14_146)]" : "text-foreground"
            }`}
          >
            {value}
          </p>
          {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div
          className={`rounded-lg p-2 ${
            accent ? "bg-[oklch(0.65_0.15_146)]/10" : "bg-muted"
          }`}
        >
          <Icon
            className={`h-4 w-4 ${accent ? "text-[oklch(0.55_0.14_146)]" : "text-muted-foreground"}`}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Breakdown Table ──────────────────────────────────────────────────────────

function BreakdownTable({
  breakdown,
  job,
}: {
  breakdown: RequirementScore[];
  job: Job | null | undefined;
}) {
  const sorted = [...breakdown].sort(
    (a, b) => Number(b.score) - Number(a.score),
  );

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="border-t border-border bg-muted/30 px-5 py-4 space-y-4">
        {/* Job meta */}
        {(job?.description || (job?.requirements.skills ?? []).length > 0) && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {job?.description && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  Job Description
                </p>
                <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                  {job.description}
                </p>
              </div>
            )}
            {(job?.requirements.skills ?? []).length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  Required Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {job!.requirements.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Breakdown table */}
        {sorted.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Score Breakdown
            </p>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                      Requirement
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground w-24">
                      Score
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground hidden sm:table-cell">
                      AI Feedback
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((req: RequirementScore, i) => {
                    const s = Number(req.score);
                    return (
                      <tr
                        key={req.requirement}
                        className={`border-b border-border last:border-0 ${
                          i % 2 === 0 ? "bg-card" : "bg-muted/20"
                        }`}
                        data-ocid={`dashboard.breakdown.row.${i + 1}`}
                      >
                        <td className="px-3 py-2.5">
                          <span className="font-medium text-foreground">
                            {req.requirement}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex flex-col items-center gap-1">
                            <span
                              className={`font-display font-bold text-sm ${accentTextColor(s)}`}
                            >
                              {s}%
                            </span>
                            <div className="h-1 w-14 rounded-full bg-border overflow-hidden">
                              <div
                                className={`h-full rounded-full ${scoreBarColor(s)}`}
                                style={{ width: `${s}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 hidden sm:table-cell">
                          <span className="text-muted-foreground text-xs leading-relaxed">
                            {req.feedback || "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Expandable Match Card ─────────────────────────────────────────────────────

function ExpandableMatchCard({
  match,
  job,
  rank,
  isExpanded,
  onToggle,
}: {
  match: MatchResult;
  job: Job | null | undefined;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const score = Number(match.overallScore);
  const barColor = accentBarColor(score);
  const textColor = accentTextColor(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.06, duration: 0.3 }}
      data-ocid={`match.item.${rank}`}
      className="rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-shadow duration-200 hover:shadow-md"
    >
      {/* Colored accent bar */}
      <div className={`h-1 w-full ${barColor}`} />

      {/* Card header — always visible */}
      <button
        type="button"
        className="w-full text-left p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        onClick={onToggle}
        aria-expanded={isExpanded}
        data-ocid={`match.toggle.${rank}`}
      >
        <div className="flex items-start gap-4">
          {/* Rank + Score */}
          <div className="flex flex-col items-center gap-1 pt-0.5 min-w-[56px]">
            <span className="font-display text-xs font-semibold text-muted-foreground">
              #{rank}
            </span>
            <ScoreBadge score={score} size="lg" />
          </div>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-display text-lg font-semibold text-foreground truncate">
                {job?.title ?? "Job Posting"}
              </h3>
              <Badge
                variant="outline"
                className={`text-xs font-semibold shrink-0 ${textColor} border-current/30`}
              >
                {matchLabel(score)}
              </Badge>
            </div>

            {job?.description && (
              <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                {job.description}
              </p>
            )}

            {/* Top 2 breakdown pills */}
            {match.breakdown.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {[...match.breakdown]
                  .sort((a, b) => Number(b.score) - Number(a.score))
                  .slice(0, 3)
                  .map((req) => {
                    const s = Number(req.score);
                    return (
                      <span
                        key={req.requirement}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border ${scoreBgColor(s)} ${accentTextColor(s)}`}
                      >
                        {req.requirement}
                        <span className="font-bold">{s}%</span>
                      </span>
                    );
                  })}
                {match.breakdown.length > 3 && (
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs text-muted-foreground bg-muted">
                    +{match.breakdown.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Date + expand icon */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDate(match.matchedAt)}
            </span>
            <span className="text-muted-foreground">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </span>
          </div>
        </div>
      </button>

      {/* Expandable breakdown */}
      <AnimatePresence>
        {isExpanded && <BreakdownTable breakdown={match.breakdown} job={job} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useGetCandidateProfile();
  const {
    data: matches = [],
    isLoading: matchesLoading,
    isSuccess: matchesLoaded,
  } = useGetMyMatches();
  const { data: jobs = [], isLoading: jobsLoading } = useListAllJobs();
  const { data: resume, isLoading: resumeLoading } = useGetMyResume();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isLoading =
    profileLoading || matchesLoading || jobsLoading || resumeLoading;

  const sortedMatches = [...matches].sort(
    (a: MatchResult, b: MatchResult) =>
      Number(b.overallScore) - Number(a.overallScore),
  );

  const jobMap = new Map<string, Job>(
    jobs.map((j: Job) => [j.id.toString(), j]),
  );

  const bestScore =
    sortedMatches.length > 0 ? Number(sortedMatches[0].overallScore) : null;

  const avgScore =
    sortedMatches.length > 0
      ? Math.round(
          sortedMatches.reduce((sum, m) => sum + Number(m.overallScore), 0) /
            sortedMatches.length,
        )
      : null;

  // State: resume uploaded but no matches yet
  const matchingInProgress =
    !isLoading && !!resume && matchesLoaded && sortedMatches.length === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Page header strip */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div data-ocid="dashboard.header">
              <h1 className="font-display text-2xl font-bold text-foreground">
                {profileLoading ? (
                  <Skeleton className="h-7 w-52" />
                ) : (
                  <>
                    {profile?.name
                      ? `Welcome back, ${profile.name.split(" ")[0]} 👋`
                      : "Your Match Dashboard"}
                  </>
                )}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Your resume vs every open job — scored and ranked transparently.
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              data-ocid="dashboard.upload_resume_button"
              className="shrink-0"
            >
              <Link to="/upload">
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                {resume ? "Replace Resume" : "Upload Resume"}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats bar */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3"
            data-ocid="dashboard.stats_bar"
          >
            <StatCard
              icon={Target}
              label="Total Matches"
              value={sortedMatches.length}
              sub={sortedMatches.length === 1 ? "job matched" : "jobs matched"}
            />
            <StatCard
              icon={Award}
              label="Best Score"
              value={bestScore !== null ? `${bestScore}%` : "—"}
              accent={bestScore !== null}
              sub={bestScore !== null ? matchLabel(bestScore) : undefined}
            />
            <StatCard
              icon={BarChart3}
              label="Avg. Score"
              value={avgScore !== null ? `${avgScore}%` : "—"}
              sub={avgScore !== null ? "across all matches" : undefined}
            />
          </motion.div>
        )}

        {/* No resume uploaded */}
        {!isLoading && !resume && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center rounded-xl border border-dashed border-primary/30 bg-primary/5 px-8 py-14 text-center"
            data-ocid="dashboard.no_resume_empty_state"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              No resume uploaded yet
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Upload your resume and TalentFlow will instantly match you against
              all open jobs — with full score transparency.
            </p>
            <Button
              asChild
              className="mt-6"
              data-ocid="dashboard.empty_upload_button"
            >
              <Link to="/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Resume
              </Link>
            </Button>
          </motion.div>
        )}

        {/* Resume uploaded, matching in progress */}
        {matchingInProgress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center rounded-xl border border-border bg-card px-8 py-14 text-center"
            data-ocid="dashboard.matching_in_progress"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              Matching in progress…
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Our AI is analyzing your resume against all open jobs. This
              usually takes a few moments — check back shortly.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner size="sm" />
              <span>Processing…</span>
            </div>
          </motion.div>
        )}

        {/* Match list */}
        {!isLoading && sortedMatches.length > 0 && (
          <div data-ocid="dashboard.matches_section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Job Matches
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({sortedMatches.length} result
                  {sortedMatches.length !== 1 ? "s" : ""})
                </span>
              </h2>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Click any card to see the full breakdown
              </p>
            </div>

            <div className="space-y-3" data-ocid="dashboard.matches_list">
              {sortedMatches.map((match: MatchResult, idx: number) => {
                const cardId = match.id.toString();
                return (
                  <ExpandableMatchCard
                    key={cardId}
                    match={match}
                    job={jobMap.get(match.jobId.toString())}
                    rank={idx + 1}
                    isExpanded={expandedId === cardId}
                    onToggle={() =>
                      setExpandedId((prev) => (prev === cardId ? null : cardId))
                    }
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Loading skeletons for match list */}
        {isLoading && (
          <div className="space-y-3" data-ocid="dashboard.loading_state">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-36 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* Empty state — no matches, but resume exists and not in progress */}
        {!isLoading &&
          !matchingInProgress &&
          resume &&
          sortedMatches.length === 0 && (
            <div
              className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center"
              data-ocid="dashboard.empty_state"
            >
              <Inbox className="mb-3 h-10 w-10 text-muted-foreground" />
              <h3 className="font-display font-semibold text-foreground mb-1">
                No open jobs right now
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                There are no open positions available at the moment. Check back
                soon — new jobs are posted regularly.
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
