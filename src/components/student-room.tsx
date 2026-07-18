"use client";

import { useState } from "react";
import { Check, Send, ShieldCheck } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { useClassroomSession } from "@/hooks/use-classroom-session";
import type { Reaction } from "@/lib/types";

interface StudentRoomProps {
  code: string;
}

const reactions: Array<{
  value: Reaction;
  emoji: string;
  label: string;
}> = [
  { value: "understand", emoji: "◎", label: "I get it" },
  { value: "unsure", emoji: "≈", label: "Not sure yet" },
  { value: "question", emoji: "?", label: "I have a question" },
];

export function StudentRoom({ code }: StudentRoomProps) {
  const { session, loading, connected, error, send } =
    useClassroomSession(code);
  const [participantId] = useState(() => crypto.randomUUID());
  const [alias, setAlias] = useState("");
  const [joined, setJoined] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (loading || !session) {
    return (
      <div className={error ? "error-box" : "loading"}>
        {error ?? "Joining the classroom…"}
      </div>
    );
  }

  const participant = session.participants.find(
    (candidate) => candidate.id === participantId,
  );

  async function join(): Promise<void> {
    if (!alias.trim() || !participantId) return;
    const updated = await send({
      type: "join",
      participantId,
      alias: alias.trim(),
      avatar: alias.trim()[0]?.toUpperCase() ?? "S",
    });
    if (updated) setJoined(true);
  }

  async function submit(): Promise<void> {
    if (!choice || !text.trim()) return;
    const updated = await send({
      type: "respond",
      participantId,
      text: text.trim(),
      choice,
    });
    if (updated) setSubmitted(true);
  }

  return (
    <main className="app-shell">
      <AppHeader
        label="Student room"
        status={connected ? `Live · ${code}` : "Reconnecting"}
      />
      <div className="student-wrap">
        <section className="card student-card">
          {!joined && !participant ? (
            <>
              <p className="eyebrow">You’re entering {session.title}</p>
              <h1>What should we call you?</h1>
              <p className="lede" style={{ fontSize: 15 }}>
                Use a first name or classroom nickname. Your classmates only see
                an anonymous avatar unless your teacher shares a response.
              </p>
              <div className="join-grid">
                <input
                  aria-label="Classroom nickname"
                  maxLength={20}
                  placeholder="Classroom nickname"
                  value={alias}
                  onChange={(event) => setAlias(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void join();
                  }}
                />
                <button
                  className="button button-cyan"
                  type="button"
                  disabled={!alias.trim()}
                  onClick={() => void join()}
                >
                  Enter class
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="eyebrow">{session.currentScene.eyebrow}</p>
              <h1>{session.currentScene.title}</h1>
              <p className="lede" style={{ fontSize: 15 }}>
                {session.currentScene.narration}
              </p>

              {session.status === "paused" ? (
                <div className="safety-note">
                  Your teacher paused the room. Your work is safe—we’ll continue
                  together in a moment.
                </div>
              ) : null}

              <div className="reaction-row">
                {reactions.map((reaction) => (
                  <button
                    className={`reaction-button ${
                      participant?.reaction === reaction.value
                        ? "reaction-selected"
                        : ""
                    }`}
                    key={reaction.value}
                    type="button"
                    onClick={() =>
                      void send({
                        type: "reaction",
                        participantId,
                        reaction: reaction.value,
                      })
                    }
                  >
                    <span>{reaction.emoji}</span>
                    {reaction.label}
                  </button>
                ))}
              </div>

              <p className="eyebrow">Think, choose, explain</p>
              <h2>{session.currentScene.prompt}</h2>
              <div className="choice-list" style={{ margin: "16px 0" }}>
                {session.currentScene.choices.map((option) => (
                  <button
                    className={`choice ${
                      choice === option ? "choice-selected" : ""
                    }`}
                    key={option}
                    type="button"
                    onClick={() => {
                      setChoice(option);
                      setSubmitted(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <textarea
                aria-label="Explain your thinking"
                maxLength={320}
                placeholder="What evidence or idea led you there?"
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                  setSubmitted(false);
                }}
              />
              <button
                className="button button-cyan"
                style={{ width: "100%", marginTop: 12 }}
                type="button"
                disabled={!choice || !text.trim() || submitted}
                onClick={() => void submit()}
              >
                {submitted ? (
                  <>
                    <Check size={16} /> Thinking received
                  </>
                ) : (
                  <>
                    <Send size={16} /> Send to teacher
                  </>
                )}
              </button>
              <div className="safety-note">
                <ShieldCheck size={17} />
                <span>
                  Responses are safety-checked first. Only your teacher can choose
                  to share one with the class.
                </span>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
