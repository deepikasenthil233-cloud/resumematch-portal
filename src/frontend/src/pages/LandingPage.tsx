import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Clock,
  Layers,
  Shield,
  Sparkles,
  Upload,
  UserPlus,
  Zap,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { useListOpenJobs } from "../hooks/useBackend";
import { ExperienceLevel, type Job } from "../types";

// ─── Static data ──────────────────────────────────────────────────────────────

const features = [
  {
    icon: Sparkles,
    title: "Smart Matching",
    description:
      "Our AI reads your resume and scores it against every open job — skills, experience, education, and more. No manual applying needed.",
    accent: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    icon: BarChart3,
    title: "Transparent Results",
    description:
      "See exactly why you match or don't. Every score comes with a per-requirement breakdown so there are no surprises.",
    accent: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Zap,
    title: "Fast & Fair",
    description:
      "Matching runs automatically the moment you upload your resume — instant results, same criteria for every candidate.",
    accent: "bg-accent/10",
    iconColor: "text-accent",
  },
];

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Create Account",
    description:
      "Register with your name and email. Your profile is your gateway to every open position on the platform.",
  },
  {
    step: "02",
    icon: Upload,
    title: "Upload Resume",
    description:
      "Upload your resume once. Our AI parses it automatically and keeps it ready for instant matching.",
  },
  {
    step: "03",
    icon: BarChart3,
    title: "See Your Matches",
    description:
      "View a ranked dashboard of every job you matched — with your score, a side-by-side breakdown, and feedback per requirement.",
  },
];

// ─── Hero score card mock ─────────────────────────────────────────────────────

const mockScores = [
  { role: "Senior Frontend Engineer", score: 92 },
  { role: "Full Stack Developer", score: 78 },
  { role: "React Specialist", score: 65 },
];

function ScoreCard({
  role,
  score,
  rank,
}: { role: string; score: number; rank: number }) {
  const color =
    score >= 75
      ? "text-accent"
      : score >= 50
        ? "text-[oklch(0.65_0.15_70)]"
        : "text-destructive";
  const bar =
    score >= 75
      ? "bg-accent"
      : score >= 50
        ? "bg-[oklch(0.65_0.15_70)]"
        : "bg-destructive";

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
      <span className="w-5 shrink-0 text-xs font-medium text-muted-foreground">
        {rank}.
      </span>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{role}</p>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full ${bar} transition-all duration-700`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
      <span className={`shrink-0 font-display text-xl font-bold ${color}`}>
        {score}%
      </span>
    </div>
  );
}

// ─── Experience level label ───────────────────────────────────────────────────

function expLabel(level: ExperienceLevel): string {
  const map: Record<ExperienceLevel, string> = {
    [ExperienceLevel.entry]: "Entry Level",
    [ExperienceLevel.mid]: "Mid Level",
    [ExperienceLevel.senior]: "Senior Level",
    [ExperienceLevel.lead]: "Lead",
  };
  return map[level] ?? String(level);
}

// ─── Job card ─────────────────────────────────────────────────────────────────

function JobCard({ job, index }: { job: Job; index: number }) {
  return (
    <div
      data-ocid={`jobs.item.${index + 1}`}
      className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-smooth hover:shadow-md hover:border-accent/30"
    >
      <div className="absolute top-0 left-0 h-0.5 w-0 rounded-t-xl bg-accent transition-all duration-300 group-hover:w-full" />
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-base font-semibold text-foreground leading-snug">
          {job.title}
        </h3>
        <Badge
          variant="secondary"
          className="shrink-0 text-xs bg-accent/10 text-accent border-accent/20"
        >
          Open
        </Badge>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="outline" className="text-xs gap-1">
          <Clock className="h-3 w-3" />
          {expLabel(job.requirements.experienceLevel)}
        </Badge>
        {Number(job.requirements.minYearsExperience) > 0 && (
          <Badge variant="outline" className="text-xs">
            {Number(job.requirements.minYearsExperience)}+ yrs exp
          </Badge>
        )}
      </div>
      {job.requirements.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.requirements.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {skill}
            </span>
          ))}
          {job.requirements.skills.length > 4 && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              +{job.requirements.skills.length - 4} more
            </span>
          )}
        </div>
      )}
      <p className="line-clamp-2 text-sm text-muted-foreground mt-0.5">
        {job.description}
      </p>
    </div>
  );
}

function JobCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-5 w-14" />
      </div>
      <div className="flex gap-1.5">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="flex gap-1.5">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { isAuthenticated } = useInternetIdentity();
  const { data: jobs, isLoading: jobsLoading } = useListOpenJobs();

  const scrollToJobs = () => {
    document
      .getElementById("open-jobs")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div data-ocid="landing.page">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        data-ocid="landing.hero_section"
        className="relative overflow-hidden border-b border-border bg-card"
      >
        {/* Subtle grid bg */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-28">
          {/* Left: copy */}
          <div className="flex flex-col items-start">
            <Badge
              variant="outline"
              className="mb-5 gap-1.5 border-accent/30 bg-accent/5 text-accent"
            >
              <Sparkles className="h-3 w-3" />
              AI-Powered Resume Matching
            </Badge>
            <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              Land the right job.{" "}
              <span className="text-accent">See exactly why you match.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground leading-relaxed">
              TalentFlow automatically scores your resume against every open
              position and delivers a transparent, ranked breakdown — no black
              boxes, no guesswork.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {isAuthenticated ? (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="gap-2"
                    data-ocid="landing.get_started_button"
                  >
                    <Link to="/dashboard">
                      View My Matches
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={scrollToJobs}
                    data-ocid="landing.browse_jobs_button"
                  >
                    Browse Open Jobs
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="gap-2"
                    data-ocid="landing.get_started_button"
                  >
                    <Link to="/register">
                      Get Started Free
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={scrollToJobs}
                    data-ocid="landing.browse_jobs_button"
                  >
                    Browse Jobs
                  </Button>
                </>
              )}
            </div>

            <div className="mt-8 flex items-center gap-5 text-sm text-muted-foreground">
              {[
                { icon: CheckCircle2, label: "Free to join" },
                { icon: Shield, label: "No spam" },
                { icon: Layers, label: "Instant results" },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-accent" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: score card visualization */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-5 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Your Match Dashboard
                  </p>
                  <p className="font-display text-sm font-semibold text-foreground mt-0.5">
                    3 jobs matched
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="gap-1 bg-accent/10 text-accent border-accent/20"
                >
                  <Sparkles className="h-3 w-3" />
                  AI Scored
                </Badge>
              </div>
              <div className="flex flex-col gap-3">
                {mockScores.map((s, i) => (
                  <ScoreCard
                    key={s.role}
                    role={s.role}
                    score={s.score}
                    rank={i + 1}
                  />
                ))}
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Scores update instantly when new jobs are posted
              </p>
            </div>
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section
        data-ocid="landing.features_section"
        className="bg-muted/30 py-20 border-b border-border"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">
              Why TalentFlow
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground">
              Everything you need to get hired smarter
            </h2>
            <p className="mt-3 text-muted-foreground">
              Built for fairness, transparency, and speed — from the moment you
              upload.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {features.map((f) => (
              <Card
                key={f.title}
                data-ocid={`landing.feature.${f.title.toLowerCase().replace(/\s+/g, "_")}_card`}
                className="relative overflow-hidden border-border shadow-none transition-smooth hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent opacity-0 transition-opacity group-hover:opacity-100" />
                <CardContent className="p-6">
                  <div
                    className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.accent}`}
                  >
                    <f.icon className={`h-5 w-5 ${f.iconColor}`} />
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section
        data-ocid="landing.how_it_works_section"
        className="bg-background py-20 border-b border-border"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">
              Get started in 3 steps
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              From sign-up to your first match in under 2 minutes.
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-3">
            {/* Connector line (desktop) */}
            <div className="absolute top-10 left-[16.66%] right-[16.66%] hidden h-0.5 bg-border sm:block" />

            {steps.map((s, i) => (
              <div
                key={s.step}
                data-ocid={`landing.step.${i + 1}`}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number circle */}
                <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-border bg-card shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <s.icon className="h-6 w-6 text-accent" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent font-display text-xs font-bold text-accent-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  {s.description}
                </p>
              </div>
            ))}
          </div>

          {/* Step CTA */}
          {!isAuthenticated && (
            <div className="mt-12 text-center">
              <Button
                asChild
                size="lg"
                className="gap-2"
                data-ocid="landing.how_it_works_cta_button"
              >
                <Link to="/register">
                  Start Now — It's Free
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ── Open Jobs ────────────────────────────────────────────────────── */}
      <section
        id="open-jobs"
        data-ocid="landing.jobs_section"
        className="bg-muted/30 py-20"
      >
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-1 text-sm font-medium uppercase tracking-wide text-accent">
                Now Hiring
              </p>
              <h2 className="font-display text-3xl font-bold text-foreground">
                Open Positions
              </h2>
              <p className="mt-2 text-muted-foreground">
                Upload your resume to instantly see your match score for each
                role.
              </p>
            </div>
            {isAuthenticated ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-1.5 shrink-0"
                data-ocid="landing.upload_resume_link"
              >
                <Link to="/upload">
                  <Upload className="h-4 w-4" />
                  Upload Resume
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-1.5 shrink-0"
                data-ocid="landing.sign_up_to_apply_link"
              >
                <Link to="/register">
                  Sign up to apply
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          {jobsLoading ? (
            <div
              data-ocid="landing.jobs_loading_state"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {["sk-1", "sk-2", "sk-3"].map((k) => (
                <JobCardSkeleton key={k} />
              ))}
            </div>
          ) : !jobs || jobs.length === 0 ? (
            <div
              data-ocid="landing.jobs_empty_state"
              className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Briefcase className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-display font-semibold text-foreground">
                No open positions yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Check back soon — new roles are posted regularly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job, i) => (
                <JobCard key={job.id.toString()} job={job} index={i} />
              ))}
            </div>
          )}

          {/* Bottom CTA for unauthenticated */}
          {!isAuthenticated && jobs && jobs.length > 0 && (
            <div className="mt-10 rounded-xl border border-accent/20 bg-accent/5 p-6 text-center">
              <p className="font-display font-semibold text-foreground mb-1">
                Want to see your match scores?
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Create a free account and upload your resume to get instant
                AI-powered match scores for all {jobs.length} open role
                {jobs.length > 1 ? "s" : ""}.
              </p>
              <Button
                asChild
                size="default"
                className="gap-2"
                data-ocid="landing.jobs_signup_cta_button"
              >
                <Link to="/register">
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
