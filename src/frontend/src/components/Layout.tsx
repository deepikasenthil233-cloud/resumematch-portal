import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Briefcase,
  LayoutDashboard,
  LogIn,
  LogOut,
  Settings,
  Upload,
} from "lucide-react";
import { useIsAdmin } from "../hooks/useAuth";
import { Button } from "./ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { login, clear, isAuthenticated, isInitializing, isLoggingIn } =
    useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const queryClient = useQueryClient();
  const router = useRouterState();
  const pathname = router.location.pathname;

  const handleAuth = () => {
    if (isAuthenticated) {
      clear();
      queryClient.clear();
    } else {
      login();
    }
  };

  const navLinks = [
    { href: "/", label: "Jobs", icon: Briefcase, show: true },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      show: isAuthenticated,
    },
    {
      href: "/upload",
      label: "Upload Resume",
      icon: Upload,
      show: isAuthenticated,
    },
    {
      href: "/admin",
      label: "Admin",
      icon: Settings,
      show: isAuthenticated && isAdmin,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card shadow-subtle">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 no-underline"
            data-ocid="nav.logo_link"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">
              TalentFlow
            </span>
          </Link>

          {/* Nav */}
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Main navigation"
          >
            {navLinks
              .filter((l) => l.show)
              .map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    data-ocid={`nav.${link.label.toLowerCase().replace(/ /g, "_")}_link`}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors no-underline ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
          </nav>

          {/* Auth button */}
          <Button
            data-ocid="nav.auth_button"
            variant={isAuthenticated ? "outline" : "default"}
            size="sm"
            onClick={handleAuth}
            disabled={isInitializing || isLoggingIn}
            className="gap-2"
          >
            {isAuthenticated ? (
              <>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {isInitializing
                    ? "Loading..."
                    : isLoggingIn
                      ? "Signing in..."
                      : "Sign In"}
                </span>
              </>
            )}
          </Button>
        </div>

        {/* Mobile nav */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 pb-2 pt-1 md:hidden">
          {navLinks
            .filter((l) => l.show)
            .map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  data-ocid={`nav.mobile_${link.label.toLowerCase().replace(/ /g, "_")}_link`}
                  className={`flex shrink-0 items-center gap-1 rounded-md px-3 py-1 text-xs font-medium no-underline transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <link.icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              );
            })}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
