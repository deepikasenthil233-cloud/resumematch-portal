import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import MatchingLib "../lib/matching";
import Common "../types/common";
import Types "../types/matching";

mixin (
  accessControlState : AccessControl.AccessControlState,
  matches : Map.Map<Common.MatchId, Types.MatchResult>,
) {
  /// Candidate: get all match results for the logged-in candidate
  public query ({ caller }) func getMyMatches() : async [Types.MatchResult] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    MatchingLib.getMatchesForCandidate(matches, caller);
  };

  /// Candidate: get match result for a specific job
  public query ({ caller }) func getMyMatchForJob(jobId : Common.JobId) : async ?Types.MatchResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    MatchingLib.getMatchForJob(matches, caller, jobId);
  };
};
