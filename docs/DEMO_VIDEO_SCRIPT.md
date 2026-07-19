# ClassTrek demo video runbook

> The final product-showcase candidate is
> `artifacts/ClassTrek-demo-v5-participation.mp4` at **1:56.60** with English
> narration, burned-in English captions, an animated original intro, and
> smooth transitions between real product recordings. Its final narration is
> in `docs/DEMO_VOICEOVER_V4.txt`, with the matching subtitle source in
> `docs/DEMO_CAPTIONS_V4.srt`.

The submitted YouTube video must remain under 3:00 and include audio. The V5
candidate is structured as one classroom story rather than a feature tour:
the teacher previews a recommended topic, resumes an earlier journey, receives
Nova's live vote and reasoning, shares it anonymously, asks GPT-5.6 to read the
room, and approves the branch that advances every connected screen.

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

## V5 story beats

| Time | Screen and action | Judge-facing purpose |
|---|---|---|
| 0:00–0:13 | Animated ClassTrek promise and product keywords. | Identify the product and differentiation immediately. |
| 0:13–0:26 | Teacher opens Journey Desk, previews recommended `Reef Rescue`, then resumes `Mission Mars`. | Prove topic choice, source-grounded recommendations, and resumable class stories. |
| 0:26–0:46 | Nova joins on a separate student client, reacts, votes `Liquid water`, and explains the energy connection. A 1.98-second punch-in makes the selected reaction and vote unmistakable. | Prove real participation across separate browser contexts. |
| 0:46–1:00 | The response arrives in the teacher's live pulse; a 1.78-second punch-in shows `Joined 3`, `Answered 1`, and `Blocked 0` before the teacher shares the safe idea anonymously. | Show causal realtime updates and privacy-preserving classroom sharing. |
| 1:00–1:10 | Teacher clicks `Read the room`; an actual proposal labeled `gpt-5.6` appears with server-validated sources selected for the current journey. | Show meaningful GPT-5.6 use and publisher-neutral source validation. |
| 1:10–1:18 | Teacher reviews the proposed branch and clicks `Approve & publish`. | Show that AI cannot publish and the teacher is the decision authority. |
| 1:18–1:28 | Teacher, Nova, and shared display move to `Finding ice is only the first step`. | Prove one canonical lesson version across connected surfaces. |
| 1:28–1:37 | Reconnect/recovery view and ClassTrek loop summary. | Demonstrate robustness beyond a slideshow or isolated mockup. |
| 1:37–1:45 | Safety queue and blocked-content evidence. | Prove classroom guardrails and public-display protection. |
| 1:45–1:53 | Repository/Codex collaboration evidence. | Name concrete Codex contributions to the working system. |
| 1:53–1:56.60 | ClassTrek end card and tagline. | Finish on the product promise. |

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
- [x] Recommended topics, prior-story resume, Nova's vote and reasoning,
      anonymous sharing, the GPT-5.6 badge, teacher approval, blocked item, and
      synchronized scene change are readable.
- [x] No API key, `.env` file, private account page, or explicit unsafe text is
      visible after submission.
- [x] The deployed build reproduces every claim in the narration.
- [x] Export is 1280x720 H.264/AAC at 30fps with BT.709 limited-range
      `yuv420p`.
- [x] Captions are burned in; the opening CG carries its own matching title
      text.
- [x] The ambient sound bed is original and contains no copyrighted music.
- [ ] YouTube visibility is **Public**.
