import type { backendInterface, CandidateProfile, Job, JobRequirements, MatchResult, Resume } from "../backend";
import { EducationLevel, ExperienceLevel, JobStatus, UserRole } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);

const sampleRequirements: JobRequirements = {
  otherRequirements: ["Strong communication skills", "Team player"],
  experienceLevel: ExperienceLevel.senior,
  minYearsExperience: BigInt(5),
  skills: ["React", "TypeScript", "UI/UX", "Figma"],
  educationLevel: EducationLevel.bachelors,
};

const sampleJobs: Job[] = [
  {
    id: BigInt(1),
    status: JobStatus.open,
    title: "Senior Product Designer",
    createdAt: now,
    createdBy: { toText: () => "aaaaa-aaaaa" } as any,
    description: "We are looking for a Senior Product Designer to join our team and lead design initiatives.",
    requirements: {
      ...sampleRequirements,
      skills: ["Figma", "UI/UX", "Prototyping", "Design Systems"],
    },
  },
  {
    id: BigInt(2),
    status: JobStatus.open,
    title: "Marketing Manager",
    createdAt: now,
    createdBy: { toText: () => "aaaaa-aaaaa" } as any,
    description: "Drive marketing strategy and execution for our growing platform.",
    requirements: {
      otherRequirements: ["Creative thinking", "Data-driven"],
      experienceLevel: ExperienceLevel.mid,
      minYearsExperience: BigInt(3),
      skills: ["SEO", "Content Marketing", "Analytics", "Campaign Management"],
      educationLevel: EducationLevel.bachelors,
    },
  },
  {
    id: BigInt(3),
    status: JobStatus.open,
    title: "Data Analyst",
    createdAt: now,
    createdBy: { toText: () => "aaaaa-aaaaa" } as any,
    description: "Analyze complex datasets to drive business decisions.",
    requirements: {
      otherRequirements: ["Attention to detail"],
      experienceLevel: ExperienceLevel.mid,
      minYearsExperience: BigInt(2),
      skills: ["SQL", "Python", "Tableau", "Statistics"],
      educationLevel: EducationLevel.bachelors,
    },
  },
];

const sampleMatches: MatchResult[] = [
  {
    id: BigInt(1),
    matchedAt: now,
    overallScore: BigInt(85),
    breakdown: [
      { feedback: "Strong alignment with UI/UX, Figma experience", score: BigInt(90), requirement: "Skills" },
      { feedback: "5+ years in tech matches requirement", score: BigInt(88), requirement: "Experience" },
      { feedback: "Relevant degree and project work", score: BigInt(80), requirement: "Education" },
    ],
    jobId: BigInt(1),
    resumeId: BigInt(1),
    candidateId: { toText: () => "user-principal" } as any,
  },
  {
    id: BigInt(2),
    matchedAt: now,
    overallScore: BigInt(72),
    breakdown: [
      { feedback: "Skills alignment: UI/UX, Figma partially match", score: BigInt(70), requirement: "Skills" },
      { feedback: "Experience meets minimum threshold", score: BigInt(75), requirement: "Experience" },
      { feedback: "Relevant degree and project work", score: BigInt(72), requirement: "Education" },
    ],
    jobId: BigInt(2),
    resumeId: BigInt(1),
    candidateId: { toText: () => "user-principal" } as any,
  },
  {
    id: BigInt(3),
    matchedAt: now,
    overallScore: BigInt(65),
    breakdown: [
      { feedback: "Skills alignment: UI/UX, Figma — partial match", score: BigInt(60), requirement: "Skills" },
      { feedback: "Relevant degree and project work", score: BigInt(65), requirement: "Education" },
      { feedback: "Experience: 5+ years in tech", score: BigInt(70), requirement: "Experience" },
    ],
    jobId: BigInt(3),
    resumeId: BigInt(1),
    candidateId: { toText: () => "user-principal" } as any,
  },
];

const sampleProfile: CandidateProfile = {
  id: { toText: () => "user-principal" } as any,
  name: "Alex Johnson",
  createdAt: now,
  email: "alex.johnson@example.com",
};

const sampleResume: Resume = {
  id: BigInt(1),
  blob: { getDirectURL: () => "#", getBytes: async () => new Uint8Array(), withUploadProgress: (fn: any) => ({} as any) } as any,
  filename: "alex_johnson_resume.pdf",
  candidateId: { toText: () => "user-principal" } as any,
  uploadedAt: now,
};

export const mockBackend: backendInterface = {
  _immutableObjectStorageBlobsAreLive: async (hashes) => hashes.map(() => true),
  _immutableObjectStorageBlobsToDelete: async () => [],
  _immutableObjectStorageConfirmBlobDeletion: async () => undefined,
  _immutableObjectStorageCreateCertificate: async (blobHash) => ({ method: "PUT", blob_hash: blobHash }),
  _immutableObjectStorageRefillCashier: async () => ({ success: true, topped_up_amount: BigInt(0) }),
  _immutableObjectStorageUpdateGatewayPrincipals: async () => undefined,
  _initializeAccessControl: async () => undefined,
  assignCallerUserRole: async () => undefined,
  closeJob: async () => undefined,
  createJob: async () => BigInt(4),
  getCallerUserRole: async () => UserRole.user,
  getCandidateProfile: async () => sampleProfile,
  getJob: async (jobId) => sampleJobs.find(j => j.id === jobId) ?? null,
  getMyMatchForJob: async (jobId) => sampleMatches.find(m => m.jobId === jobId) ?? null,
  getMyMatches: async () => sampleMatches,
  getMyResume: async () => sampleResume,
  isCallerAdmin: async () => false,
  listAllJobs: async () => sampleJobs,
  listCandidateProfiles: async () => [sampleProfile],
  listOpenJobs: async () => sampleJobs,
  saveCandidateProfile: async () => undefined,
  setOpenAiApiKey: async () => undefined,
  transform: async (input) => ({ status: BigInt(200), body: input.response.body, headers: [] }),
  uploadResume: async () => undefined,
};
