# ClassTrek — Devpost final draft

## Tagline

A teacher-controlled AI co-host that lets the whole class safely shape where
the lesson goes next.

## Inspiration

Interactive lesson tools are good at collecting answers, but the lesson path
usually stays fixed. During a live class, a teacher cannot pause to read every
student's explanation, identify the room's shared misconception, check new
material against reliable sources, and still keep the class moving.

ClassTrek explores a different role for classroom AI: not an autonomous teacher
and not another speed leaderboard, but a source-grounded co-host that helps the
teacher read the room.

## What it does

ClassTrek runs one synchronized lesson across three real surfaces:

- students join from their own devices, react, choose, and explain;
- the teacher sees a moderated, de-identified class pulse; and
- the classroom display shows only approved, privacy-preserving information.

GPT-5.6 combines safe student reasoning, the aggregate pulse, and the
teacher-selected sources for the current journey into a structured proposal
for the next explanation and question. The server validates the source IDs,
and the proposal stays private until the teacher approves it. One approval
advances the canonical lesson version for every connected screen.

The demo journey desk includes Mars survival, coral reef resilience, and
rainforest water cycles. The content provider can change; the product loop
stays the same: students shape the path, evidence constrains the proposal, and
the teacher decides.

## How we built it

ClassTrek uses Next.js, TypeScript, the OpenAI Responses API, OpenAI Moderation,
Vercel Runtime Cache, Server-Sent Events, snapshot recovery, Zod, and Vitest.

The server owns the classroom state and increments a monotonic version after
every accepted action. SSE gives fast updates, while canonical snapshot checks
recover refreshed or disconnected clients. Student text crosses deterministic
K-12 rules and OpenAI Moderation before it can affect the class pulse.

GPT-5.6 returns a strict structured scene. The OpenAI SDK parses the output
against the Zod contract, application code validates every source ID, and stale
teacher approvals are rejected.

## How we used Codex

Codex was a continuous engineering collaborator, not a one-time generator. It
helped compare the official rules and product landscape, turn the idea into
explicit safety and realtime contracts, implement the three surfaces and
authoritative event flow, create tests, run independent browser sessions, and
review the production release.

The strongest contributions came from verification. Codex found a
production-only GPT timeout, serverless SSE streams that lived too long, and an
intermittent structured-output failure. Those findings led to bounded model
timeouts, graceful 50-second stream rotation, SDK-based structured parsing, a
supported fixed-length choice schema, and regression coverage.

I retained the key product and design decisions: synthesize the whole class
instead of ranking individuals, ground generated teaching moves in approved
evidence, and keep the teacher as the only publishing authority.

## Challenges

The hardest part was making safety and realtime behavior part of the product
rather than prompt wording. A moderation outage must fail closed without
ending the lesson. A generated proposal must remain private. A reconnecting
student must recover the current scene. A long-lived realtime stream must fit
inside a serverless runtime.

We also learned that schema-constrained output still needs production
observability. A valid application type is not automatically a supported API
schema, so we added a regression test for the exact JSON Schema shape sent to
OpenAI.

## Accomplishments

- A working teacher, student, and classroom-display loop in production.
- Actual GPT-5.6 structured generation from a live class pulse.
- Server-side source validation and an explicit teacher-review boundary.
- Unsafe student content blocked before analysis or public display.
- Signed HttpOnly teacher sessions and bounded authentication/model requests.
- Realtime recovery across refreshes and serverless stream rotation.
- 22 automated tests plus lint, production build, browser, and runtime-log
  verification.

## What we learned

Responsive teaching is not the same as generating more slides. The valuable
unit is a governed branch: the class contributes evidence, AI proposes a next
move, software enforces safety and grounding, and the teacher decides.

## What's next

The next step is a small educator pilot measuring participation,
time-to-intervention, and how often teachers approve, edit, or reject proposed
branches. A school release would add durable event storage, individual teacher
accounts, richer proposal editing, more source-locked lesson packs, and an
educator-reviewed age-banded safety evaluation set.

## Links

- Live demo: <https://class-trek.vercel.app>
- Repository: <https://github.com/Hwoo34/class-trek>
