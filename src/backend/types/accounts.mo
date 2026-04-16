import Common "common";

module {
  public type CandidateProfile = {
    id : Common.UserId;
    name : Text;
    email : Text;
    createdAt : Common.Timestamp;
  };
};
