import Map "mo:core/Map";
import _Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Common "types/common";
import AccountTypes "types/accounts";
import JobTypes "types/jobs";
import ResumeTypes "types/resumes";
import MatchTypes "types/matching";
import AccountsMixin "mixins/accounts-api";
import JobsMixin "mixins/jobs-api";
import ResumesMixin "mixins/resumes-api";
import MatchingMixin "mixins/matching-api";

actor {
  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Object storage infrastructure
  include MixinObjectStorage();

  // Domain state
  let candidateProfiles = Map.empty<Common.UserId, AccountTypes.CandidateProfile>();
  let jobs = Map.empty<Common.JobId, JobTypes.Job>();
  let resumes = Map.empty<Common.UserId, ResumeTypes.Resume>();
  let matches = Map.empty<Common.MatchId, MatchTypes.MatchResult>();

  // ID counters
  let nextJobId = { var count : Nat = 0 };
  let nextResumeId = { var count : Nat = 0 };
  let nextMatchId = { var count : Nat = 0 };

  // OpenAI API key (set by admin after deployment)
  let openAiApiKey = { var value : Text = "" };

  // Domain API mixins
  include AccountsMixin(accessControlState, candidateProfiles);
  include JobsMixin(accessControlState, jobs, nextJobId);
  include ResumesMixin(accessControlState, resumes, jobs, matches, nextResumeId, nextMatchId, openAiApiKey);
  include MatchingMixin(accessControlState, matches);
};
