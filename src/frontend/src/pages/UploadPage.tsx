import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  RefreshCw,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ExternalBlob } from "../backend";
import Spinner from "../components/ui/Spinner";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import {
  useGetCandidateProfile,
  useGetMyResume,
  useUploadResume,
} from "../hooks/useBackend";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_EXTS = [".pdf", ".doc", ".docx"];
const MAX_SIZE_MB = 10;

type FileError = "wrong_type" | "too_large" | null;
type UploadState = "idle" | "uploading" | "success";

function getFileExtension(name: string): string {
  return name.toLowerCase().substring(name.lastIndexOf("."));
}

function validateFile(file: File): FileError {
  const ext = getFileExtension(file.name);
  if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTS.includes(ext)) {
    return "wrong_type";
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return "too_large";
  }
  return null;
}

export default function UploadPage() {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useGetCandidateProfile();
  const { data: resume, isLoading: resumeLoading } = useGetMyResume();
  const uploadResume = useUploadResume();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<FileError>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPageLoading = profileLoading || resumeLoading;

  // Redirect to dashboard 2 seconds after successful upload
  useEffect(() => {
    if (uploadState === "success") {
      const timer = setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [uploadState, navigate]);

  if (!isPageLoading && !profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="h-10 w-10 text-muted-foreground" />
        <h2 className="font-display text-xl font-semibold text-foreground">
          Profile required
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          You need to complete your candidate profile before uploading a resume.
        </p>
        <Button asChild data-ocid="upload.complete_profile_button">
          <a href="/register">Complete Profile</a>
        </Button>
      </div>
    );
  }

  const selectFile = (file: File) => {
    const error = validateFile(file);
    setFileError(error);
    setUploadError(null);
    if (!error) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFileError(null);
    setUploadError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploadState("uploading");
    setUploadError(null);
    setUploadProgress(0);

    try {
      const bytes = new Uint8Array(await selectedFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
        setUploadProgress(pct),
      );
      await uploadResume.mutateAsync({ filename: selectedFile.name, blob });
      setUploadState("success");
    } catch {
      setUploadState("idle");
      setUploadError(
        "Upload failed. Please check your connection and try again.",
      );
      setUploadProgress(0);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) selectFile(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) selectFile(file);
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-1">
          {resume ? "Replace Resume" : "Upload Resume"}
        </h1>
        <p className="text-muted-foreground">
          Upload your resume and we'll automatically match it against all open
          positions.
        </p>
      </div>

      {isPageLoading ? (
        <div className="space-y-4" data-ocid="upload.loading_state">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-52 w-full rounded-xl" />
        </div>
      ) : uploadState === "success" ? (
        /* ─── Success state ─── */
        <div
          className="flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-[oklch(0.63_0.18_146)] bg-[oklch(0.63_0.18_146)]/8 p-14 text-center"
          data-ocid="upload.success_state"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[oklch(0.63_0.18_146)]/15">
            <CheckCircle2 className="h-9 w-9 text-[oklch(0.48_0.18_146)]" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-xl font-bold text-[oklch(0.35_0.12_146)]">
              Resume uploaded successfully!
            </h2>
            <p className="text-[oklch(0.48_0.18_146)] font-medium text-base">
              Your resume has been uploaded.
            </p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Matching results will appear on your dashboard shortly. You'll be
              redirected there now.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Current resume banner */}
          {resume && (
            <div
              className="mb-6 flex items-center gap-3 rounded-xl border border-accent/25 bg-accent/6 p-4"
              data-ocid="upload.current_resume"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15">
                <FileText className="h-4 w-4 text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">
                  {resume.filename}
                </p>
                <p className="text-xs text-muted-foreground">
                  Currently uploaded ·{" "}
                  {new Date(
                    Number(resume.uploadedAt) / 1_000_000,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <RefreshCw className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
          )}

          {/* Drop zone — outer div handles drag events, inner label is the clickable/keyboard target */}
          <div
            data-ocid="upload.dropzone"
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 text-center transition-smooth ${
              dragActive
                ? "border-primary bg-primary/5"
                : selectedFile
                  ? "border-accent/50 bg-accent/4"
                  : "border-border bg-muted/20"
            }`}
          >
            {selectedFile ? (
              /* Selected file preview */
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/12 border border-accent/20">
                  <FileText className="h-7 w-7 text-accent" />
                </div>
                <div className="space-y-1">
                  <p className="font-display font-semibold text-foreground max-w-xs truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-3 h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  aria-label="Remove selected file"
                  data-ocid="upload.clear_file_button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              /* Empty drop zone */
              <>
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl border transition-smooth ${
                    dragActive
                      ? "border-primary/40 bg-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  <Upload
                    className={`h-7 w-7 transition-smooth ${
                      dragActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <p className="font-display font-semibold text-foreground">
                    {resume
                      ? "Drop a new resume here"
                      : "Drop your resume here"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PDF or Word document — up to {MAX_SIZE_MB} MB
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                  data-ocid="upload.browse_button"
                >
                  Browse files
                </Button>
              </>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="sr-only"
            tabIndex={-1}
            onChange={onInputChange}
          />

          {/* File type error */}
          {fileError === "wrong_type" && (
            <div
              className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive"
              data-ocid="upload.error_state"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                Unsupported file type. Please upload a <strong>.pdf</strong>,{" "}
                <strong>.doc</strong>, or <strong>.docx</strong> file.
              </span>
            </div>
          )}

          {/* File size error */}
          {fileError === "too_large" && (
            <div
              className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive"
              data-ocid="upload.error_state"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                File is too large. Maximum allowed size is{" "}
                <strong>{MAX_SIZE_MB} MB</strong>.
              </span>
            </div>
          )}

          {/* Upload network error */}
          {uploadError && (
            <div
              className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive"
              data-ocid="upload.error_state"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Upload progress */}
          {uploadState === "uploading" && (
            <div className="mt-5 space-y-2" data-ocid="upload.loading_state">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Spinner size="sm" />
                  <span>
                    Uploading
                    {uploadProgress > 0 ? ` — ${uploadProgress}%` : "..."}
                  </span>
                </div>
                <span className="text-muted-foreground text-xs">
                  AI matching runs after upload
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          {selectedFile && uploadState === "idle" && (
            <div className="mt-5 flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={!!fileError || !selectedFile}
                data-ocid="upload.submit_button"
                className="min-w-36"
              >
                <Upload className="mr-2 h-4 w-4" />
                {resume ? "Replace Resume" : "Upload Resume"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
