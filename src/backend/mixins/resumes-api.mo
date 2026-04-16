import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Debug "mo:core/Debug";
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
  openAiApiKey : { var value : Text },
) {
  /// Admin: set the OpenAI API key used for resume matching
  public shared ({ caller }) func setOpenAiApiKey(key : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    openAiApiKey.value := key;
  };

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

    // Guard: API key must be configured before attempting any AI calls.
    // Storing 0% when the key is missing would be misleading — skip entirely.
    if (openAiApiKey.value == "") {
      Debug.print("uploadResume: OpenAI API key is not set. Skipping matching for resume " # filename);
      return;
    };

    // Match against every open job
    let openJobs = jobs.values().filter(func(j : JobTypes.Job) : Bool { j.status == #open }).toArray();
    for (job in openJobs.values()) {
      let prompt = MatchingLib.buildMatchPrompt(filename, job);
      let requestBody = "{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"user\",\"content\":" # escapeJson(prompt) # "}],\"temperature\":0}";

      // Attempt AI call. On HTTP/network failure log and skip — do NOT store
      // a fake 0% score, as that misrepresents the matching state.
      let rawJson = try {
        await OutCall.httpPostRequest(
          "https://api.openai.com/v1/chat/completions",
          [{ name = "Authorization"; value = "Bearer " # openAiApiKey.value },
           { name = "Content-Type"; value = "application/json" }],
          requestBody,
          transform,
        );
      } catch (_) {
        Debug.print("uploadResume: AI HTTP call failed for job " # job.id.toText() # ". Check API key and network.");
        // Skip this job — do not store a fake 0% result
        "" // signal to skip below
      };

      // Empty rawJson means the HTTP call failed — skip storing a result
      if (rawJson == "") {
        // already logged above
      } else {
        // Extract the assistant message content from the OpenAI response envelope.
        // If extraction fails (e.g. OpenAI returned an error body), log and skip.
        let content = extractOpenAiContent(rawJson);
        if (content == "") {
          Debug.print("uploadResume: Could not extract AI content for job " # job.id.toText() # ". Raw response: " # rawJson);
          // Skip — do not store a fake 0% result
        } else {
          // Reserve a match ID before parsing so we can embed it in the record
          let matchId = nextMatchId.count;
          nextMatchId.count += 1;

          let result = MatchingLib.parseAiResponse(content, caller, job.id, resumeId, matchId);
          matches.add(matchId, result);
          Debug.print("uploadResume: Stored match " # matchId.toText() # " for job " # job.id.toText() # " score=" # result.overallScore.toText());
        };
      };
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
  // Handles both `"content":"value"` and `"content": "value"` (space after colon).
  // Returns "" if the response is an error envelope or content cannot be found,
  // so the caller can distinguish "no result" from "zero score".
  func extractOpenAiContent(json : Text) : Text {
    // First check for an OpenAI error response ({"error": ...})
    // so we can log accurately rather than passing the error JSON to the parser.
    if (json.contains(#text "\"error\"") and not json.contains(#text "\"choices\"")) {
      Debug.print("extractOpenAiContent: OpenAI returned an error response: " # json);
      return "";
    };

    // Try `"content": "` (space after colon) first — common in real OpenAI responses,
    // then fall back to `"content":"` (no space).
    let needleSpace = "\"content\": \"";
    let needleNoSpace = "\"content\":\"";
    let needle = if (json.contains(#text needleSpace)) needleSpace else needleNoSpace;

    if (not json.contains(#text needle)) return "";

    let parts = json.split(#text needle);
    var afterContent = "";
    var isFirst = true;
    for (p in parts) {
      if (isFirst) { isFirst := false } else if (afterContent == "") {
        afterContent := p;
      };
    };
    if (afterContent == "") return "";

    // Collect chars until unescaped closing quote, tracking backslash escapes.
    // State: (done, escaped, accumulated)
    let (_, _, result) = afterContent.foldLeft(
      (false, false, ""),
      func(state, c) {
        let (done, esc, acc) = state;
        if (done) state
        else if (esc) (false, false, acc # Text.fromChar(c))
        else if (c == '\\') (false, true, acc)
        else if (c == '\"') (true, false, acc)
        else (false, false, acc # Text.fromChar(c));
      },
    );

    // Unescape \\n sequences the AI may have embedded in its JSON string
    result.replace(#text "\\n", "\n").replace(#text "\\t", "\t");
  };
};
