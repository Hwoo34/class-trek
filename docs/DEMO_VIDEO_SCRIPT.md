# ClassTrek demo video runbook

> The final product-showcase candidate is
> `artifacts/ClassTrek-demo-v7-final.mp4` at **1:56.60** with English
> narration, burned-in English captions, an animated original intro, and
> smooth transitions between real product recordings. Multi-screen scenes use
> color-coded borders and explicit teacher, student, and classroom-display
> labels. Its final narration is in `docs/DEMO_VOICEOVER_V7.txt`, with the
> matching subtitle source in `docs/DEMO_CAPTIONS_V7.srt`.

The submitted YouTube video must remain under 3:00 and include audio. The V7
candidate is structured as one classroom story rather than a feature tour:
the teacher discovers a reviewed student-made Trek, remixes it while keeping
sources attached, receives Nova's live vote and reasoning, shares it
anonymously, asks GPT-5.6 to read the room, and approves the branch that
advances every connected screen.

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

## V7 story beats

| Time | Screen and action | Judge-facing purpose |
|---|---|---|
| 0:00–0:13 | Animated ClassTrek promise and product keywords. | Identify the product and differentiation immediately. |
| 0:10–0:26 | Teacher opens Trek Exchange, filters to a reviewed student-made Trek, remixes its title and learning goal, and launches it with sources attached. | Prove the expandable platform idea with a working teacher-controlled remix, not a roadmap slide. |
| 0:26–0:46 | Nova joins on a separately labeled student client, reacts, votes `Liquid water`, and explains the energy connection. A 1.98-second punch-in makes the selected reaction and vote unmistakable. | Prove real participation across separate browser contexts. |
| 0:46–1:00 | The response arrives in the bordered teacher view; a labeled classroom-display inset proves what is public. A 1.78-second punch-in shows the live totals before the teacher shares the safe idea anonymously. | Show causal realtime updates and privacy-preserving classroom sharing. |
| 1:00–1:10 | Teacher clicks `Read the room`; an actual proposal labeled `gpt-5.6` appears with server-validated sources selected for the current Trek. | Show meaningful GPT-5.6 use and publisher-neutral source validation. |
| 1:10–1:18 | Teacher reviews the proposed branch and clicks `Approve & publish`. | Show that AI cannot publish and the teacher is the decision authority. |
| 1:18–1:24 | Three color-coded columns labeled `Teacher`, `Student · Nova`, and `Class display` move to `Finding ice is only the first step`. | Prove one canonical lesson version across connected surfaces without making judges infer which screen is which. |
| 1:28–1:37 | Reconnect/recovery view and ClassTrek loop summary. | Demonstrate robustness beyond a slideshow or isolated mockup. |
| 1:37–1:43 | Safety queue and blocked-content evidence. | Prove classroom guardrails and public-display protection. |
| 1:43–1:52.75 | Repository/Codex collaboration evidence. | Name concrete Codex contributions to the working system. |
| 1:52.75–1:56.60 | ClassTrek end card and exact tagline. | Finish on the product promise. |

## One-take input sheet

- Session code: `MARS24`
- New student alias: `Nova`
- Safe choice: `Liquid water`
- Safe response: `Ice helps only if the crew also has enough energy to use it.`
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

- [x] Duration is `00:01:56.60`, less than `00:03:00`.
- [x] Voiceover explicitly explains the product, Codex, and GPT-5.6.
- [x] Trek Exchange, teacher remix, student-made approval boundary, Nova's vote
      and reasoning, anonymous sharing, the GPT-5.6 badge, teacher approval,
      blocked item, and synchronized scene change are readable.
- [x] No API key, `.env` file, private account page, or explicit unsafe text is
      visible after submission.
- [x] The deployed build reproduces every claim in the narration.
- [x] Export is 1280x720 H.264/AAC at 30fps with BT.709 limited-range
      `yuv420p`.
- [x] Captions are burned in; the opening CG carries its own matching title
      text.
- [x] Every simultaneous teacher/student/display composition has visible
      color-coded borders and role labels.
- [x] The ambient sound bed is original and contains no copyrighted music.
- [ ] YouTube visibility is **Public**.

## YouTube upload copy

**Title**

```text
ClassTrek — A Live AI Learning Trek Shaped by the Whole Class
```

**Description**

```text
ClassTrek is a teacher-controlled AI co-host for participatory lessons.
Students vote, explain, and react from their own devices; GPT-5.6 turns the
safe class pulse and approved sources into a grounded next-scene proposal;
the teacher reviews it before every connected screen advances.

This demo also shows Trek Exchange, where reviewed teacher, institution, and
student-made Treks can be discovered, remixed, and extended.

Built with Codex, GPT-5.6, Next.js, TypeScript, OpenAI Responses API,
OpenAI Moderation, Vercel Runtime Cache, Server-Sent Events, Zod, and Vitest.

Live demo: https://class-trek.vercel.app
Source: https://github.com/Hwoo34/class-trek
```
