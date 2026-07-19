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
the hackathon entry still lacks its required video and submitter-owned fields.**

The Devpost project profile is now published as
<https://devpost.com/software/classtrek> with project ID `1335631`, version 2,
the ClassTrek description, technology stack, live app, and repository. The
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
| Project description | Final draft in `docs/DEVPOST_FINAL_DRAFT.md` | Human review required |
| Demo video | 1:56.57 story-driven edit, English TTS, burned-in English captions, multi-topic planning, live participation, Codex and GPT-5.6 coverage | Local file ready |
| YouTube visibility | Rules and FAQ say Public; use Public even though the reminder email says Unlisted is acceptable | Missing |
| Repository | Public MIT repository at <https://github.com/Hwoo34/class-trek> | Ready |
| README | Setup, test path, sample class, architecture, safety, Codex, GPT-5.6, limitations, license | Ready |
| Judge test access | Free deployed demo; private teacher code must be placed only in Devpost field `27949` | Ready after field entry |
| `/feedback` Session ID | Must come from the primary Codex build thread | Missing |
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
`artifacts/ClassTrek-demo-v4-story.mp4`

- Runtime: 1:56.57, below the three-minute limit.
- Resolution: 1280x720, 30fps, H.264 video and AAC audio, standard BT.709
  limited-range `yuv420p`.
- English AI-assisted narration is permitted by the FAQ.
- Burned-in English captions are included.
- An original animated ClassTrek intro quickly establishes the product name,
  tagline, and the three promises that the working demo then proves.
- The sequence demonstrates recommended and resumable journeys, Nova joining
  from a separate client, a vote and written reason reaching the live teacher
  pulse, anonymous sharing, actual GPT-5.6 output, teacher approval,
  synchronized clients, reconnect behavior, safety, concrete Codex
  contributions, and human decisions.
- No API key, access code, explicit blocked text, private dashboard, or
  copyrighted music is shown; the quiet ambient bed was generated locally for
  this video.

Before submitting:

1. upload to YouTube as **Public**;
2. open the video URL in a signed-out private window;
3. verify 720p playback, audio, captions, and full duration;
4. paste the URL into the Devpost project and submission; and
5. re-open the Devpost entry while signed out.

## Judge-criteria assessment

| Criterion | Evidence | Risk |
|---|---|---|
| Technological Implementation | Server-authoritative versions, SSE rotation and recovery, Runtime Cache checkpoint, moderation, rate limits, signed teacher session, source validation, SDK-parsed GPT-5.6 structured output, stale approval guard, 24 tests, real production debugging | Low |
| Design | Complete teacher, student, and shared-display paths; explicit loading, safety, fallback, approval, and reset behavior | Low |
| Potential Impact | Specific synchronous-classroom problem and measurable participation/safety signals; no unsupported efficacy claim | Medium: no real classroom study |
| Quality of the Idea | Teacher-governed live lesson branching differs from fixed slides, quiz leaderboards, and private one-to-one tutors | Low |

## Remaining user-owned blockers

- Choose `Individual`, `Team of Individuals`, or `Organization`.
- Confirm country of residence.
- Run `/feedback` in the primary build thread and copy the resulting ID.
- Review the public description in the submitter's own voice.
- Upload the final video to YouTube as Public and verify it signed out.
- Put the teacher code only in private Devpost testing instructions.
- Submit and confirm the final state is `Submitted`.
