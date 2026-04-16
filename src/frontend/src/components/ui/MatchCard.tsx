import { scoreBarColor, scoreColor } from "../../types";
import type { Job, MatchResult, RequirementScore } from "../../types";
import { Badge } from "../ui/badge";
import ScoreBadge from "./ScoreBadge";

interface MatchCardProps {
  match: MatchResult;
  job: Job | null | undefined;
  rank: number;
  ocid?: string;
}

export default function MatchCard({ match, job, rank, ocid }: MatchCardProps) {
  const score = Number(match.overallScore);
  const barColor = scoreBarColor(score);
  const textColor = scoreColor(score);

  const topBreakdown = [...match.breakdown]
    .sort((a, b) => Number(b.score) - Number(a.score))
    .slice(0, 4);

  return (
    <div
      data-ocid={ocid ?? `match.card.${rank}`}
      className="relative overflow-hidden rounded-lg border border-border bg-card shadow-md transition-smooth hover:shadow-elevated"
    >
      {/* Accent bar */}
      <div className={`h-1 w-full ${barColor}`} />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Rank + Score */}
          <div className="flex flex-col items-center gap-1 pt-1">
            <span className="font-display text-sm font-medium text-muted-foreground">
              #{rank}
            </span>
            <ScoreBadge score={score} size="lg" />
          </div>

          {/* Job info */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg font-semibold text-foreground truncate">
                {job?.title ?? "Job Posting"}
              </h3>
              <Badge
                variant="outline"
                className={`text-xs font-medium ${textColor} border-current/30`}
              >
                {score >= 75
                  ? "Strong Match"
                  : score >= 50
                    ? "Good Match"
                    : "Partial Match"}
              </Badge>
            </div>

            {job?.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                {job.description}
              </p>
            )}

            {/* Breakdown grid */}
            {topBreakdown.length > 0 && (
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {topBreakdown.map((req: RequirementScore) => (
                  <BreakdownItem key={req.requirement} req={req} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BreakdownItem({ req }: { req: RequirementScore }) {
  const score = Number(req.score);
  const barColor = scoreBarColor(score);

  return (
    <div className="rounded-md bg-muted/50 p-2.5">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-xs font-medium text-foreground truncate min-w-0">
          {req.requirement}
        </span>
        <span
          className={`text-xs font-bold font-display shrink-0 ${scoreColor(score)}`}
        >
          {score}%
        </span>
      </div>
      <div className="h-1 w-full rounded-full bg-border overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      {req.feedback && (
        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
          {req.feedback}
        </p>
      )}
    </div>
  );
}
