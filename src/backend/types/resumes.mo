import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type Resume = {
    id : Common.ResumeId;
    candidateId : Common.UserId;
    filename : Text;
    blob : Storage.ExternalBlob;
    uploadedAt : Common.Timestamp;
  };
};
