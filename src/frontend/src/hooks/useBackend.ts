import { useActor } from "@caffeineai/core-infrastructure";
import type { createActorFunction } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ExternalBlob, createActor } from "../backend";

// Ensure createActor satisfies the expected createActorFunction type
const _typedCreateActor: createActorFunction<ReturnType<typeof createActor>> =
  createActor;
import type {
  CandidateProfile,
  EducationLevel,
  ExperienceLevel,
  Job,
  JobId,
  MatchResult,
  Resume,
} from "../types";

// ─── Candidate Profile ────────────────────────────────────────────────────────

export function useGetCandidateProfile() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  const query = useQuery<CandidateProfile | null>({
    queryKey: ["candidateProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCandidateProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCandidateProfile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, email }: { name: string; email: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCandidateProfile(name, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
    },
  });
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export function useListOpenJobs() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<Job[]>({
    queryKey: ["openJobs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listOpenJobs();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useListAllJobs() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<Job[]>({
    queryKey: ["allJobs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllJobs();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetJob(jobId: JobId | null) {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<Job | null>({
    queryKey: ["job", jobId?.toString()],
    queryFn: async () => {
      if (!actor || jobId == null) return null;
      return actor.getJob(jobId);
    },
    enabled: !!actor && !actorFetching && jobId != null,
  });
}

export interface CreateJobParams {
  title: string;
  description: string;
  requirements: {
    skills: string[];
    minYearsExperience: bigint;
    educationLevel: EducationLevel;
    experienceLevel: ExperienceLevel;
    otherRequirements: string[];
  };
}

export function useCreateJob() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      requirements,
    }: CreateJobParams) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createJob(title, description, requirements);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allJobs"] });
      queryClient.invalidateQueries({ queryKey: ["openJobs"] });
    },
  });
}

export function useCloseJob() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: JobId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.closeJob(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allJobs"] });
      queryClient.invalidateQueries({ queryKey: ["openJobs"] });
    },
  });
}

// ─── Resume ───────────────────────────────────────────────────────────────────

export function useGetMyResume() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<Resume | null>({
    queryKey: ["myResume"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyResume();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUploadResume() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      filename,
      blob,
    }: { filename: string; blob: ExternalBlob }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.uploadResume(filename, blob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myResume"] });
      queryClient.invalidateQueries({ queryKey: ["myMatches"] });
    },
  });
}

// ─── Matches ──────────────────────────────────────────────────────────────────

export function useGetMyMatches() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<MatchResult[]>({
    queryKey: ["myMatches"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyMatches();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetMyMatchForJob(jobId: JobId | null) {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<MatchResult | null>({
    queryKey: ["matchForJob", jobId?.toString()],
    queryFn: async () => {
      if (!actor || jobId == null) return null;
      return actor.getMyMatchForJob(jobId);
    },
    enabled: !!actor && !actorFetching && jobId != null,
  });
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function useListCandidateProfiles() {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  return useQuery<CandidateProfile[]>({
    queryKey: ["candidateProfiles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCandidateProfiles();
    },
    enabled: !!actor && !actorFetching,
  });
}
