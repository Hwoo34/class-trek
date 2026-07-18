"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Check,
  Eye,
  EyeOff,
  LoaderCircle,
  Pause,
  Play,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { LessonVisual } from "@/components/lesson-visual";
import { useClassroomSession } from "@/hooks/use-classroom-session";

interface TeacherConsoleProps {
  code: string;
}

function statusLabel(status: string): string {
  return status.replaceAll("_", " ");
}

export function TeacherConsole({ code }: TeacherConsoleProps) {
  const [accessCode, setAccessCode] = useState("");
  const [accessGranted, setAccessGranted] = useState(
    process.env.NODE_ENV === "development",
  );
  const [accessError, setAccessError] = useState<string | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const { session, loading, connected, error, send } =
    useClassroomSession(code, accessGranted ? accessCode : undefined);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;

    const controller = new AbortController();
    void fetch(`/api/sessions/${code}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "verify_teacher_access" }),
      signal: controller.signal,
    })
      .then((response) => {
        if (response.ok) setAccessGranted(true);
      })
      .catch(() => {
        // No session cookie yet; keep the explicit access form visible.
      });

    return () => controller.abort();
  }, [code]);

  async function verifyTeacherAccess(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setCheckingAccess(true);
    setAccessError(null);

    try {
      const response = await fetch(`/api/sessions/${code}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-class-trek-teacher-access": accessCode,
        },
        body: JSON.stringify({ type: "verify_teacher_access" }),
      });
      const payload = (await response.json()) as
        | { authorized: true }
        | { error: string };
      if (!response.ok || !("authorized" in payload)) {
        throw new Error(
          "error" in payload ? payload.error : "Unable to verify access",
        );
      }
      setAccessCode("");
      setAccessGranted(true);
    } catch (requestError) {
      setAccessError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to verify teacher access",
      );
    } finally {
      setCheckingAccess(false);
    }
  }

  if (loading) {
    return <div className="loading">Opening Mission Control…</div>;
  }
  if (!session) {
    return <div className="error-box">{error ?? "Session unavailable"}</div>;
  }

  if (!accessGranted) {
    return (
      <main className="app-shell">
        <AppHeader
          label="Teacher Mission Control"
          status={`Protected · ${code}`}
        />
        <div className="student-wrap">
          <section className="card student-card">
            <p className="eyebrow">Teacher-only controls</p>
            <h1>Enter Mission Control</h1>
            <p className="lede" style={{ fontSize: 15 }}>
              Student participation stays open, while lesson controls and AI
              generation require the teacher access code.
            </p>
            <form className="join-grid" onSubmit={verifyTeacherAccess}>
              <input
                aria-label="Teacher access code"
                autoComplete="off"
                maxLength={80}
                placeholder="Teacher access code"
                type="password"
                value={accessCode}
                onChange={(event) => {
                  setAccessCode(event.target.value);
                  setAccessError(null);
                }}
              />
              <button
                className="button button-cyan"
                type="submit"
                disabled={!accessCode.trim() || checkingAccess}
              >
                {checkingAccess ? (
                  <LoaderCircle className="spin" size={15} />
                ) : (
                  <ShieldAlert size={15} />
                )}
                Unlock controls
              </button>
            </form>
            {accessError ? (
              <div className="error-box" role="alert">
                {accessError}
              </div>
            ) : null}
            <div className="safety-note">
              The access code is sent only to the server for verification and
              is never included in the classroom session state.
            </div>
          </section>
        </div>
      </main>
    );
  }

  const safeResponses = session.responses.filter(
    (response) => response.safety === "safe",
  );
  const visibleResponses = session.responses.slice(-6).reverse();
  const isGenerating =
    session.status === "teacher_review" && !session.pendingSuggestion;

  return (
    <main className="app-shell">
      <AppHeader
        label="Teacher Mission Control"
        status={`${connected ? "Synced" : "Reconnecting"} · ${code}`}
      >
        <Link
          className="button button-secondary"
          href={`/display/${code}`}
          target="_blank"
        >
          Open display
        </Link>
      </AppHeader>
      <div className="page">
        <div style={{ marginBottom: 24 }}>
          <p className="eyebrow">ClassTrek · Teacher-controlled live lesson</p>
          <h1 className="page-title">{session.title}</h1>
          <p className="lede">{session.learningGoal}</p>
        </div>

        {error ? <div className="error-box">{error}</div> : null}

        <div className="teacher-grid">
          <section className="teacher-main">
            <LessonVisual
              scene={session.currentScene}
              sources={session.sources}
            />
            <div className="teacher-toolbar">
              {session.status === "paused" ? (
                <button
                  className="button"
                  type="button"
                  onClick={() => void send({ type: "set_status", status: "live" })}
                >
                  <Play size={15} /> Resume lesson
                </button>
              ) : (
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() =>
                    void send({ type: "set_status", status: "paused" })
                  }
                >
                  <Pause size={15} /> Pause all screens
                </button>
              )}
              <button
                className="button button-cyan"
                type="button"
                disabled={isGenerating}
                onClick={() => void send({ type: "generate_suggestion" })}
              >
                {isGenerating ? (
                  <LoaderCircle className="spin" size={15} />
                ) : (
                  <Sparkles size={15} />
                )}
                Read the room
              </button>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => void send({ type: "reset_demo" })}
              >
                <RefreshCw size={15} /> Reset demo
              </button>
              <span className="status-pill">
                Scene {session.sceneIndex + 1} · {statusLabel(session.status)}
              </span>
            </div>

            <section className="card prompt-card">
              <p className="eyebrow">Question on student devices</p>
              <h2>{session.currentScene.prompt}</h2>
              <div className="choice-list">
                {session.currentScene.choices.map((choice) => (
                  <div className="choice" key={choice}>
                    {choice}
                  </div>
                ))}
              </div>
            </section>

            {session.pendingSuggestion ? (
              <section className="card suggestion-card">
                <div className="card-header">
                  <div>
                    <p className="eyebrow">AI proposal · teacher approval required</p>
                    <h2>{session.pendingSuggestion.title}</h2>
                  </div>
                  <span className="tiny-pill">
                    {session.pendingSuggestion.generatedBy}
                  </span>
                </div>
                <div className="card-body">
                  <p>{session.pendingSuggestion.teacherSummary}</p>
                  <blockquote>{session.pendingSuggestion.narration}</blockquote>
                  <div className="safety-note">
                    <ShieldAlert size={17} />
                    <span>{session.pendingSuggestion.safetyNote}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      marginTop: 17,
                    }}
                  >
                    <button
                      className="button button-cyan"
                      type="button"
                      onClick={() =>
                        void send({
                          type: "approve_suggestion",
                          expectedVersion: session.version,
                        })
                      }
                    >
                      <Check size={16} /> Approve & publish
                    </button>
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={() =>
                        void send({ type: "generate_suggestion" })
                      }
                    >
                      <RefreshCw size={15} /> Try another
                    </button>
                    <button
                      className="button button-danger"
                      type="button"
                      onClick={() =>
                        void send({ type: "dismiss_suggestion" })
                      }
                    >
                      <X size={15} /> Dismiss
                    </button>
                  </div>
                </div>
              </section>
            ) : null}
          </section>

          <aside className="teacher-side">
            <section className="card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Live class pulse</p>
                  <h3>What the room is saying</h3>
                </div>
                <Users size={18} />
              </div>
              <div className="card-body">
                <div className="metric-row">
                  <div className="metric">
                    <span>Joined</span>
                    <strong>{session.participants.length}</strong>
                  </div>
                  <div className="metric">
                    <span>Answered</span>
                    <strong>{session.pulse.responseCount}</strong>
                  </div>
                  <div className="metric">
                    <span>Blocked</span>
                    <strong>{session.blockedCount}</strong>
                  </div>
                </div>
                <div className="cluster-list">
                  {session.pulse.clusters.length > 0 ? (
                    session.pulse.clusters.map((cluster) => (
                      <div className="cluster" key={cluster.label}>
                        <span>{cluster.label}</span>
                        <span className="cluster-count">{cluster.count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="lede" style={{ fontSize: 13 }}>
                      Waiting for student choices…
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Moderated inbox</p>
                  <h3>{safeResponses.length} safe responses</h3>
                </div>
                <ShieldAlert size={18} />
              </div>
              <div className="card-body">
                <div className="response-list">
                  {visibleResponses.map((response) => (
                    <article className="response" key={response.id}>
                      <div className="response-top">
                        <strong>{response.alias}</strong>
                        <span className={`response-${response.safety}`}>
                          {response.safety}
                        </span>
                      </div>
                      <p>
                        {response.safety === "blocked"
                          ? "Hidden: content did not pass classroom safety."
                          : response.text}
                      </p>
                      {response.safety === "safe" ? (
                        <button
                          className="button button-secondary"
                          style={{ marginTop: 10, minHeight: 34, padding: "5px 10px" }}
                          type="button"
                          onClick={() =>
                            void send({
                              type: "publish_response",
                              responseId: response.id,
                            })
                          }
                        >
                          {response.public ? (
                            <>
                              <EyeOff size={13} /> Hide
                            </>
                          ) : (
                            <>
                              <Eye size={13} /> Share anonymously
                            </>
                          )}
                        </button>
                      ) : response.safety === "review" ? (
                        <button
                          className="button button-secondary"
                          style={{ marginTop: 10, minHeight: 34, padding: "5px 10px" }}
                          type="button"
                          onClick={() =>
                            void send({
                              type: "approve_response",
                              responseId: response.id,
                            })
                          }
                        >
                          <Check size={13} /> Approve for analysis
                        </button>
                      ) : null}
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
