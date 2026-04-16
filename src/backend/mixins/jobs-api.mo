import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import JobsLib "../lib/jobs";
import Common "../types/common";
import Types "../types/jobs";

mixin (
  accessControlState : AccessControl.AccessControlState,
  jobs : Map.Map<Common.JobId, Types.Job>,
  nextJobId : { var count : Nat },
) {
  /// Admin: create a new job posting
  public shared ({ caller }) func createJob(
    title : Text,
    description : Text,
    requirements : Types.JobRequirements,
  ) : async Common.JobId {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    JobsLib.createJob(jobs, nextJobId, title, description, requirements, caller);
  };

  /// Get a single job by ID (public)
  public query func getJob(jobId : Common.JobId) : async ?Types.Job {
    JobsLib.getJob(jobs, jobId);
  };

  /// List all open jobs (public)
  public query func listOpenJobs() : async [Types.Job] {
    JobsLib.listOpenJobs(jobs);
  };

  /// Admin: list all jobs including closed ones
  public query ({ caller }) func listAllJobs() : async [Types.Job] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    JobsLib.listAllJobs(jobs);
  };

  /// Admin: close a job posting
  public shared ({ caller }) func closeJob(jobId : Common.JobId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    JobsLib.closeJob(jobs, jobId, caller);
  };
};
