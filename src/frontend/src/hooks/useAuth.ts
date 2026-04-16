import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { UserRole } from "../types";

export function useAuth() {
  const {
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginStatus,
    identity,
  } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogin = () => {
    login();
  };

  const handleLogout = () => {
    clear();
    queryClient.clear();
  };

  return {
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginStatus,
    identity,
  };
}

export function useCallerRole() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<UserRole>({
    queryKey: ["callerRole"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 60_000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 60_000,
  });
}
