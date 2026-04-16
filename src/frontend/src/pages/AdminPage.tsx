import {
  AlertCircle,
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  PlusCircle,
  Settings,
  Tag,
  X,
} from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import { Textarea } from "../components/ui/textarea";
import {
  useCloseJob,
  useCreateJob,
  useListAllJobs,
  useSetOpenAiApiKey,
} from "../hooks/useBackend";
import type { CreateJobParams } from "../hooks/useBackend";
import { EducationLevel, ExperienceLevel, JobStatus } from "../types";
import type { Job } from "../types";

// ─── Constants ────────────────────────────────────────────────────────────────

const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  [ExperienceLevel.entry]: "Entry",
  [ExperienceLevel.mid]: "Mid",
  [ExperienceLevel.senior]: "Senior",
  [ExperienceLevel.lead]: "Lead",
};

const EDUCATION_LABELS: Record<EducationLevel, string> = {
  [EducationLevel.notRequired]: "Not Required",
  [EducationLevel.highSchool]: "High School",
  [EducationLevel.bachelors]: "Bachelor's Degree",
  [EducationLevel.masters]: "Master's Degree",
  [EducationLevel.phd]: "PhD",
};

const DEFAULT_FORM = {
  title: "",
  description: "",
  skills: [] as string[],
  skillInput: "",
  minYearsExperience: "0",
  educationLevel: EducationLevel.notRequired,
  experienceLevel: ExperienceLevel.entry,
  otherRequirements: "",
};

// ─── AI Configuration Panel ───────────────────────────────────────────────────

function ApiKeyPanel() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const setOpenAiApiKey = useSetOpenAiApiKey();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKey.trim()) return;
    try {
      await setOpenAiApiKey.mutateAsync(apiKey.trim());
      setSaved(true);
      setApiKey("");
      toast.success("OpenAI API key saved. Resume matching is now active.");
    } catch {
      toast.error("Failed to save API key. Please try again.");
    }
  }

  return (
    <section
      aria-labelledby="ai-config-heading"
      data-ocid="admin.api_key_panel"
      className="mb-10"
    >
      {/* Section label */}
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-primary/10 rounded-lg p-1.5">
          <Settings className="h-4 w-4 text-primary" />
        </div>
        <h2
          id="ai-config-heading"
          className="font-display font-bold text-lg text-foreground"
        >
          AI Configuration
        </h2>
        <Badge
          variant="outline"
          className="ml-1 text-xs font-semibold"
          style={{
            background: "oklch(0.95 0.08 85 / 0.3)",
            borderColor: "oklch(0.75 0.12 85 / 0.6)",
            color: "oklch(0.45 0.12 85)",
          }}
        >
          Required
        </Badge>
      </div>

      {/* Main card — amber border to signal required action */}
      <div
        className="rounded-2xl overflow-hidden shadow-sm"
        style={{
          border: "2px solid oklch(0.75 0.12 85 / 0.7)",
          background: "var(--card)",
        }}
      >
        {/* Warning banner — full-width amber */}
        {!saved && (
          <div
            className="flex items-start gap-3 px-5 py-4 border-b"
            style={{
              background: "oklch(0.95 0.08 85 / 0.25)",
              borderBottomColor: "oklch(0.75 0.12 85 / 0.4)",
            }}
          >
            <AlertTriangle
              className="h-5 w-5 shrink-0 mt-0.5"
              style={{ color: "oklch(0.6 0.14 85)" }}
            />
            <div className="min-w-0">
              <p
                className="text-sm font-bold"
                style={{ color: "oklch(0.45 0.14 85)" }}
              >
                No API key set — resume matching will show 0% until you enter a
                key
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "oklch(0.5 0.1 85)" }}
              >
                Enter your OpenAI API key below and click{" "}
                <strong>Save API Key</strong> to enable AI-powered resume
                analysis.
              </p>
            </div>
          </div>
        )}

        {/* Success banner */}
        {saved && (
          <div
            className="flex items-center gap-3 px-5 py-4 border-b"
            style={{
              background: "oklch(0.95 0.07 150 / 0.2)",
              borderBottomColor: "oklch(0.7 0.12 150 / 0.4)",
            }}
            data-ocid="admin.api_key_success_state"
          >
            <CheckCircle2
              className="h-5 w-5 shrink-0"
              style={{ color: "oklch(0.55 0.14 150)" }}
            />
            <p
              className="text-sm font-semibold"
              style={{ color: "oklch(0.45 0.12 150)" }}
            >
              API key saved — resume matching is now enabled. New uploads will
              be analyzed by AI.
            </p>
          </div>
        )}

        {/* Form body */}
        <div className="px-6 py-5">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Your OpenAI API key is required to analyze uploaded resumes and
              calculate match scores. The key is stored securely and never
              exposed to candidates.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="openai-key"
                className="text-sm font-semibold text-foreground"
              >
                OpenAI API Key
              </Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Input
                    id="openai-key"
                    type={showKey ? "text" : "password"}
                    placeholder="sk-proj-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="pr-10 font-mono text-sm h-11"
                    aria-label="OpenAI API Key"
                    data-ocid="admin.api_key_input"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showKey ? "Hide key" : "Show key"}
                    tabIndex={-1}
                  >
                    {showKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <Button
                  type="submit"
                  disabled={!apiKey.trim() || setOpenAiApiKey.isPending}
                  className="shrink-0 font-display font-bold h-11 px-6 text-sm"
                  data-ocid="admin.save_api_key_button"
                  style={{
                    background: apiKey.trim()
                      ? "oklch(0.6 0.14 85)"
                      : undefined,
                    color: apiKey.trim() ? "oklch(0.1 0.02 85)" : undefined,
                  }}
                >
                  {setOpenAiApiKey.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-current/40 border-t-current rounded-full animate-spin" />
                      Saving…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4" />
                      Save API Key
                    </span>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Get your API key from{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground transition-colors font-medium"
                >
                  platform.openai.com/api-keys
                </a>
                . You only need to set this once.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

// ─── Skill Tag Input ──────────────────────────────────────────────────────────

interface SkillTagInputProps {
  skills: string[];
  skillInput: string;
  onInputChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (s: string) => void;
}

function SkillTagInput({
  skills,
  skillInput,
  onInputChange,
  onAdd,
  onRemove,
}: SkillTagInputProps) {
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      onAdd();
    } else if (
      e.key === "Backspace" &&
      skillInput === "" &&
      skills.length > 0
    ) {
      onRemove(skills[skills.length - 1]);
    }
  }

  return (
    <div className="min-h-10 flex flex-wrap gap-1.5 items-center px-3 py-2 rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring cursor-text">
      {skills.map((skill) => (
        <span
          key={skill}
          className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 text-xs font-medium font-display"
        >
          <Tag className="h-2.5 w-2.5" />
          {skill}
          <button
            type="button"
            onClick={() => onRemove(skill)}
            className="hover:text-destructive transition-colors ml-0.5 rounded-full"
            aria-label={`Remove ${skill}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={skillInput}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={onAdd}
        placeholder={
          skills.length === 0 ? "Type a skill and press Enter…" : "Add more…"
        }
        className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        data-ocid="admin.skill_input"
      />
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────

interface JobCardProps {
  job: Job;
  index: number;
  onClose: (id: bigint) => void;
  isClosing: boolean;
}

function JobCard({ job, index, onClose, isClosing }: JobCardProps) {
  const isOpen = job.status === JobStatus.open;

  return (
    <div
      className="bg-background border border-border rounded-xl p-4 flex flex-col gap-2.5 transition-smooth hover:shadow-md hover:border-primary/20 group"
      data-ocid={`admin.job.item.${index}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-display font-semibold text-foreground text-sm leading-snug truncate">
            {job.title}
          </p>
          <span className="text-xs text-muted-foreground mt-0.5 block">
            {EXPERIENCE_LABELS[job.requirements.experienceLevel] ??
              job.requirements.experienceLevel}{" "}
            Level ·{" "}
            {EDUCATION_LABELS[job.requirements.educationLevel] ??
              job.requirements.educationLevel}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge
            variant="outline"
            className={
              isOpen
                ? "bg-accent/10 text-accent border-accent/30 text-xs font-medium"
                : "bg-muted text-muted-foreground border-border text-xs"
            }
            data-ocid={`admin.job_status.item.${index}`}
          >
            {isOpen ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Open
              </span>
            ) : (
              "Closed"
            )}
          </Badge>
          {isOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-smooth"
              onClick={() => onClose(job.id)}
              disabled={isClosing}
              aria-label={`Close ${job.title}`}
              data-ocid={`admin.close_job_button.${index}`}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Skills chips */}
      {job.requirements.skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {job.requirements.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center bg-secondary text-secondary-foreground border border-border rounded-full px-2 py-0.5 text-xs"
            >
              {skill}
            </span>
          ))}
          {job.requirements.skills.length > 5 && (
            <span className="inline-flex items-center bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
              +{job.requirements.skills.length - 5}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── AdminPage ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { data: jobs = [], isLoading: jobsLoading } = useListAllJobs();
  const createJob = useCreateJob();
  const closeJob = useCloseJob();

  function setField<K extends keyof typeof DEFAULT_FORM>(
    key: K,
    value: (typeof DEFAULT_FORM)[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function addSkill() {
    const s = form.skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm((f) => ({ ...f, skills: [...f.skills, s], skillInput: "" }));
    } else {
      setForm((f) => ({ ...f, skillInput: "" }));
    }
  }

  function removeSkill(skill: string) {
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Job title is required.";
    if (!form.description.trim())
      errs.description = "Job description is required.";
    const minYears = Number.parseInt(form.minYearsExperience || "0", 10);
    if (Number.isNaN(minYears) || minYears < 0 || minYears > 20) {
      errs.minYearsExperience = "Enter a value between 0 and 20.";
    }
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    const params: CreateJobParams = {
      title: form.title.trim(),
      description: form.description.trim(),
      requirements: {
        skills: form.skills,
        minYearsExperience: BigInt(minYears),
        educationLevel: form.educationLevel,
        experienceLevel: form.experienceLevel,
        otherRequirements: form.otherRequirements.trim()
          ? [form.otherRequirements.trim()]
          : [],
      },
    };

    try {
      await createJob.mutateAsync(params);
      setForm(DEFAULT_FORM);
      setFieldErrors({});
      toast.success("Job posting created successfully.");
    } catch {
      toast.error("Failed to create job. Please try again.");
    }
  }

  async function handleCloseJob(jobId: bigint) {
    try {
      await closeJob.mutateAsync(jobId);
      toast.success("Job closed.");
    } catch {
      toast.error("Failed to close job.");
    }
  }

  const openJobs = jobs.filter((j) => j.status === JobStatus.open);
  const closedJobs = jobs.filter((j) => j.status === JobStatus.closed);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-card border-b border-border px-6 py-5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="bg-primary/10 rounded-lg p-2 shrink-0">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">
              Admin Panel
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              AI Configuration &amp; Job Management
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── STEP 1: AI Configuration (always at top, always visible) ──── */}
        <ApiKeyPanel />

        {/* ── Divider ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5" />
            Job Management
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* ── STEP 2: Job management two-panel layout ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
          {/* ── Left: Create Job Form ───────────────────────────────────── */}
          <div
            className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
            data-ocid="admin.create_job_panel"
          >
            <div className="border-b border-border px-6 py-4 bg-muted/30">
              <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
                <PlusCircle className="h-4 w-4 text-primary" />
                Post a New Job
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Fill in the details below to publish a new opening
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="job-title" className="text-sm font-medium">
                  Job Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="job-title"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  aria-invalid={!!fieldErrors.title}
                  data-ocid="admin.job_title_input"
                />
                {fieldErrors.title && (
                  <p
                    className="text-xs text-destructive flex items-center gap-1"
                    data-ocid="admin.title_field_error"
                  >
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {fieldErrors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="job-desc" className="text-sm font-medium">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="job-desc"
                  placeholder="Describe the role, responsibilities, and what you're looking for…"
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  rows={4}
                  className="resize-none"
                  aria-invalid={!!fieldErrors.description}
                  data-ocid="admin.job_description_textarea"
                />
                {fieldErrors.description && (
                  <p
                    className="text-xs text-destructive flex items-center gap-1"
                    data-ocid="admin.description_field_error"
                  >
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {fieldErrors.description}
                  </p>
                )}
              </div>

              {/* Required Skills — tag input */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Required Skills</Label>
                <SkillTagInput
                  skills={form.skills}
                  skillInput={form.skillInput}
                  onInputChange={(v) => setField("skillInput", v)}
                  onAdd={addSkill}
                  onRemove={removeSkill}
                />
                <p className="text-xs text-muted-foreground">
                  Press Enter or comma to add a skill; Backspace to remove the
                  last
                </p>
              </div>

              {/* Experience + Years row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">
                    Experience Level
                  </Label>
                  <Select
                    value={form.experienceLevel}
                    onValueChange={(v) =>
                      setField("experienceLevel", v as ExperienceLevel)
                    }
                  >
                    <SelectTrigger data-ocid="admin.experience_level_select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EXPERIENCE_LABELS).map(([val, label]) => (
                        <SelectItem key={val} value={val}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="min-years" className="text-sm font-medium">
                    Min Years Exp.
                  </Label>
                  <Input
                    id="min-years"
                    type="number"
                    min={0}
                    max={20}
                    placeholder="0"
                    value={form.minYearsExperience}
                    onChange={(e) =>
                      setField("minYearsExperience", e.target.value)
                    }
                    aria-invalid={!!fieldErrors.minYearsExperience}
                    data-ocid="admin.years_experience_input"
                  />
                  {fieldErrors.minYearsExperience && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="admin.years_field_error"
                    >
                      {fieldErrors.minYearsExperience}
                    </p>
                  )}
                </div>
              </div>

              {/* Education Level */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Education Level</Label>
                <Select
                  value={form.educationLevel}
                  onValueChange={(v) =>
                    setField("educationLevel", v as EducationLevel)
                  }
                >
                  <SelectTrigger data-ocid="admin.education_level_select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EDUCATION_LABELS).map(([val, label]) => (
                      <SelectItem key={val} value={val}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Other Requirements — free-text textarea */}
              <div className="space-y-1.5">
                <Label htmlFor="other-req" className="text-sm font-medium">
                  Other Requirements
                </Label>
                <Textarea
                  id="other-req"
                  placeholder="Any additional notes, certifications, or special requirements…"
                  value={form.otherRequirements}
                  onChange={(e) =>
                    setField("otherRequirements", e.target.value)
                  }
                  rows={3}
                  className="resize-none"
                  data-ocid="admin.other_requirements_textarea"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full font-display font-semibold"
                disabled={createJob.isPending}
                data-ocid="admin.create_job_submit_button"
              >
                {createJob.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                    Posting…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Post Job
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* ── Right: Jobs List ──────────────────────────────────────────── */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden lg:sticky lg:top-4">
            <div className="border-b border-border px-5 py-4 bg-muted/30 flex items-center justify-between">
              <div>
                <h2 className="font-display font-semibold text-foreground text-sm">
                  All Job Postings
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {jobsLoading
                    ? "Loading…"
                    : `${openJobs.length} open · ${closedJobs.length} closed`}
                </p>
              </div>
              {!jobsLoading && jobs.length > 0 && (
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20 text-xs font-display font-semibold"
                >
                  {jobs.length} total
                </Badge>
              )}
            </div>

            <div
              className="p-4 max-h-[calc(100vh-230px)] overflow-y-auto space-y-2"
              data-ocid="admin.jobs_list"
            >
              {jobsLoading ? (
                <div className="space-y-3" data-ocid="admin.loading_state">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-4 border border-border rounded-xl space-y-2"
                    >
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-5 w-14 rounded-full" />
                      </div>
                      <Skeleton className="h-3 w-1/3" />
                      <div className="flex gap-1.5 pt-1">
                        <Skeleton className="h-5 w-14 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-12 text-center"
                  data-ocid="admin.empty_state"
                >
                  <div className="bg-muted rounded-full p-4 mb-3">
                    <Briefcase className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="font-display font-semibold text-foreground text-sm">
                    No jobs posted yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[160px]">
                    Use the form to create your first job opening
                  </p>
                </div>
              ) : (
                <>
                  {openJobs.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 pt-1">
                        Open ({openJobs.length})
                      </p>
                      {openJobs.map((job, idx) => (
                        <JobCard
                          key={job.id.toString()}
                          job={job}
                          index={idx + 1}
                          onClose={handleCloseJob}
                          isClosing={closeJob.isPending}
                        />
                      ))}
                    </div>
                  )}
                  {closedJobs.length > 0 && (
                    <div className="space-y-2 mt-3">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 pt-1">
                        Closed ({closedJobs.length})
                      </p>
                      {closedJobs.map((job, idx) => (
                        <JobCard
                          key={job.id.toString()}
                          job={job}
                          index={openJobs.length + idx + 1}
                          onClose={handleCloseJob}
                          isClosing={closeJob.isPending}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
