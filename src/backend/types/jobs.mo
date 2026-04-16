import Common "common";

module {
  public type ExperienceLevel = {
    #entry;
    #mid;
    #senior;
    #lead;
  };

  public type EducationLevel = {
    #highSchool;
    #bachelors;
    #masters;
    #phd;
    #notRequired;
  };

  public type JobRequirements = {
    skills : [Text];
    minYearsExperience : Nat;
    educationLevel : EducationLevel;
    experienceLevel : ExperienceLevel;
    otherRequirements : [Text];
  };

  public type JobStatus = {
    #open;
    #closed;
  };

  public type Job = {
    id : Common.JobId;
    title : Text;
    description : Text;
    requirements : JobRequirements;
    status : JobStatus;
    createdAt : Common.Timestamp;
    createdBy : Common.UserId;
  };
};
