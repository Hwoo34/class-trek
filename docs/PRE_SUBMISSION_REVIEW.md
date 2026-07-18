# Pre-submission review

Review date: 2026-07-18 KST

Track: Education

Status: **NO-GO until blockers are cleared**

## Executive result

The product is beyond a static proof of concept: a real teacher, student, and
shared-display flow runs against one authoritative session; student input is
moderated; a class pulse is derived; an AI/fallback proposal waits for teacher
approval; and all surfaces receive the approved version.

The code, tests, safety contract, README, and submission checklist are ready for
finalization. External publication and live GPT-5.6 quota remain blockers.

## Judge-criteria review

| Criterion | Current evidence | Review |
|---|---|---:|
| Technological Implementation | Versioned authoritative state, SSE + polling recovery, three real browser contexts, safety pipeline, structured GPT-5.6 route, source validation, stale approval guard, fallback, tests | 8/10 |
| Design | Complete landing, teacher, student, and shared display experience; strong teacher controls; safe empty/error/reconnect states | 8/10 |
| Potential Impact | Specific teacher problem, whole-class participation, measurable response/pulse/moderation evidence; no unsupported efficacy claims | 7/10 |
| Quality of the Idea | Clear live-branch differentiation from fixed interactive slides and individual tutors | 8/10 |

Internal score: **31/40**. Submission target is at least 34/40 after deployment,
live-model proof, and video review.

## Verified

- [x] `pnpm test`: 2 files, 9 tests passed.
- [x] `pnpm lint`: passed.
- [x] `pnpm build`: passed.
- [x] Teacher page rendered with no framework overlay.
- [x] Student joined from an independent browser context.
- [x] Safe response reached teacher review.
- [x] Deliberately unsafe response was blocked and excluded.
- [x] Shared display received only approved content.
- [x] Teacher approval advanced the canonical version once.
- [x] Student and display converged on the same next scene.
- [x] `.env.local` is covered by `.gitignore`.
- [x] README includes setup, architecture, safety, Codex collaboration,
      GPT-5.6 role, human decisions, limitations, and license.

## Blocking issues

1. **OpenAI API project quota**
   - The new hackathon key is valid enough to reach the API, but live calls
     return HTTP 429 `insufficient_quota`.
   - OpenAI Moderation also returns HTTP 429.
   - Required action: enable quota/credits for the selected OpenAI project, then
     repeat the live smoke test and record a proposal labeled `gpt-5.6`, not
     `fallback`.

2. **Judge-accessible deployment**
   - No production URL has been published yet.
   - Required action: choose a long-lived Node deployment or adapt session state
     to a durable managed service before serverless deployment.

3. **Repository URL**
   - No remote repository URL is recorded.
   - Required action: publish under a human-approved name. If private, share
     with both judge addresses.

4. **Demo video**
   - No public YouTube URL exists.
   - Required action: record the 2:50 storyboard after live GPT-5.6 and
     deployment are verified.

5. **Devpost identity fields**
   - Submitter type, country of residence, and `/feedback` Session ID are
     user-owned and still missing.

## High-priority hardening before recording

- [ ] Add a signed or authenticated teacher authority boundary. The current
      hackathon UI expresses teacher controls, but the prototype API does not
      yet authenticate commands.
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
| Repository URL | Missing |
| Judge demo URL/instructions | Missing |
| `/feedback` Session ID | Missing |
| Public YouTube URL | Missing |

Do not call the Devpost submit action until all blockers are cleared and the
final human-owned copy has been reviewed.
