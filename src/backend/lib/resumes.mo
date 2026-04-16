import Map "mo:core/Map";
import Time "mo:core/Time";
import Storage "mo:caffeineai-object-storage/Storage";
import Common "../types/common";
import Types "../types/resumes";

module {
  public func saveResume(
    resumes : Map.Map<Common.UserId, Types.Resume>,
    nextId : { var count : Nat },
    candidateId : Common.UserId,
    filename : Text,
    blob : Storage.ExternalBlob,
  ) : Common.ResumeId {
    let id = nextId.count;
    nextId.count += 1;
    let resume : Types.Resume = {
      id;
      candidateId;
      filename;
      blob;
      uploadedAt = Time.now();
    };
    resumes.add(candidateId, resume);
    id;
  };

  public func getResume(
    resumes : Map.Map<Common.UserId, Types.Resume>,
    candidateId : Common.UserId,
  ) : ?Types.Resume {
    resumes.get(candidateId);
  };
};
