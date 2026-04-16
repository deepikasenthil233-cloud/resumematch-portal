import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import AccountsLib "../lib/accounts";
import Common "../types/common";
import Types "../types/accounts";

mixin (
  accessControlState : AccessControl.AccessControlState,
  candidateProfiles : Map.Map<Common.UserId, Types.CandidateProfile>,
) {
  /// Get the caller's own candidate profile
  public query ({ caller }) func getCandidateProfile() : async ?Types.CandidateProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    AccountsLib.getProfile(candidateProfiles, caller);
  };

  /// Create or update the caller's candidate profile (name + email)
  public shared ({ caller }) func saveCandidateProfile(name : Text, email : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    AccountsLib.saveProfile(candidateProfiles, caller, name, email);
  };

  /// Admin: list all candidate profiles
  public query ({ caller }) func listCandidateProfiles() : async [Types.CandidateProfile] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    AccountsLib.listProfiles(candidateProfiles);
  };
};
