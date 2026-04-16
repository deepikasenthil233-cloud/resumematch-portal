import { d as useNavigate, r as reactExports, j as jsxRuntimeExports, B as Button, U as Upload, S as Spinner, E as ExternalBlob } from "./index-BsJz-7pb.js";
import { S as Skeleton } from "./skeleton-Hn6cyVdj.js";
import { a as useGetCandidateProfile, e as useGetMyResume, f as useUploadResume } from "./useBackend-BGjhrPXf.js";
import { C as CircleAlert, X } from "./x-BqXVoS0I.js";
import { C as CircleCheck } from "./circle-check-DqSjEYU9.js";
import { F as FileText, R as RefreshCw } from "./refresh-cw-SY9HDTYS.js";
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];
const ALLOWED_EXTS = [".pdf", ".doc", ".docx"];
const MAX_SIZE_MB = 10;
function getFileExtension(name) {
  return name.toLowerCase().substring(name.lastIndexOf("."));
}
function validateFile(file) {
  const ext = getFileExtension(file.name);
  if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTS.includes(ext)) {
    return "wrong_type";
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return "too_large";
  }
  return null;
}
function UploadPage() {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useGetCandidateProfile();
  const { data: resume, isLoading: resumeLoading } = useGetMyResume();
  const uploadResume = useUploadResume();
  const [dragActive, setDragActive] = reactExports.useState(false);
  const [selectedFile, setSelectedFile] = reactExports.useState(null);
  const [fileError, setFileError] = reactExports.useState(null);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [uploadState, setUploadState] = reactExports.useState("idle");
  const [uploadError, setUploadError] = reactExports.useState(null);
  const inputRef = reactExports.useRef(null);
  const isPageLoading = profileLoading || resumeLoading;
  reactExports.useEffect(() => {
    if (uploadState === "success") {
      const timer = setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 2e3);
      return () => clearTimeout(timer);
    }
  }, [uploadState, navigate]);
  if (!isPageLoading && !profile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-10 w-10 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "Profile required" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-sm", children: "You need to complete your candidate profile before uploading a resume." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, "data-ocid": "upload.complete_profile_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/register", children: "Complete Profile" }) })
    ] });
  }
  const selectFile = (file) => {
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
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress(
        (pct) => setUploadProgress(pct)
      );
      await uploadResume.mutateAsync({ filename: selectedFile.name, blob });
      setUploadState("success");
    } catch {
      setUploadState("idle");
      setUploadError(
        "Upload failed. Please check your connection and try again."
      );
      setUploadProgress(0);
    }
  };
  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) selectFile(file);
  };
  const onInputChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) selectFile(file);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-2xl px-4 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground mb-1", children: resume ? "Replace Resume" : "Upload Resume" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Upload your resume and we'll automatically match it against all open positions." })
    ] }),
    isPageLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "upload.loading_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-52 w-full rounded-xl" })
    ] }) : uploadState === "success" ? (
      /* ─── Success state ─── */
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-[oklch(0.63_0.18_146)] bg-[oklch(0.63_0.18_146)]/8 p-14 text-center",
          "data-ocid": "upload.success_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-full bg-[oklch(0.63_0.18_146)]/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-9 w-9 text-[oklch(0.48_0.18_146)]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-[oklch(0.35_0.12_146)]", children: "Resume uploaded successfully!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[oklch(0.48_0.18_146)] font-medium text-base", children: "Your resume has been uploaded." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm", children: "Matching results will appear on your dashboard shortly. You'll be redirected there now." })
            ] })
          ]
        }
      )
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      resume && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "mb-6 flex items-center gap-3 rounded-xl border border-accent/25 bg-accent/6 p-4",
          "data-ocid": "upload.current_resume",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-accent" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: resume.filename }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Currently uploaded ·",
                " ",
                new Date(
                  Number(resume.uploadedAt) / 1e6
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 text-muted-foreground shrink-0" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "upload.dropzone",
          onDragOver: (e) => {
            e.preventDefault();
            setDragActive(true);
          },
          onDragLeave: () => setDragActive(false),
          onDrop,
          className: `relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 text-center transition-smooth ${dragActive ? "border-primary bg-primary/5" : selectedFile ? "border-accent/50 bg-accent/4" : "border-border bg-muted/20"}`,
          children: selectedFile ? (
            /* Selected file preview */
            /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-xl bg-accent/12 border border-accent/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-7 w-7 text-accent" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground max-w-xs truncate", children: selectedFile.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  (selectedFile.size / (1024 * 1024)).toFixed(1),
                  " MB"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "absolute right-3 top-3 h-7 w-7 p-0 text-muted-foreground hover:text-foreground",
                  onClick: (e) => {
                    e.stopPropagation();
                    clearFile();
                  },
                  "aria-label": "Remove selected file",
                  "data-ocid": "upload.clear_file_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                }
              )
            ] })
          ) : (
            /* Empty drop zone */
            /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `flex h-14 w-14 items-center justify-center rounded-xl border transition-smooth ${dragActive ? "border-primary/40 bg-primary/10" : "border-border bg-card"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Upload,
                    {
                      className: `h-7 w-7 transition-smooth ${dragActive ? "text-primary" : "text-muted-foreground"}`
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground", children: resume ? "Drop a new resume here" : "Drop your resume here" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  "PDF or Word document — up to ",
                  MAX_SIZE_MB,
                  " MB"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: (e) => {
                    var _a;
                    e.stopPropagation();
                    (_a = inputRef.current) == null ? void 0 : _a.click();
                  },
                  "data-ocid": "upload.browse_button",
                  children: "Browse files"
                }
              )
            ] })
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: inputRef,
          type: "file",
          accept: ".pdf,.doc,.docx",
          className: "sr-only",
          tabIndex: -1,
          onChange: onInputChange
        }
      ),
      fileError === "wrong_type" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive",
          "data-ocid": "upload.error_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Unsupported file type. Please upload a ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: ".pdf" }),
              ",",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: ".doc" }),
              ", or ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: ".docx" }),
              " file."
            ] })
          ]
        }
      ),
      fileError === "too_large" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive",
          "data-ocid": "upload.error_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "File is too large. Maximum allowed size is",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                MAX_SIZE_MB,
                " MB"
              ] }),
              "."
            ] })
          ]
        }
      ),
      uploadError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive",
          "data-ocid": "upload.error_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: uploadError })
          ]
        }
      ),
      uploadState === "uploading" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 space-y-2", "data-ocid": "upload.loading_state", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: "sm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Uploading",
              uploadProgress > 0 ? ` — ${uploadProgress}%` : "..."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "AI matching runs after upload" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full rounded-full bg-accent transition-all duration-300",
            style: { width: `${uploadProgress}%` }
          }
        ) })
      ] }),
      selectedFile && uploadState === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleUpload,
          disabled: !!fileError || !selectedFile,
          "data-ocid": "upload.submit_button",
          className: "min-w-36",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-2 h-4 w-4" }),
            resume ? "Replace Resume" : "Upload Resume"
          ]
        }
      ) })
    ] })
  ] });
}
export {
  UploadPage as default
};
