import { b as useAuth, d as useNavigate, r as reactExports, j as jsxRuntimeExports, S as Spinner, B as Button } from "./index-BsJz-7pb.js";
import { C as Card, b as CardHeader, a as CardContent } from "./card-yPKPWFmT.js";
import { a as useGetCandidateProfile } from "./useBackend-BGjhrPXf.js";
function LoginPage() {
  const { login, isAuthenticated, isInitializing, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  const {
    data: profile,
    isLoading: profileLoading,
    isFetched
  } = useGetCandidateProfile();
  reactExports.useEffect(() => {
    if (!isAuthenticated || !isFetched) return;
    if (profile) {
      navigate({ to: "/dashboard" });
    } else {
      navigate({ to: "/register" });
    }
  }, [isAuthenticated, profile, isFetched, navigate]);
  const isChecking = isAuthenticated && (profileLoading || !isFetched);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": "login.page",
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "AI-powered job matching platform" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-border shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-6 px-6 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "Sign in to your account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Use Internet Identity to sign in securely" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-6 pb-6 pt-4", children: isChecking ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "login.loading_state",
              className: "flex flex-col items-center gap-3 py-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: "md" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Checking your profile…" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "login.primary_button",
                size: "lg",
                className: "w-full font-display font-semibold transition-smooth",
                onClick: login,
                disabled: isInitializing || isLoggingIn,
                children: isInitializing || isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: "sm" }),
                  isInitializing ? "Initialising…" : "Connecting…"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "svg",
                    {
                      className: "w-5 h-5",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: 2,
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      "aria-hidden": "true",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" })
                    }
                  ),
                  "Continue with Internet Identity"
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No password needed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground leading-relaxed", children: "New to TalentFlow? Your candidate account will be created automatically on first sign-in." })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground mt-6", children: [
          "By signing in you agree to our",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "underline cursor-pointer hover:text-foreground transition-colors duration-200", children: "Terms of Service" }),
          " ",
          "and",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "underline cursor-pointer hover:text-foreground transition-colors duration-200", children: "Privacy Policy" }),
          "."
        ] })
      ] })
    }
  );
}
export {
  LoginPage as default
};
