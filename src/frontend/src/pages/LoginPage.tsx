import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import Spinner from "../components/ui/Spinner";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { useGetCandidateProfile } from "../hooks/useBackend";

export default function LoginPage() {
  const { login, isAuthenticated, isInitializing, isLoggingIn } = useAuth();
  const navigate = useNavigate();

  const {
    data: profile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCandidateProfile();

  // Once auth + profile check resolves, redirect accordingly
  useEffect(() => {
    if (!isAuthenticated || !isFetched) return;
    if (profile) {
      navigate({ to: "/dashboard" });
    } else {
      navigate({ to: "/register" });
    }
  }, [isAuthenticated, profile, isFetched, navigate]);

  const isChecking = isAuthenticated && (profileLoading || !isFetched);

  return (
    <div
      data-ocid="login.page"
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background px-4 py-12"
    >
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-4 shadow-md">
            <svg
              className="w-7 h-7 text-primary-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
            TalentFlow
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            AI-powered job matching platform
          </p>
        </div>

        <Card className="border border-border shadow-md">
          <CardHeader className="pb-2 pt-6 px-6 text-center">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Sign in to your account
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Use Internet Identity to sign in securely
            </p>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-4">
            {isChecking ? (
              <div
                data-ocid="login.loading_state"
                className="flex flex-col items-center gap-3 py-6"
              >
                <Spinner size="md" />
                <p className="text-sm text-muted-foreground">
                  Checking your profile…
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Button
                  data-ocid="login.primary_button"
                  size="lg"
                  className="w-full font-display font-semibold transition-smooth"
                  onClick={login}
                  disabled={isInitializing || isLoggingIn}
                >
                  {isInitializing || isLoggingIn ? (
                    <span className="flex items-center gap-2">
                      <Spinner size="sm" />
                      {isInitializing ? "Initialising…" : "Connecting…"}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      Continue with Internet Identity
                    </span>
                  )}
                </Button>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex-1 h-px bg-border" />
                  <span>No password needed</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <p className="text-center text-xs text-muted-foreground leading-relaxed">
                  New to TalentFlow? Your candidate account will be created
                  automatically on first sign-in.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in you agree to our{" "}
          <span className="underline cursor-pointer hover:text-foreground transition-colors duration-200">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="underline cursor-pointer hover:text-foreground transition-colors duration-200">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
}
