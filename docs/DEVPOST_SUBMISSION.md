# OpenAI Build Week — Submission and Judging Checklist

> Internal pre-submission document. Do not submit this file as-is without checking every item against the final build and rewriting the public project description in the team's own voice.

## Current official status

- Hackathon: **OpenAI Build Week**
- Selected category: **Education**
- Current phase checked on 2026-07-18: **Submissions open**
- Submission deadline: **Tuesday, July 21, 2026 at 5:00 PM Pacific Time**
- Deadline in Korea: **Wednesday, July 22, 2026 at 9:00 AM KST**
- Judging under the Official Rules: **July 22, 2026 at 10:00 AM PT through August 5, 2026 at 5:00 PM PT**
- Winners announced: on or around August 12, 2026 at 2:00 PM PT
- Official rules: <https://openai.devpost.com/rules>
- Submission page/overview: <https://openai.devpost.com/>

The latest host announcement (2026-07-17) reiterates that the core functionality should already work, the primary Codex build thread's `/feedback` Session ID must be retrievable, the demo must be public on YouTube, and a private repository must be shared with both judging addresses. It also clarifies that GPT-5.6 does not need to be used for the entire project, but it must be used for a meaningful part that we can identify.

The live key-dates API currently reports a later judging end (`2026-08-10T00:00:00Z`) than Section 1 of the Official Rules. This checklist uses the Official Rules because they explicitly prevail when sources conflict; plan to keep judge access available beyond both dates unless Devpost publishes a correction.

## User-only missing items

These items require the submitter's identity, account access, or an external publication decision. They cannot be invented or completed by an agent.

| Item | Required value | Status |
|---|---|---|
| **Code repository URL** | Public repository with a relevant license, or private repository shared with both judging addresses | **MISSING — USER ONLY** |
| **Public YouTube URL** | Publicly visible video, strictly under 3:00, with audio | **MISSING — USER ONLY** |
| **`/feedback` Codex Session ID** | Session ID from the project thread where the majority of core functionality was built | **MISSING — USER ONLY** |
| **Country of residence** | Must be selected in the Devpost form and satisfy the Official Rules | **MISSING — USER ONLY** |
| **Submitter type** | Exactly one of `Individual`, `Team of Individuals`, or `Organization` | **MISSING — USER ONLY** |

Do not mark the submission ready until all five values are filled in and independently verified.

## Exact required submission fields and deliverables

### Required custom form fields

The Devpost Hackathons app returned the following live form fields on 2026-07-18:

| Field ID | Exact label | Required answer |
|---|---|---|
| `27945` | `Submitter Type` | One of `Individual`, `Team of Individuals`, `Organization` |
| `27946` | `Please indicate your Country of Residence.` | An eligible country under the Official Rules |
| `27947` | `Which category are you submitting to?` | **Education** |
| `27948` | `URL to your public or private code repo. REQUIRED: README & highlight how Codex & GPT-5.6 were used.` | Repository URL |
| `27950` | `/feedback Session ID where the majority of your project was worked on` | Primary Codex build-thread Session ID |

### Optional or conditional custom form fields

| Field ID | Exact label | When to complete |
|---|---|---|
| `27949` | `If applicable, link to your project for judges to check and test & any necessary instructions` | Strongly recommended: deployed app URL, test path, and any judge-only credentials. This field is visible only to Devpost managers and judges. |
| `27951` | `If your project is a plugin or dev tool, provide installation instructions, supported platforms, instructions for testing, etc;` | Not applicable if submitted solely as an Education web app. Required if the final submission is positioned as a plugin or developer tool. |

### Required project materials

- [ ] A **working project** built with Codex using GPT-5.6.
- [ ] Exactly one category selected: **Education**.
- [ ] A project description explaining the features and functionality.
- [ ] A **public YouTube demo video shorter than three minutes**.
- [ ] Demo audio clearly covers:
  - [ ] what was built;
  - [ ] how Codex was used; and
  - [ ] how GPT-5.6 was used.
- [ ] The video shows the project actually working.
- [ ] The video contains no unlicensed music, copyrighted material, or third-party trademarks without permission.
- [ ] A code repository URL suitable for judging and testing.
- [ ] A README with setup instructions, sample data where needed, and clear run/test guidance.
- [ ] The README explains:
  - [ ] where Codex accelerated the workflow;
  - [ ] where the human team made key product, engineering, and design decisions;
  - [ ] how GPT-5.6 contributed; and
  - [ ] how Codex contributed to the final result.
- [ ] The primary `/feedback` Codex Session ID.
- [ ] A website, functioning demo, or test build available **free of charge and without restriction through the end of judging**.
- [ ] All submitted materials are in English, or include an English translation.
- [ ] If this was a pre-existing project, documentation clearly separates work before July 13 from new work, supported by dated commits, Codex session evidence, or equivalent. Preferably confirm this is a new project created during the submission period.
- [ ] Every third-party SDK, API, dataset, image, video, font, and other asset is used under valid terms or a compatible license.
- [ ] The submission is original, owned by the entrant/team, and does not violate intellectual-property, privacy, or publicity rights.
- [ ] The final Devpost entry is **Submitted**, not merely saved as a draft.
- [ ] If submitting as a team, every team member is added and has accepted before the deadline.

Website and ZIP upload are not globally required by the live Devpost form, but a working test path is required by the Official Rules and is strategically essential.

## Stage 1 — mandatory pass/fail gate

Official Stage 1 asks whether the project reaches a baseline of viability by reasonably fitting the hackathon theme and reasonably applying the required APIs/SDKs.

| Pass condition | Evidence that must be visible to judges | Pre-submit test |
|---|---|---|
| Fits **Education** | The product helps a real teacher lead a live, participatory lesson and helps students engage with evidence-based material. | A first-time reviewer can identify the teacher, student, and educational outcome within 20 seconds. |
| Uses **Codex** genuinely | Commit history and README describe repeated Codex collaboration across architecture, real-time implementation, safety, testing, and review—not a one-off prompt. | README statements match actual commits, tests, and the supplied `/feedback` thread. |
| Uses **GPT-5.6** meaningfully | GPT-5.6 creates a grounded lesson plan or synthesizes class responses into teacher-reviewable next-scene options with structured output. | The demo visibly shows a GPT-5.6-dependent step and the repository identifies the call path/model configuration. |
| Working and viable | Teacher and multiple student clients share one authoritative live session, inputs are moderated, and only a teacher-approved branch is published. | Run the complete golden path twice from a clean install or deployed instance. |
| Matches the video and description | Every visible claim in the video and Devpost write-up works in the judge-accessible build. | Maintain a claim-to-test checklist; remove or qualify any unsupported claim. |

**Automatic no-go:** do not submit a simulated-only experience presented as live, static mockups presented as a working product, or GPT-5.6/Codex claims that cannot be traced to the code and project history.

## Stage 2 — evidence plan for four equally weighted criteria

The four criteria are equally weighted. In a tie, the criteria are compared in the listed order, beginning with Technological Implementation.

### 1. Technological Implementation — 25%

Official question: How thoroughly and skillfully does the project use Codex? Does the code reflect genuine effort and a working, non-trivial implementation?

Evidence to build, test, and show:

- A server-authoritative session state machine: draft/review/ready/live/collecting/synthesizing/teacher approval/published/completed.
- Real teacher and student clients connected to the same session; no client may directly advance the canonical lesson state.
- At least two real student browser sessions plus a multi-student simulator in tests or the demo.
- Ordered, idempotent real-time events with reconnect/snapshot recovery and stale AI-result rejection.
- Moderation on student input and generated output; unsafe content never appears on the shared classroom display.
- Source-locked generation: every generated factual scene references an approved source, and unsupported output fails closed.
- GPT-5.6 structured output for class-pulse synthesis and next-scene proposals.
- A teacher approval boundary: AI proposes; the teacher edits, approves, rejects, pauses, or falls back.
- Persistent session/event data sufficient to recover or inspect the lesson.
- Automated tests for concurrency, authorization, moderation, grounding, teacher approval, reconnect, and AI failure fallback.
- README evidence of Codex collaboration tied to concrete artifacts: architectural decisions, implementation areas, tests, review findings, and fixes.

Judge-facing proof:

1. Multiple students respond concurrently.
2. The class pulse updates once from authoritative server state.
3. One unsafe response is blocked before broadcast.
4. GPT-5.6 proposes a grounded branch from the aggregate response.
5. Nothing reaches students until the teacher approves.
6. All clients switch scenes together.
7. A disconnected student rejoins at the correct scene.

### 2. Design — 25%

Official question: Does the project deliver a working or runnable project that has a complete, coherent product experience—not just a technical proof of concept?

Evidence to build, test, and show:

- A complete teacher journey: define objective/source → review generated lesson → start session → monitor class pulse → approve/edit a branch → close lesson → review summary.
- A complete student journey: join with code → understand privacy/participation rules → react or answer → see safe aggregate class state → follow the approved branch → reflect at the end.
- A coherent shared-display experience for the classroom.
- Clear loading, empty, blocked, disconnected, paused, and AI-unavailable states.
- Accessible interaction: keyboard navigation, visible focus, sufficient contrast, readable type, and non-color-only status cues.
- Privacy-preserving defaults: anonymous display identities, no public individual ranking, no unapproved free-text broadcast.
- One polished golden lesson rather than many shallow subjects.

Judge-facing proof:

- A first-time judge can start the sample lesson without setup ambiguity.
- Teacher controls remain visible and understandable during every live state.
- Student feedback explains what happened after blocked, late, or duplicate input.
- The session ends with a coherent learning/participation summary instead of an abrupt technical endpoint.

### 3. Potential Impact — 25%

Official question: Does the project make a credible, specific case for solving a real problem for a real audience—and does the demonstrated solution actually address it?

Specific audience and problem:

- Audience: teachers leading synchronous middle-school or high-school lessons, and their students.
- Problem: conventional interactive slides collect answers but follow a predetermined path; teachers cannot quickly synthesize an entire class's confusion, questions, and shifts in confidence while continuing to teach.
- Intervention: aggregate the class pulse, propose a safe and source-grounded next teaching move, and keep the teacher in control.

Evidence to collect:

- Time from the last student response to a teacher-reviewable class synthesis.
- Participation count and percentage.
- Distribution of `understand / unsure / confused` before and after the approved branch.
- Number of distinct perspectives/questions surfaced.
- Percentage of generated branches with valid approved-source references.
- Unsafe or private student responses prevented from public display.
- Teacher control metrics: proposals approved as-is, edited, rejected, or replaced by fallback.

Make only evidence-supported claims. For the hackathon build, describe measured demo or test results as such; do not imply classroom efficacy or learning gains without a real study.

### 4. Quality of the Idea — 25%

Official question: How creative and novel is the concept, and how does it differ from existing concepts?

Core differentiation:

> Existing interactive lesson tools make prepared slides interactive. This project makes the lesson itself responsive to the class, while keeping factual sources and publishing authority under teacher control.

Novelty must be demonstrated through the combined loop:

1. Students share live reactions, confidence, questions, and reasoning.
2. The system synthesizes the **class as a whole**, not isolated chatbot conversations.
3. GPT-5.6 proposes a new grounded teaching scene in response to that class state.
4. Safety and grade-fit checks run before publication.
5. The teacher decides whether and how the lesson branches.
6. The entire classroom receives the approved branch synchronously.

Avoid positioning the project as an AI slide generator, quiz generator, leaderboard, generic tutor, or unrestricted AI teacher. Those descriptions erase the differentiating product mechanism.

## Under-three-minute demo storyboard

**Target final runtime: 2:45–2:50. Hard stop before 3:00.** Record a clean run; remove typing, loading, setup, and silence. The voiceover may be human or AI-assisted, but must clearly explain what was built and how both Codex and GPT-5.6 were used.

| Time | Screen/action | Narration purpose | Criteria evidence |
|---|---|---|---|
| 0:00–0:12 | Title plus teacher problem; immediately show the running product | “Prepared interactive slides cannot adapt to what the whole class is thinking in the moment.” Identify real audience and problem. | Impact, Idea |
| 0:12–0:28 | Teacher opens a prebuilt “Can humans live on Mars?” lesson; approved sources and learning objective are visible | Explain source-locked, grade-appropriate lesson preparation and teacher review. | Design, Technology |
| 0:28–0:42 | Students join by code in two visible browser windows; class count updates live | Establish actual multi-user participation, not a mockup. | Technology, Design |
| 0:42–1:02 | Teacher publishes a prompt; students answer and set confidence concurrently; shared pulse updates | Show synchronized state and privacy-preserving aggregate responses. | Technology, Impact |
| 1:02–1:16 | One deliberately unsafe/off-topic response is blocked and appears only in the teacher safety queue | Demonstrate educational guardrails without displaying explicit harmful text in the video. | Technology, Design |
| 1:16–1:38 | Class pulse identifies a misconception; GPT-5.6 produces two source-cited next-scene options | State that GPT-5.6 synthesizes aggregate responses into structured, grounded options. | Technology, Idea |
| 1:38–1:55 | Teacher edits one option and approves it; all student screens switch together | Show that AI cannot publish autonomously and the teacher controls the lesson. | Design, Technology |
| 1:55–2:12 | A student disconnects/rejoins or refreshes and recovers the correct current scene | Prove robust real-time implementation beyond the happy-path animation. | Technology |
| 2:12–2:28 | Students answer the follow-up; confidence distribution changes; teacher closes the lesson | Demonstrate the full loop and an observable, modest outcome. | Impact, Design |
| 2:28–2:42 | End-of-lesson report: participation, perspectives, source coverage, moderation, and confidence movement | Make impact measurable without claiming unproven learning efficacy. | Impact |
| 2:42–2:50 | Brief architecture/repository montage and Codex contribution card | Name concrete Codex contributions and the human decisions retained by the team. Mention the repository and runnable judge path. | Technology, Idea |

Video final checks:

- [ ] Exported duration is `00:02:59` or shorter; target `00:02:50`.
- [ ] YouTube visibility is **Public**, not Private or Unlisted.
- [ ] Audio explicitly says “Codex” and “GPT-5.6” and explains distinct contributions.
- [ ] On-screen text remains readable at normal YouTube playback size.
- [ ] No real student data, API keys, `.env` files, private URLs, credentials, moderation prompts, or internal dashboards are visible.
- [ ] No unsupported product claim is narrated.
- [ ] The submitted build reproduces the video.

## README checklist

The public README should be in English and let a judge understand and run the project quickly.

- [ ] Product name and one-sentence description written/approved by the human submitter.
- [ ] The teacher/student problem and why it matters.
- [ ] Selected track: Education.
- [ ] What makes the approach different from fixed interactive slides, quiz games, and one-to-one AI tutors.
- [ ] A short feature list that matches the working build.
- [ ] Architecture diagram and responsibilities of teacher client, student client, authoritative session server, event store, safety pipeline, and GPT-5.6.
- [ ] Teacher-control and safety model, including which actions always require approval.
- [ ] Grounding/source policy and limitations.
- [ ] Exact prerequisites and supported runtime/platform versions.
- [ ] Copy-pasteable clean-install and run commands.
- [ ] Environment-variable table containing variable **names and descriptions only**, never values.
- [ ] Seed/sample lesson and judge-ready demo instructions.
- [ ] Test commands and what the important tests prove.
- [ ] Deployed demo URL and judge instructions if available.
- [ ] Codex collaboration narrative:
  - [ ] where Codex accelerated research, scaffolding, implementation, testing, or review;
  - [ ] concrete files/features produced or improved with Codex;
  - [ ] meaningful failures or review findings and how they were corrected;
  - [ ] how collaboration continued throughout the build.
- [ ] Human decisions:
  - [ ] responsive whole-class lesson rather than a generic quiz/tutor;
  - [ ] teacher is the publishing authority;
  - [ ] aggregate participation rather than public individual ranking;
  - [ ] safety and grounding fail closed;
  - [ ] scope limited to a polished golden lesson for reliable judging.
- [ ] GPT-5.6 contribution:
  - [ ] exact runtime task(s);
  - [ ] structured-output contract;
  - [ ] grounding and moderation boundaries;
  - [ ] why GPT-5.6 is useful for this non-trivial step.
- [ ] Known limitations and an honest future-work section.
- [ ] Relevant repository license if public.
- [ ] Third-party asset/data acknowledgments and licenses.
- [ ] Evidence that the project was created or meaningfully extended during the submission period.

Do not paste a generic AI-written project description into Devpost. Draft with assistance if useful, then have the human submitter rewrite and verify it in their own voice.

## Repository privacy and API-key hygiene

### OpenAI key

- [ ] Use a dedicated, project-scoped API key for this hackathon.
- [ ] Store it only in a local ignored file or the deployment platform's encrypted environment-variable store.
- [ ] Use a variable such as `OPENAI_API_KEY`; never hard-code the key.
- [ ] Ensure `.env`, `.env.local`, `.env.*.local`, credential files, and deployment dumps are covered by `.gitignore`.
- [ ] Commit only an `.env.example` containing placeholders such as `OPENAI_API_KEY=`.
- [ ] Keep all OpenAI API calls server-side. Never expose the key through browser bundles, client-side environment prefixes, WebSocket payloads, source maps, logs, screenshots, videos, test fixtures, error messages, or Devpost text fields.
- [ ] Limit project access and spending/rate limits where the OpenAI project settings support it.
- [ ] Run a secret scan over the full Git history—not only the working tree—before making the repository public or sharing it.
- [ ] If a key is ever committed, printed publicly, or captured in an artifact, revoke/rotate it immediately; deleting the current file is insufficient because Git history retains it.
- [ ] Judges should use a deployed demo or supply their own key through documented local setup. Never give judges the production secret.

Multiple OpenAI API keys can exist, and a dedicated hackathon key is the preferred isolation boundary. That does **not** make a key safe to commit.

### Public repository path

- [ ] Add a relevant open-source license.
- [ ] Verify every dependency and asset is redistributable.
- [ ] Remove personal data, internal URLs, credentials, private source documents, and generated logs.
- [ ] Test cloning and running the repository from a clean directory.

### Private repository path

- [ ] Share repository access with **testing@devpost.com**.
- [ ] Share repository access with **build-week-event@openai.com**.
- [ ] Confirm both invitations/access grants are active before the deadline.
- [ ] Keep access available through the judging period.
- [ ] Provide judge-only test instructions in Devpost field `27949`; do not put secrets in public README text.

### Student privacy and educational safety

- [ ] Demo and seed data are synthetic.
- [ ] No real minor's name, account, image, voice, school, free-text response, or identifier is stored or shown.
- [ ] Student display names are ephemeral or anonymized.
- [ ] Unsafe text is not echoed back to the shared display or logs accessible to students.
- [ ] Public analytics are aggregate; private teacher views follow least-privilege access.
- [ ] The project does not claim legal compliance certifications that were not assessed.

## Pre-submission review rubric

Score each item `0`, `1`, or `2`.

- `0` = missing, broken, or unsupported
- `1` = partially working, fragile, unclear, or weakly evidenced
- `2` = working, reproducible, clearly demonstrated, and documented

| Area | Review question | Score |
|---|---|---:|
| Stage 1 | Is Education fit obvious and credible? | /2 |
| Stage 1 | Is meaningful Codex use traceable in README, history, and `/feedback` evidence? | /2 |
| Stage 1 | Is meaningful GPT-5.6 runtime use visible and traceable? | /2 |
| Stage 1 | Does the judge build behave exactly as the video and description claim? | /2 |
| Technology | Do real teacher and multiple student clients share authoritative state? | /2 |
| Technology | Are concurrent events ordered/idempotent and reconnects recoverable? | /2 |
| Technology | Do moderation, grade fit, source grounding, and teacher approval fail safely? | /2 |
| Technology | Are AI errors, timeouts, stale outputs, and fallback paths handled? | /2 |
| Technology | Do automated tests prove the non-trivial behavior? | /2 |
| Design | Is the teacher journey complete from preparation through report? | /2 |
| Design | Is the student journey complete, legible, safe, and engaging? | /2 |
| Design | Are loading, empty, blocked, disconnected, and paused states polished? | /2 |
| Impact | Is a real audience/problem named without inflated claims? | /2 |
| Impact | Are participation, latency, grounding, safety, and class-change measures shown? | /2 |
| Idea | Is live whole-class adaptive branching visibly different from fixed slides and tutors? | /2 |
| Idea | Does teacher-controlled, source-locked responsiveness feel essential rather than decorative? | /2 |
| Submission | Is the video public, under three minutes, audible, and complete? | /2 |
| Submission | Is the repository clean, licensed/shared, reproducible, and secret-free? | /2 |
| Submission | Are all required Devpost fields and English materials complete? | /2 |
| Submission | Is the entry actually submitted, with all team invitations accepted? | /2 |

**Maximum: 40**

Decision thresholds:

- **36–40, with no Stage 1 score below 2:** submission-ready after one final smoke test.
- **32–35:** fix all `0` scores and any Technology weakness before polishing copy.
- **Below 32:** not submission-ready; prioritize a reliable end-to-end golden path over additional features.
- **Any Stage 1 item below 2:** automatic no-go regardless of total.
- **Any exposed secret or real student data:** automatic no-go until removed, history scanned, and affected credentials rotated.

## Final 30-minute go/no-go

1. Open the deployed app in a clean/private browser session.
2. Run the teacher + two students golden path end to end.
3. Trigger one blocked input and one AI fallback.
4. Refresh a student and confirm state recovery.
5. Confirm every displayed factual claim has an approved source.
6. Clone the final repository and follow README instructions exactly.
7. Run tests and production build from the final commit.
8. Secret-scan the working tree, artifacts, and Git history.
9. Play the final public YouTube URL from beginning to end and verify duration/audio.
10. Verify all five user-only values at the top of this document.
11. For a private repository, verify access for both judging email addresses.
12. Confirm the Devpost entry shows **Submitted**, not Draft.

## Sources checked

- OpenAI Build Week Official Rules: <https://openai.devpost.com/rules>
- OpenAI Build Week overview/submission page: <https://openai.devpost.com/>
- Devpost Hackathons app: live overview, rules, key dates, judging criteria, submission requirements, and host announcements fetched on 2026-07-18.

If the app, an announcement, and the Official Rules conflict, follow the Official Rules and current Hackathon Website. The Official Rules explicitly state that the Devpost plugin is a helper, not the source of truth.
