# Devpost public copy — human editing required

> This is a structured draft, not submission-ready prose. The official host
> explicitly asks entrants not to submit an AI-written description as-is.
> Rewrite this in the submitter's own voice and replace every bracketed item.
>
> A complete review draft now lives in `docs/DEVPOST_FINAL_DRAFT.md`; retain
> this file only as the earlier worksheet.

## Project title

ClassTrek

## Tagline

A teacher-controlled AI co-host that lets the whole class shape where the
lesson goes next.

## Inspiration

[Write 3–5 sentences in your own voice about the classroom problem: prepared
interactive lessons collect answers, but a teacher cannot synthesize every
student's reasoning while continuing to teach.]

## What it does

Students join a live lesson, react, choose, and explain their thinking. The
teacher sees a moderated class pulse rather than a speed leaderboard. GPT-5.6
uses that de-identified pulse and a teacher-approved source pack to propose the
next explanation or question. Nothing is published until the teacher approves
it, and every connected student and classroom display then moves to the same
version.

The sample lesson asks whether humans could survive one night on Mars.

## How we built it

- Next.js App Router and TypeScript
- Server-authoritative in-memory session with monotonic versions
- Server-Sent Events plus snapshot polling fallback
- GPT-5.6 structured output for a grounded next-scene proposal
- OpenAI Moderation plus deterministic K–12 policy checks
- Teacher-only approval boundary for AI scenes and student sharing
- NASA source pack and server-side source ID validation
- Vitest and multi-context Chrome verification

## Challenges

[Describe the real build findings in your voice.]

Suggested evidence:

- persistent live event streams make `networkidle` an invalid browser wait;
- moderation outages must fail closed without ending the lesson;
- source grounding needs server validation rather than prompt instructions;
- teacher approval must reject stale scene versions;
- secret/API quota and repository hygiene must be treated as release blockers.

## Accomplishments

[Choose only claims you personally verified.]

- Three independent browser surfaces remained synchronized.
- An unsafe response was blocked before class display.
- A teacher-reviewed scene advanced the canonical session exactly once.
- All automated tests, lint, and production build passed.
- The UI supports a complete student and teacher golden path.

## What we learned

[Explain how the product shifted from a quiz/leaderboard into a
teacher-governed live branch, and what you learned about safety, grounding, and
real-time state.]

## What's next

- durable event storage and identity-backed individual teacher accounts;
- a shared event bus for horizontally scaled deployment;
- richer teacher editing before approval;
- additional source-locked lesson packs;
- classroom pilots measuring participation and time-to-intervention;
- an age-banded safety evaluation set reviewed by educators.

## Required links and identifiers

- Repository: <https://github.com/Hwoo34/class-trek>
- Deployed judge URL: <https://class-trek.vercel.app>
- Public YouTube demo under 3:00: **[MISSING]**
- `/feedback` Session ID: **[MISSING]**
