import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Common "../types/common";
import MatchTypes "../types/matching";
import JobTypes "../types/jobs";

module {
  public func getMatchesForCandidate(
    matches : Map.Map<Common.MatchId, MatchTypes.MatchResult>,
    candidateId : Common.UserId,
  ) : [MatchTypes.MatchResult] {
    matches.values().filter(func(m) { m.candidateId == candidateId }).toArray();
  };

  public func getMatchForJob(
    matches : Map.Map<Common.MatchId, MatchTypes.MatchResult>,
    candidateId : Common.UserId,
    jobId : Common.JobId,
  ) : ?MatchTypes.MatchResult {
    matches.values().find(func(m) {
      m.candidateId == candidateId and m.jobId == jobId
    });
  };

  public func storeMatchResult(
    matches : Map.Map<Common.MatchId, MatchTypes.MatchResult>,
    nextId : { var count : Nat },
    result : MatchTypes.MatchResult,
  ) : Common.MatchId {
    let id = nextId.count;
    nextId.count += 1;
    matches.add(id, { result with id });
    id;
  };

  // Build a prompt asking the AI to score the candidate against the job.
  public func buildMatchPrompt(
    resumeFilename : Text,
    job : JobTypes.Job,
  ) : Text {
    let skillsText = job.requirements.skills.foldLeft("", func(acc : Text, s : Text) : Text {
      if (acc == "") s else acc # ", " # s
    });
    let otherReqsText = job.requirements.otherRequirements.foldLeft("", func(acc : Text, r : Text) : Text {
      if (acc == "") r else acc # "; " # r
    });
    let expLevel = switch (job.requirements.experienceLevel) {
      case (#entry) "Entry";
      case (#mid) "Mid";
      case (#senior) "Senior";
      case (#lead) "Lead";
    };
    let eduLevel = switch (job.requirements.educationLevel) {
      case (#highSchool) "High School";
      case (#bachelors) "Bachelor's Degree";
      case (#masters) "Master's Degree";
      case (#phd) "PhD";
      case (#notRequired) "Not Required";
    };

    "You are a recruiting AI. Evaluate a candidate's resume against the following job requirements and return a JSON object.\n\n" #
    "Job Title: " # job.title # "\n" #
    "Job Description: " # job.description # "\n" #
    "Required Skills: " # skillsText # "\n" #
    "Experience Level: " # expLevel # "\n" #
    "Minimum Years of Experience: " # job.requirements.minYearsExperience.toText() # "\n" #
    "Education Level: " # eduLevel # "\n" #
    "Other Requirements: " # otherReqsText # "\n\n" #
    "Resume filename: " # resumeFilename # "\n\n" #
    "Return ONLY a JSON object (no markdown, no explanation) with this exact structure:\n" #
    "{\"overallScore\": <0-100>, \"breakdown\": [{\"requirement\": \"<name>\", \"score\": <0-100>, \"feedback\": \"<text>\"}]}\n\n" #
    "Include one breakdown entry for each: skills match, years of experience, education level, experience level" #
    (if (otherReqsText == "") "" else ", and each item in other requirements") # ".";
  };

  // Parse the AI JSON response into a MatchResult.
  // Uses simple text parsing since Motoko has no JSON library.
  public func parseAiResponse(
    rawJson : Text,
    candidateId : Common.UserId,
    jobId : Common.JobId,
    resumeId : Common.ResumeId,
    matchId : Common.MatchId,
  ) : MatchTypes.MatchResult {
    let overallScore = extractNatField(rawJson, "\"overallScore\"");
    let breakdown = parseBreakdown(rawJson);

    {
      id = matchId;
      candidateId;
      jobId;
      resumeId;
      overallScore;
      breakdown;
      matchedAt = Time.now();
    };
  };

  // -- Private helpers --

  // Extract the value of a numeric JSON field (fieldName: <number>).
  func extractNatField(json : Text, fieldName : Text) : Nat {
    let needle = fieldName # ":";
    if (not json.contains(#text needle)) return 0;
    let parts = json.split(#text needle);
    var afterField : Text = "";
    var isFirst = true;
    for (p in parts) {
      if (isFirst) { isFirst := false } else if (afterField == "") {
        afterField := p;
      };
    };
    if (afterField == "") return 0;
    // Trim leading whitespace then collect leading digit characters only.
    let trimmed = afterField.trimStart(#predicate(func(c : Char) : Bool {
      c == ' ' or c == '\n' or c == '\r' or c == '\t'
    }));
    // foldLeft to collect digits until we hit a non-digit, using a (done, acc) state tuple
    let (_, numText) = trimmed.foldLeft(
      (false, ""),
      func(state, c) {
        let (done, acc) = state;
        if (done) state
        else if (c >= '0' and c <= '9') (false, acc # Text.fromChar(c))
        else (true, acc);
      },
    );
    if (numText == "") return 0;
    switch (Nat.fromText(numText)) {
      case (?n) n;
      case null 0;
    };
  };

  // Extract the string value of a JSON field. Handles both
  // `"field":"value"` and `"field": "value"` (space after colon).
  func extractTextField(segment : Text, fieldName : Text) : Text {
    // Try with space after colon first (common in OpenAI responses), then without
    let needleSpace = fieldName # "\": \"";
    let needleNoSpace = fieldName # "\":\"";
    let needle = if (segment.contains(#text needleSpace)) needleSpace else needleNoSpace;
    if (not segment.contains(#text needle)) return "";
    let parts = segment.split(#text needle);
    var afterField : Text = "";
    var isFirst = true;
    for (p in parts) {
      if (isFirst) { isFirst := false } else if (afterField == "") {
        afterField := p;
      };
    };
    if (afterField == "") return "";
    // Collect chars until closing unescaped quote, using (done, escaped, acc) state
    let (_, _, result) = afterField.foldLeft(
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
    result;
  };

  // Parse the breakdown array from the JSON response.
  // Handles both `{"requirement"` and `{ "requirement"` (with space after brace).
  func parseBreakdown(json : Text) : [MatchTypes.RequirementScore] {
    let marker = if (json.contains(#text "{ \"requirement\"")) "{ \"requirement\"" else "{\"requirement\"";
    let items = json.split(#text marker);
    var results : [MatchTypes.RequirementScore] = [];
    var isFirst = true;
    for (item in items) {
      if (isFirst) { isFirst := false } else {
        let seg = marker # item;
        let req = extractTextField(seg, "\"requirement");
        let score = extractNatField(seg, "\"score\"");
        let feedback = extractTextField(seg, "\"feedback");
        if (req != "") {
          results := results.concat([{ requirement = req; score; feedback }]);
        };
      };
    };
    results;
  };
};
