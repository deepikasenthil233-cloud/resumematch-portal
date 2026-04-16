import { scoreBgColor, scoreColor } from "../../types";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-base",
  lg: "h-20 w-20 text-2xl",
  xl: "h-28 w-28 text-4xl",
};

export default function ScoreBadge({
  score,
  size = "md",
  className = "",
}: ScoreBadgeProps) {
  const colorClass = scoreColor(score);
  const bgClass = scoreBgColor(score);

  return (
    <div
      data-ocid="score.badge"
      className={`inline-flex flex-shrink-0 flex-col items-center justify-center rounded-full border-2 font-display font-bold ${sizeClasses[size]} ${colorClass} ${bgClass} ${className}`}
    >
      <span className="leading-none">{score}%</span>
    </div>
  );
}
