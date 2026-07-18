"use client";

import { Radio, ShieldCheck } from "lucide-react";
import { useClassroomSession } from "@/hooks/use-classroom-session";

interface DisplayRoomProps {
  code: string;
}

export function DisplayRoom({ code }: DisplayRoomProps) {
  const { session, loading, error } = useClassroomSession(code);
  if (loading || !session) {
    return (
      <div className={error ? "error-box" : "loading"}>
        {error ?? "Preparing the class display…"}
      </div>
    );
  }

  const publicResponse = session.responses
    .slice()
    .reverse()
    .find((response) => response.public && response.safety === "safe");

  return (
    <main className="display-page">
      <section className="display-stage">
        <div className="orbit-grid" />
        <div className="mars" aria-hidden="true" />
        <div className="display-stage-content">
          <span className="tiny-pill" style={{ color: "white", borderColor: "#ffffff30" }}>
            <Radio size={12} /> {session.title} · {session.status}
          </span>
          <p className="eyebrow" style={{ marginTop: 36 }}>
            {session.currentScene.eyebrow}
          </p>
          <h1 className="display-title">{session.currentScene.title}</h1>
          <p className="lede">{session.currentScene.narration}</p>
        </div>
        <div className="display-question">{session.currentScene.prompt}</div>
      </section>

      <aside className="display-sidebar">
        <p className="eyebrow">The room right now</p>
        <h2 style={{ margin: 0, fontSize: 30, letterSpacing: "-0.04em" }}>
          Thinking together
        </h2>
        <div className="avatar-stack" aria-label="Joined students">
          {session.participants.map((participant) => (
            <span
              className="avatar"
              key={participant.id}
              title={participant.reaction ?? "Thinking"}
            >
              {participant.avatar}
            </span>
          ))}
        </div>

        <div className="metric-row">
          <div className="metric">
            <span>Joined</span>
            <strong>{session.participants.length}</strong>
          </div>
          <div className="metric">
            <span>Ideas</span>
            <strong>{session.pulse.responseCount}</strong>
          </div>
          <div className="metric">
            <span>Questions</span>
            <strong>{session.pulse.question}</strong>
          </div>
        </div>

        <div className="cluster-list">
          {session.pulse.clusters.map((cluster) => (
            <div className="cluster" key={cluster.label}>
              <span>{cluster.label}</span>
              <span className="cluster-count">{cluster.count}</span>
            </div>
          ))}
        </div>

        {publicResponse ? (
          <div className="public-response">
            <span className="mono">AN IDEA FROM THE ROOM</span>
            <p>“{publicResponse.text}”</p>
          </div>
        ) : null}

        <div className="safety-note">
          <ShieldCheck size={17} />
          <span>
            Shared responses are anonymous, safety-checked, and approved by the
            teacher.
          </span>
        </div>
        <p
          className="mono"
          style={{ marginTop: 20, color: "var(--muted)", fontSize: 11 }}
        >
          CLASS CODE {code} · VERSION {session.version}
        </p>
      </aside>
    </main>
  );
}
