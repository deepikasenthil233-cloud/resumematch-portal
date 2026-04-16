import { b as useAuth, d as useNavigate, r as reactExports, j as jsxRuntimeExports, S as Spinner, B as Button } from "./index-Btkga7Nf.js";
import { L as Label, I as Input, u as ue } from "./label-TWnFa2ng.js";
import { C as Card, b as CardHeader, a as CardContent } from "./card-Bw-4F0Kj.js";
import { a as useGetCandidateProfile, b as useSaveCandidateProfile } from "./useBackend-BVU64uNh.js";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function RegisterPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const {
    data: profile,
    isLoading: profileLoading,
    isFetched
  } = useGetCandidateProfile();
  const saveProfile = useSaveCandidateProfile();
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [nameError, setNameError] = reactExports.useState("");
  const [emailError, setEmailError] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isInitializing, navigate]);
  reactExports.useEffect(() => {
    if (isFetched && profile) {
      navigate({ to: "/dashboard" });
    }
  }, [isFetched, profile, navigate]);
  function validateName(value) {
    if (!value.trim()) {
      setNameError("Full name is required.");
      return false;
    }
    setNameError("");
    return true;
  }
  function validateEmail(value) {
    if (!value.trim()) {
      setEmailError("Email address is required.");
      return false;
    }
    if (!EMAIL_REGEX.test(value.trim())) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const nameOk = validateName(name);
    const emailOk = validateEmail(email);
    if (!nameOk || !emailOk) return;
    try {
      await saveProfile.mutateAsync({ name: name.trim(), email: email.trim() });
      ue.success("Profile created! Welcome to TalentFlow.");
      navigate({ to: "/dashboard" });
    } catch {
    }
  }
  if (isInitializing || profileLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "register.loading_state",
        className: "min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: "md" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": "register.page",
      className: "min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background px-4 py-12",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-4 shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "svg",
            {
              className: "w-7 h-7 text-primary-foreground",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: 2.2,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              "aria-hidden": "true",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground tracking-tight", children: "TalentFlow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Complete your candidate profile" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-border shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-6 px-6 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "Create your profile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "A few details to personalise your job match experience" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-6 pb-6 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              "data-ocid": "register.form",
              onSubmit: handleSubmit,
              noValidate: true,
              className: "flex flex-col gap-5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "candidate-name",
                      className: "font-display font-medium text-sm text-foreground",
                      children: "Full name"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "register.name_input",
                      id: "candidate-name",
                      type: "text",
                      placeholder: "e.g. Alex Johnson",
                      value: name,
                      onChange: (e) => {
                        setName(e.target.value);
                        if (nameError) validateName(e.target.value);
                      },
                      onBlur: () => validateName(name),
                      autoComplete: "name",
                      "aria-invalid": !!nameError,
                      "aria-describedby": nameError ? "name-error" : void 0,
                      className: nameError ? "border-destructive focus-visible:ring-destructive" : ""
                    }
                  ),
                  nameError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      id: "name-error",
                      "data-ocid": "register.name_field_error",
                      className: "text-xs text-destructive",
                      role: "alert",
                      children: nameError
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "candidate-email",
                      className: "font-display font-medium text-sm text-foreground",
                      children: "Email address"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "register.email_input",
                      id: "candidate-email",
                      type: "email",
                      placeholder: "e.g. alex@example.com",
                      value: email,
                      onChange: (e) => {
                        setEmail(e.target.value);
                        if (emailError) validateEmail(e.target.value);
                      },
                      onBlur: () => validateEmail(email),
                      autoComplete: "email",
                      "aria-invalid": !!emailError,
                      "aria-describedby": emailError ? "email-error" : void 0,
                      className: emailError ? "border-destructive focus-visible:ring-destructive" : ""
                    }
                  ),
                  emailError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      id: "email-error",
                      "data-ocid": "register.email_field_error",
                      className: "text-xs text-destructive",
                      role: "alert",
                      children: emailError
                    }
                  )
                ] }),
                saveProfile.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    "data-ocid": "register.error_state",
                    className: "text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2",
                    role: "alert",
                    children: "Something went wrong. Please try again."
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "register.submit_button",
                    type: "submit",
                    size: "lg",
                    className: "w-full font-display font-semibold mt-1 transition-smooth",
                    disabled: saveProfile.isPending,
                    children: saveProfile.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: "sm" }),
                      "Saving…"
                    ] }) : "Create profile & continue"
                  }
                )
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground mt-6", children: "Your information is stored securely on the Internet Computer." })
      ] })
    }
  );
}
export {
  RegisterPage as default
};
