import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Storage "mo:caffeineai-object-storage/Storage";
import AccessControl "mo:caffeineai-authorization/access-control";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import ResumeLib "../lib/resumes";
import MatchingLib "../lib/matching";
import Common "../types/common";
import ResumeTypes "../types/resumes";
import MatchTypes "../types/matching";
import JobTypes "../types/jobs";

mixin (
  accessControlState : AccessControl.AccessControlState,
  resumes : Map.Map<Common.UserId, ResumeTypes.Resume>,
  jobs : Map.Map<Common.JobId, JobTypes.Job>,
  matches : Map.Map<Common.MatchId, MatchTypes.MatchResult>,
  nextResumeId : { var count : Nat },
  nextMatchId : { var count : Nat },
) {
  /// Candidate: upload resume and auto-trigger matching against all open jobs
  public shared ({ caller }) func uploadResume(
    filename : Text,
    blob : Storage.ExternalBlob,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };

    // Save (or overwrite) the resume
    let resumeId = ResumeLib.saveResume(resumes, nextResumeId, caller, filename, blob);

    // Match against every open job
    let openJobs = jobs.values().filter(func(j : JobTypes.Job) : Bool { j.status == #open }).toArray();
    for (job in openJobs.values()) {
      let prompt = MatchingLib.buildMatchPrompt(filename, job);
      let requestBody = "{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"user\",\"content\":" # escapeJson(prompt) # "}],\"temperature\":0}";

      // Attempt AI call; on failure store a zero-score placeholder so the
      // candidate still sees that matching was attempted.
      let rawJson = try {
        await OutCall.httpPostRequest(
          "https://api.openai.com/v1/chat/completions",
          [{ name = "Authorization"; value = "Bearer OPENAI_API_KEY" },
           { name = "Content-Type"; value = "application/json" }],
          requestBody,
          transform,
        );
      } catch (_) {
        "{\"overallScore\":0,\"breakdown\":[]}";
      };

      // Extract the actual content from the OpenAI response envelope
      let content = extractOpenAiContent(rawJson);

      // Reserve a match ID before parsing so we can embed it in the record
      let matchId = nextMatchId.count;
      nextMatchId.count += 1;

      let result = MatchingLib.parseAiResponse(content, caller, job.id, resumeId, matchId);
      matches.add(matchId, result);
    };
  };

  /// Candidate: get own resume
  public query ({ caller }) func getMyResume() : async ?ResumeTypes.Resume {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ResumeLib.getResume(resumes, caller);
  };

  /// Transform callback required by HTTP outcalls infrastructure
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // -- Private helpers --

  func escapeJson(s : Text) : Text {
    // Wrap in quotes and escape inner quotes and backslashes
    let escaped = s.replace(#char '\\', "\\\\").replace(#char '\"', "\\\"").replace(#char '\n', "\\n").replace(#char '\r', "\\r").replace(#char '\t', "\\t");
    "\"" # escaped # "\"";
  };

  // Extract the message content from an OpenAI chat completion response.
  // Looks for "content":"<value>" inside the JSON.
  func extractOpenAiContent(json : Text) : Text {
    let needle = "\"content\":\"";
    if (not json.contains(#text needle)) return json;
    let parts = json.split(#text needle);
    var afterContent = "";
    var isFirst = true;
    for (p in parts) {
      if (isFirst) { isFirst := false } else if (afterContent == "") {
        afterContent := p;
      };
    };
    if (afterContent == "") return json;
    // Collect chars until unescaped closing quote using (done, escaped, acc) state
    let (_, _, result) = afterContent.foldLeft(
      (false, false, ""),
      func(state, c) {
        let (done, esc, acc) = state;
        if (done) state
        else if (esc) (false, false, acc # "\\" # Text.fromChar(c))
        else if (c == '\\') (false, true, acc)
        else if (c == '\"') (true, false, acc)
        else (false, false, acc # Text.fromChar(c));
      },
    );
    result;
  };
};
