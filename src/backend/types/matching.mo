import Common "common";

module {
  public type RequirementScore = {
    requirement : Text;
    score : Nat;
    feedback : Text;
  };

  public type MatchResult = {
    id : Common.MatchId;
    candidateId : Common.UserId;
    jobId : Common.JobId;
    resumeId : Common.ResumeId;
    overallScore : Nat;
    breakdown : [RequirementScore];
    matchedAt : Common.Timestamp;
  };
};
