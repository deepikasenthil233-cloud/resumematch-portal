import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import Types "../types/jobs";

module {
  public func createJob(
    jobs : Map.Map<Common.JobId, Types.Job>,
    nextId : { var count : Nat },
    title : Text,
    description : Text,
    requirements : Types.JobRequirements,
    createdBy : Common.UserId,
  ) : Common.JobId {
    let id = nextId.count;
    nextId.count += 1;
    let job : Types.Job = {
      id;
      title;
      description;
      requirements;
      status = #open;
      createdAt = Time.now();
      createdBy;
    };
    jobs.add(id, job);
    id;
  };

  public func getJob(
    jobs : Map.Map<Common.JobId, Types.Job>,
    jobId : Common.JobId,
  ) : ?Types.Job {
    jobs.get(jobId);
  };

  public func listOpenJobs(
    jobs : Map.Map<Common.JobId, Types.Job>,
  ) : [Types.Job] {
    jobs.values().filter(func(j) { j.status == #open }).toArray();
  };

  public func listAllJobs(
    jobs : Map.Map<Common.JobId, Types.Job>,
  ) : [Types.Job] {
    jobs.values().toArray();
  };

  public func closeJob(
    jobs : Map.Map<Common.JobId, Types.Job>,
    jobId : Common.JobId,
    _caller : Common.UserId,
  ) : () {
    switch (jobs.get(jobId)) {
      case (?job) {
        jobs.add(jobId, { job with status = #closed });
      };
      case null {
        Runtime.trap("Job not found");
      };
    };
  };
};
