# Pre-submission review

Review date: 2026-07-19 KST

Track: Education

Status: **GO FOR YOUTUBE UPLOAD — working production build and polished V7
showcase video are ready; external submission items remain**

## Executive result

The product is beyond a static proof of concept: a real teacher, student, and
shared-display flow runs against one authoritative session; student input is
moderated; a class pulse is derived; an AI/fallback proposal waits for teacher
approval; and all surfaces receive the approved version.

The code, tests, safety contract, README, public repository, protected deployed
demo, live production GPT-5.6 path, and captioned 1:56.60 story-driven video
are ready. The public YouTube URL and submitter-owned Devpost fields remain
blockers.

## Judge-criteria review

| Criterion | Current evidence | Review |
|---|---|---:|
| Technological Implementation | Versioned authoritative state, SSE rotation + polling recovery, Vercel shared checkpoint, protected teacher commands, rate limits, three real browser contexts, safety pipeline, production GPT-5.6 structured output, source validation, stale approval guard, fallback, tests | 9/10 |
| Design | Complete landing, teacher, student, and shared display experience; strong teacher controls; safe empty/error/reconnect states | 8/10 |
| Potential Impact | Specific teacher problem, whole-class participation, measurable response/pulse/moderation evidence; no unsupported efficacy claims | 7.5/10 |
| Quality of the Idea | Clear live-branch differentiation from fixed interactive slides and individual tutors | 8/10 |

Internal score: **34/40**. The final video now proves the live class loop,
teacher authority, student participation, `gpt-5.6` proposal, safety boundary,
and Trek Exchange impact case in one coherent story.

## Verified

- [x] `npm test`: 8 files, 26 tests passed.
- [x] `pnpm lint`: passed.
- [x] `pnpm build`: passed.
- [x] Production deployment: <https://class-trek.vercel.app>.
- [x] Public MIT repository: <https://github.com/Hwoo34/class-trek>.
- [x] Vercel Runtime Cache preserved a participant across independent requests.
- [x] Vercel runtime error review: no errors after the production E2E run.
- [x] Teacher page rendered with no framework overlay.
- [x] Student joined from an independent browser context.
- [x] Safe response reached teacher review.
- [x] Deliberately unsafe response was blocked and excluded.
- [x] Shared display received only approved content.
- [x] Teacher approval advanced the canonical version once.
- [x] Student and display converged on the same next scene.
- [x] A refreshed student rejoined at the current approved scene.
- [x] Hosted teacher commands require server-verified access.
- [x] Repeated authentication attempts return `429`; model generation is
      limited per client and per day.
- [x] A paid local smoke test produced a structured proposal labeled
      `gpt-5.6` with server-validated source IDs from the current Trek.
- [x] Production GPT-5.6 returned a structured, source-valid proposal in 23.1
      seconds and remained private until teacher approval.
- [x] Teacher, student, and display surfaces converged on the approved GPT-5.6
      scene at canonical version 24.
- [x] SSE rotated cleanly at 50.39 seconds before the Function limit; the final
      deployment produced no warning or error logs during verification.
- [x] `.env.local` is covered by `.gitignore`.
- [x] README includes setup, architecture, safety, Codex collaboration,
      GPT-5.6 role, human decisions, limitations, and license.

## Blocking issues

1. **Demo video**
   - No public YouTube URL exists.
   - A 1:56.60 English TTS story-driven video with burned-in English captions,
     an original animated intro, three synchronized browser contexts,
     student-choice and live-class-pulse punch-ins, and smooth transitions is ready
     at `artifacts/ClassTrek-demo-v7-final.mp4`, now with corrected English
     narration and captions, Trek Exchange, a clean ending transition, and
     explicit teacher/student/class-display borders and labels.
   - Required action: upload as Public, verify it while signed out, and add the
     URL to Devpost.

2. **Devpost identity and testing fields**
   - Submitter type and country of residence still require user confirmation.
   - Add the production teacher access code only to private field `27949`.
   - `/feedback` Session ID:
     `019f743b-f708-7352-a6a8-4a1832dcf7e2`.
   - Devpost project `1335631` is published as
     <https://devpost.com/software/classtrek>, but the OpenAI Build Week entry
     still reports `submitted_at: null`.

## Deferred post-hackathon hardening

- [x] Add an authenticated teacher authority boundary.
- [ ] Add action IDs/idempotency for duplicate student submissions.
- [ ] Add participant rate limiting.
- [ ] Add a reconnect test that reloads a student after scene publication.
- [ ] Add a 20-student load simulator or record two real students plus a
      documented simulated burst.
- [ ] Add a teacher-edit step for an AI proposal before approval.
- [ ] Confirm all public copy is rewritten in the submitter's own voice.

## User-only Devpost fields

| Field | Status |
|---|---|
| Submitter type | Missing |
| Country of residence | Missing |
| Education category | Ready |
| Repository URL | Ready: <https://github.com/Hwoo34/class-trek> |
| Judge demo URL/instructions | URL ready; add the teacher access code only to the private judge instructions |
| `/feedback` Session ID | Ready: `019f743b-f708-7352-a6a8-4a1832dcf7e2` |
| Public YouTube URL | Missing |

Do not call the Devpost submit action until all blockers are cleared and the
final human-owned copy has been reviewed.
