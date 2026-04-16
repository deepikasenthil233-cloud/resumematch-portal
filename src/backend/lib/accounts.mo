import Map "mo:core/Map";
import Time "mo:core/Time";
import Common "../types/common";
import Types "../types/accounts";

module {
  public func getProfile(
    profiles : Map.Map<Common.UserId, Types.CandidateProfile>,
    userId : Common.UserId,
  ) : ?Types.CandidateProfile {
    profiles.get(userId);
  };

  public func saveProfile(
    profiles : Map.Map<Common.UserId, Types.CandidateProfile>,
    userId : Common.UserId,
    name : Text,
    email : Text,
  ) : () {
    let existing = profiles.get(userId);
    switch (existing) {
      case (?profile) {
        profiles.add(userId, { profile with name; email });
      };
      case null {
        profiles.add(userId, {
          id = userId;
          name;
          email;
          createdAt = Time.now();
        });
      };
    };
  };

  public func profileExists(
    profiles : Map.Map<Common.UserId, Types.CandidateProfile>,
    userId : Common.UserId,
  ) : Bool {
    switch (profiles.get(userId)) {
      case (?_) true;
      case null false;
    };
  };

  public func listProfiles(
    profiles : Map.Map<Common.UserId, Types.CandidateProfile>,
  ) : [Types.CandidateProfile] {
    profiles.values().toArray();
  };
};
