import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface RequirementScore {
    feedback: string;
    score: bigint;
    requirement: string;
}
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface JobRequirements {
    otherRequirements: Array<string>;
    experienceLevel: ExperienceLevel;
    minYearsExperience: bigint;
    skills: Array<string>;
    educationLevel: EducationLevel;
}
export type JobId = bigint;
export type MatchId = bigint;
export interface http_header {
    value: string;
    name: string;
}
export type ResumeId = bigint;
export type UserId = Principal;
export interface MatchResult {
    id: MatchId;
    matchedAt: Timestamp;
    overallScore: bigint;
    breakdown: Array<RequirementScore>;
    jobId: JobId;
    resumeId: ResumeId;
    candidateId: UserId;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Job {
    id: JobId;
    status: JobStatus;
    title: string;
    createdAt: Timestamp;
    createdBy: UserId;
    description: string;
    requirements: JobRequirements;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface CandidateProfile {
    id: UserId;
    name: string;
    createdAt: Timestamp;
    email: string;
}
export interface Resume {
    id: ResumeId;
    blob: ExternalBlob;
    filename: string;
    candidateId: UserId;
    uploadedAt: Timestamp;
}
export enum EducationLevel {
    phd = "phd",
    highSchool = "highSchool",
    masters = "masters",
    bachelors = "bachelors",
    notRequired = "notRequired"
}
export enum ExperienceLevel {
    mid = "mid",
    lead = "lead",
    senior = "senior",
    entry = "entry"
}
export enum JobStatus {
    closed = "closed",
    open = "open"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    closeJob(jobId: JobId): Promise<void>;
    createJob(title: string, description: string, requirements: JobRequirements): Promise<JobId>;
    getCallerUserRole(): Promise<UserRole>;
    getCandidateProfile(): Promise<CandidateProfile | null>;
    getJob(jobId: JobId): Promise<Job | null>;
    getMyMatchForJob(jobId: JobId): Promise<MatchResult | null>;
    getMyMatches(): Promise<Array<MatchResult>>;
    getMyResume(): Promise<Resume | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllJobs(): Promise<Array<Job>>;
    listCandidateProfiles(): Promise<Array<CandidateProfile>>;
    listOpenJobs(): Promise<Array<Job>>;
    saveCandidateProfile(name: string, email: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    uploadResume(filename: string, blob: ExternalBlob): Promise<void>;
}
