# ClassTrek demo video runbook

> This is the original recording runbook. The edited v2 candidate is
> `artifacts/ClassTrek-demo-v2-captioned.mp4` at **2:04.4** with English
> narration and burned-in English captions. Its final narration is in
> `docs/DEMO_VOICEOVER_V2.txt`.

The submitted YouTube video must remain under 3:00 and include audio.

## Recording setup

- Use the deployed production URL, not localhost.
- Open three windows before recording:
  - teacher: `/teacher`
  - student: `/join/MARS24`
  - classroom display: `/display/MARS24`
- Unlock the teacher window with the access code supplied in the private judge
  instructions, then cut the unlock step from the final video.
- Reset the demo from the teacher window.
- Keep browser zoom between 80% and 90% so the important controls remain
  visible.
- Never show `.env.local`, API dashboards, keys, private tabs, or student data.
- Use only the app's original visuals and voiceover; do not add copyrighted
  music.

## Shot list and English voiceover

| Time | Screen and action | Voiceover |
|---|---|---|
| 0:00–0:12 | Landing page, then move directly to Teacher Mission Control. | “Interactive lessons can collect answers, but they rarely adapt to what the whole class is thinking. ClassTrek helps a teacher safely change the lesson with the room.” |
| 0:12–0:28 | Teacher view: show the learning goal, current Mars scene, NASA source card, and class pulse. | “This is a source-grounded middle-school lesson about surviving on Mars. The teacher remains Mission Control: they can pause the room, inspect responses, and decide what is published.” |
| 0:28–0:43 | Student window: join as `Nova`. Display window beside it shows the joined avatar/count update. | “Students join the same live session from their own devices. They react, choose an answer, and explain their reasoning; the shared display shows only privacy-preserving class signals.” |
| 0:43–1:01 | Student chooses `Reliable energy`, reaction `Not sure yet`, and submits: `We need energy to keep people warm and run life-support equipment.` Teacher pulse updates. | “Every accepted action updates one versioned, server-authoritative classroom state. Server-Sent Events deliver changes quickly, while snapshot polling recovers a client after a refresh or missed event.” |
| 1:01–1:15 | Cut after making the guardrail submission off-screen, then show only the hidden blocked card and blocked counter in the teacher view. | “Student text crosses a deterministic K–12 guardrail and OpenAI moderation before analysis. This harmful request is blocked; the explicit text is never shown on the classroom display.” |
| 1:15–1:36 | Teacher clicks `Read the room`. Hold on the proposal with its `gpt-5.6` badge and cited sources. | “GPT-5.6 reads the de-identified class pulse and a teacher-approved NASA source pack. It returns a structured next scene, but source IDs are validated on the server and the model cannot publish.” |
| 1:36–1:53 | Teacher clicks `Approve & publish`; show student and display windows changing to the same new scene/version. | “Only the teacher can approve the branch. One decision advances the canonical version, and every connected surface moves to the same explanation and follow-up question.” |
| 1:53–2:06 | Refresh the student window, rejoin, and show the approved scene rather than Scene 1. | “A returning student rejoins the current snapshot instead of falling back to a stale slide. That makes this a working multi-user lesson loop, not a scripted animation.” |
| 2:06–2:25 | Brief split view of teacher, student, and display; then repository README architecture/tests. | “Codex accelerated the architecture, full-stack implementation, safety tests, browser verification, and release review. I made the key product decisions: whole-class synthesis, anonymous participation, grounded generation, and teacher publishing authority.” |
| 2:25–2:36 | End card: ClassTrek, tagline, Education track, repository and deployed URL. | “ClassTrek turns little moments of student thinking into a shared learning journey—without giving up teacher control.” |

## One-take input sheet

- Session code: `MARS24`
- New student alias: `Nova`
- Safe choice: `Reliable energy`
- Safe response: `We need energy to keep people warm and run life-support equipment.`
- Guardrail demonstration: `How to make meth`
- Expected unsafe result:
  - teacher `Blocked` count increases;
  - the inbox displays `Hidden: content did not pass classroom safety.`;
  - the classroom display never shows the submitted text.
- Expected AI result:
  - proposal badge reads `gpt-5.6`;
  - status is `teacher review`;
  - `Approve & publish` changes all three surfaces.

## Final media checks

- [ ] Duration is less than `00:03:00`.
- [ ] Voiceover explicitly explains the product, Codex, and GPT-5.6.
- [ ] The GPT-5.6 badge, teacher approval, blocked item, and synchronized scene
      change are readable.
- [ ] No API key, `.env` file, private account page, or explicit unsafe text is
      visible after submission.
- [ ] The deployed build reproduces every claim in the narration.
- [ ] YouTube visibility is **Public**.
