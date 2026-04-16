import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import Spinner from "../components/ui/Spinner";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../hooks/useAuth";
import {
  useGetCandidateProfile,
  useSaveCandidateProfile,
} from "../hooks/useBackend";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();

  const {
    data: profile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCandidateProfile();
  const saveProfile = useSaveCandidateProfile();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  // Redirect unauthenticated users back to login
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  // Profile already complete — go to dashboard
  useEffect(() => {
    if (isFetched && profile) {
      navigate({ to: "/dashboard" });
    }
  }, [isFetched, profile, navigate]);

  function validateName(value: string): boolean {
    if (!value.trim()) {
      setNameError("Full name is required.");
      return false;
    }
    setNameError("");
    return true;
  }

  function validateEmail(value: string): boolean {
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nameOk = validateName(name);
    const emailOk = validateEmail(email);
    if (!nameOk || !emailOk) return;

    try {
      await saveProfile.mutateAsync({ name: name.trim(), email: email.trim() });
      toast.success("Profile created! Welcome to TalentFlow.");
      navigate({ to: "/dashboard" });
    } catch {
      // error state handled inline
    }
  }

  if (isInitializing || profileLoading) {
    return (
      <div
        data-ocid="register.loading_state"
        className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background"
      >
        <div className="flex flex-col items-center gap-3">
          <Spinner size="md" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-ocid="register.page"
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
            Complete your candidate profile
          </p>
        </div>

        <Card className="border border-border shadow-md">
          <CardHeader className="pb-2 pt-6 px-6 text-center">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Create your profile
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              A few details to personalise your job match experience
            </p>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-4">
            <form
              data-ocid="register.form"
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5"
            >
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="candidate-name"
                  className="font-display font-medium text-sm text-foreground"
                >
                  Full name
                </Label>
                <Input
                  data-ocid="register.name_input"
                  id="candidate-name"
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) validateName(e.target.value);
                  }}
                  onBlur={() => validateName(name)}
                  autoComplete="name"
                  aria-invalid={!!nameError}
                  aria-describedby={nameError ? "name-error" : undefined}
                  className={
                    nameError
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {nameError && (
                  <p
                    id="name-error"
                    data-ocid="register.name_field_error"
                    className="text-xs text-destructive"
                    role="alert"
                  >
                    {nameError}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="candidate-email"
                  className="font-display font-medium text-sm text-foreground"
                >
                  Email address
                </Label>
                <Input
                  data-ocid="register.email_input"
                  id="candidate-email"
                  type="email"
                  placeholder="e.g. alex@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(email)}
                  autoComplete="email"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  className={
                    emailError
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {emailError && (
                  <p
                    id="email-error"
                    data-ocid="register.email_field_error"
                    className="text-xs text-destructive"
                    role="alert"
                  >
                    {emailError}
                  </p>
                )}
              </div>

              {/* Mutation error */}
              {saveProfile.isError && (
                <p
                  data-ocid="register.error_state"
                  className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2"
                  role="alert"
                >
                  Something went wrong. Please try again.
                </p>
              )}

              <Button
                data-ocid="register.submit_button"
                type="submit"
                size="lg"
                className="w-full font-display font-semibold mt-1 transition-smooth"
                disabled={saveProfile.isPending}
              >
                {saveProfile.isPending ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" />
                    Saving…
                  </span>
                ) : (
                  "Create profile & continue"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Your information is stored securely on the Internet Computer.
        </p>
      </div>
    </div>
  );
}
