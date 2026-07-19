# ClassTrek final submission audit

Audit date: 2026-07-19 KST

Official deadline: **July 21, 2026 at 5:00 PM PDT**, which is **July 22,
2026 at 9:00 AM KST**.

Official sources:

- Rules: <https://openai.devpost.com/rules>
- FAQ: <https://openai.devpost.com/details/faqs>
- Submission: <https://openai.devpost.com/>

## Current verdict

**Project: eligible and judge-testable. Submission: not yet complete because
the hackathon entry still lacks its submitter-owned identity and private
testing fields.**

The Devpost project profile is now published as
<https://devpost.com/software/classtrek> with project ID `1335631`, version 3,
the current Trek Exchange description, technology stack, live app, and
repository. The
OpenAI Build Week relationship still reports `submitted_at: null`, so the
published portfolio page is not yet a completed hackathon submission.

## Mandatory requirements

| Requirement | Current evidence | Status |
|---|---|---|
| One category | Education | Ready |
| Working project | <https://class-trek.vercel.app> | Ready |
| Consistent with video and description | Production teacher/student/display flow verified | Ready |
| Codex used meaningfully | README collaboration history, dated commits, tests, production fixes | Ready |
| GPT-5.6 used meaningfully | Production structured next-scene generation; actual `gpt-5.6` proposal re-verified after parser hardening | Ready |
| Project description | Devpost project version 3 matches `docs/DEVPOST_FINAL_DRAFT.md` | Ready; final submitter voice check recommended |
| Demo video | 1:56.60 story-driven V7 edit, corrected English TTS and captions, Trek Exchange, role-labeled multi-screen scenes, student-choice and live-class-pulse punch-ins, Codex and GPT-5.6 coverage | Public: <https://youtu.be/Tn5JbPUIx44> |
| YouTube visibility | Public; independently confirmed through YouTube's signed-out oEmbed endpoint | Ready |
| Repository | Public MIT repository at <https://github.com/Hwoo34/class-trek> | Ready |
| README | Setup, test path, sample class, architecture, safety, Codex, GPT-5.6, limitations, license | Ready |
| Judge test access | Free deployed demo; private teacher code must be placed only in Devpost field `27949` | Ready after field entry |
| `/feedback` Session ID | `019f743b-f708-7352-a6a8-4a1832dcf7e2` | Ready |
| Submitter identity | Submitter type and eligible country | Missing |
| Final state | Must say Submitted, not Draft or pre-draft | Missing |

## Testing interpretation

Judges may test the project but are not required to. Therefore:

1. the deployed demo must remain free and accessible through the judging
   period;
2. judge-only credentials must be supplied in the private testing field;
3. the README must make local setup and the golden path obvious; and
4. the video and description must independently prove the project works.

The repository does not need to be shared with the two judging email addresses
while it remains public. If it becomes private, share it with both
`testing@devpost.com` and `build-week-event@openai.com` before the deadline.

## Video compliance

Final local candidate:
`artifacts/ClassTrek-demo-v7-final.mp4`

- Runtime: 1:56.60, below the three-minute limit.
- Resolution: 1280x720, 30fps, H.264 video and AAC audio, standard BT.709
  limited-range `yuv420p`.
- English AI-assisted narration is permitted by the FAQ.
- Burned-in English captions and explicit teacher/student/class-display labels
  are included.
- An original animated ClassTrek intro quickly establishes the product name,
  tagline, and the three promises that the working demo then proves.
- The sequence demonstrates a reviewed, remixable Trek Exchange, Nova joining
  from a separate client, a vote and written reason reaching the live class
  pulse, dedicated punch-ins on the selected vote and updated aggregate,
  anonymous sharing, actual GPT-5.6 output, teacher approval,
  synchronized clients, reconnect behavior, safety, concrete Codex
  contributions, and human decisions.
- No API key, access code, explicit blocked text, private dashboard, or
  copyrighted music is shown; the quiet ambient bed was generated locally for
  this video.

Completed video publication checks:

1. uploaded to YouTube as **Public**;
2. YouTube reported no copyright issues;
3. public metadata resolved without an authenticated session; and
4. video title, 1:56.60 source duration, audio, and burned captions were
   verified before upload.

## Judge-criteria assessment

| Criterion | Evidence | Risk |
|---|---|---|
| Technological Implementation | Server-authoritative versions, SSE rotation and recovery, Runtime Cache checkpoint, moderation, rate limits, signed teacher session, source validation, SDK-parsed GPT-5.6 structured output, stale approval guard, functional Trek remix, 26 tests, real production debugging | Low |
| Design | Complete teacher, student, and shared-display paths; explicit loading, safety, fallback, approval, and reset behavior | Low |
| Potential Impact | Specific synchronous-classroom problem and measurable participation/safety signals; no unsupported efficacy claim | Medium: no real classroom study |
| Quality of the Idea | Teacher-governed live lesson branching differs from fixed slides, quiz leaderboards, and private one-to-one tutors | Low |

## Remaining user-owned blockers

- Choose `Individual`, `Team of Individuals`, or `Organization`.
- Confirm country of residence.
- Use primary build session ID `019f743b-f708-7352-a6a8-4a1832dcf7e2`.
- Review the public description in the submitter's own voice.
- Use public video URL <https://youtu.be/Tn5JbPUIx44>.
- Put the teacher code only in private Devpost testing instructions.
- Submit and confirm the final state is `Submitted`.

## Paste-ready Devpost fields

- `27947` Category: `Education`
- `27948` Repository:
  `https://github.com/Hwoo34/class-trek`
- `27949` Private judge instructions:

  ```text
  Open https://class-trek.vercel.app/teacher and unlock Mission Control
  with the private teacher access code entered below.

  Student surface: https://class-trek.vercel.app/join/MARS24
  Shared display: https://class-trek.vercel.app/display/MARS24

  Use Reset demo if needed. Join as a student, submit a choice and reason,
  review the live class pulse in the teacher surface, generate the next scene,
  and approve it. The student and shared display should advance to the same
  canonical scene. The access code is judge-only and must remain in this
  private field.
  ```

- `27950` Codex session:
  `019f743b-f708-7352-a6a8-4a1832dcf7e2`
