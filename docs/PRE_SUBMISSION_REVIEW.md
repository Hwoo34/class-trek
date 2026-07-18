# Pre-submission review

Review date: 2026-07-18 KST

Track: Education

Status: **CONDITIONAL GO — working production build, external submission items
remain**

## Executive result

The product is beyond a static proof of concept: a real teacher, student, and
shared-display flow runs against one authoritative session; student input is
moderated; a class pulse is derived; an AI/fallback proposal waits for teacher
approval; and all surfaces receive the approved version.

The code, tests, safety contract, README, public repository, and deployed demo
are ready for finalization. Production GPT-5.6 secret configuration, the public
video, and submitter-owned Devpost fields remain blockers.

## Judge-criteria review

| Criterion | Current evidence | Review |
|---|---|---:|
| Technological Implementation | Versioned authoritative state, SSE + polling recovery, Vercel shared checkpoint, three real browser contexts, safety pipeline, structured GPT-5.6 route, source validation, stale approval guard, fallback, tests | 8.5/10 |
| Design | Complete landing, teacher, student, and shared display experience; strong teacher controls; safe empty/error/reconnect states | 8/10 |
| Potential Impact | Specific teacher problem, whole-class participation, measurable response/pulse/moderation evidence; no unsupported efficacy claims | 7.5/10 |
| Quality of the Idea | Clear live-branch differentiation from fixed interactive slides and individual tutors | 8/10 |

Internal score: **32/40**. The remaining upside is primarily judge-facing:
capture the verified production flow cleanly, show a live `gpt-5.6` proposal,
and make the impact case concrete in the final video and description.

## Verified

- [x] `pnpm test`: 4 files, 14 tests passed.
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
      `gpt-5.6` with approved NASA source IDs.
- [x] `.env.local` is covered by `.gitignore`.
- [x] README includes setup, architecture, safety, Codex collaboration,
      GPT-5.6 role, human decisions, limitations, and license.

## Blocking issues

1. **Production OpenAI secret**
   - The OpenAI project quota and live `gpt-5.6` smoke test now work.
   - The production Vercel project is configured for GPT-5.6, but
     `OPENAI_API_KEY` has not been sent to the third-party host.
   - Required action: explicitly approve that destination or add the key
     directly in Vercel, then redeploy and verify one production proposal
     labeled `gpt-5.6`.

2. **Demo video**
   - No public YouTube URL exists.
   - A 2:36 storyboard, narration text, and a 1:59 local TTS draft are ready.
   - Required action: record the production flow, edit/export under 3:00,
     upload as Public, and review the final render.

3. **Devpost identity fields**
   - Submitter type, country of residence, and `/feedback` Session ID are
     user-owned and still missing.

## High-priority hardening before recording

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
| `/feedback` Session ID | Missing |
| Public YouTube URL | Missing |

Do not call the Devpost submit action until all blockers are cleared and the
final human-owned copy has been reviewed.
