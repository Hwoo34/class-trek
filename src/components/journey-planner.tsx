"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  Compass,
  History,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  WandSparkles,
} from "lucide-react";
import { journeyTemplates } from "@/lib/demo-data";
import type { JourneyTemplate } from "@/lib/demo-data";
import type {
  ClassroomSession,
  SessionAction,
} from "@/lib/types";

interface JourneyPlannerProps {
  session: ClassroomSession;
  send: (
    action: SessionAction,
  ) => Promise<ClassroomSession | null>;
}

export function JourneyPlanner({ session, send }: JourneyPlannerProps) {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<
    "All" | "Top rated" | "Trending" | "Student-made"
  >("All");
  const [remixing, setRemixing] = useState<JourneyTemplate | null>(null);
  const [customTitle, setCustomTitle] = useState("");
  const [customLearningGoal, setCustomLearningGoal] = useState("");
  const recommendations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return journeyTemplates.filter(
      (journey) =>
        journey.id !== session.journeyId &&
        (filter === "All" ||
          journey.momentum === filter ||
          (filter === "Student-made" && journey.creatorType === "student")) &&
        (!normalized ||
          `${journey.title} ${journey.subject} ${journey.hook} ${journey.creator}`
            .toLowerCase()
            .includes(normalized)),
    );
  }, [filter, query, session.journeyId]);

  function openRemix(journey: JourneyTemplate): void {
    setRemixing(journey);
    setCustomTitle(journey.title);
    setCustomLearningGoal(journey.learningGoal);
  }

  async function launchRemix(): Promise<void> {
    if (!remixing || !customTitle.trim() || !customLearningGoal.trim()) return;
    const updated = await send({
      type: "select_journey",
      journeyId: remixing.id,
      customTitle: customTitle.trim(),
      customLearningGoal: customLearningGoal.trim(),
    });
    if (updated) setRemixing(null);
  }

  return (
    <section className={`card journey-planner ${open ? "journey-planner-open" : ""}`}>
      <button
        className="journey-planner-toggle"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span className="journey-planner-icon">
          <Compass size={18} />
        </span>
        <span>
          <strong>Choose the next class Trek</strong>
          <small>
            Discover, review, remix, and launch a source-grounded Trek.
          </small>
        </span>
        <ChevronDown className="journey-chevron" size={18} />
      </button>

      {open ? (
        <div className="journey-planner-body">
          <div className="journey-planner-heading">
            <div>
              <p className="eyebrow">Trek Exchange · open learning stories</p>
              <h2>Find a Trek. Make it yours.</h2>
            </div>
            <span className="tiny-pill">
              <ShieldCheck size={12} /> Reviewed before classroom use
            </span>
          </div>

          <div className="journey-current">
            <span className={`journey-art journey-art-${session.journeyId}`} />
            <div>
              <small>Live now · Scene {session.sceneIndex + 1}</small>
              <strong>{session.title}</strong>
              <span>{session.subject}</span>
            </div>
          </div>

          <div className="journey-section-heading">
            <div>
              <TrendingUp size={15} />
              <strong>Explore the exchange</strong>
            </div>
            <input
              aria-label="Find a Trek topic"
              placeholder="Find a topic: ocean, forest…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="journey-filters" aria-label="Trek filters">
            {(["All", "Top rated", "Trending", "Student-made"] as const).map(
              (option) => (
                <button
                  className={filter === option ? "journey-filter-active" : ""}
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                >
                  {option}
                </button>
              ),
            )}
          </div>

          <div className="journey-grid">
            {recommendations.map((journey) => (
              <article className="journey-card" key={journey.id}>
                <span className={`journey-art journey-art-${journey.accent}`}>
                  <span className="journey-momentum">{journey.momentum}</span>
                </span>
                <div>
                  <div className="journey-card-meta">
                    <small>{journey.subject}</small>
                    <span>
                      <Star size={12} fill="currentColor" /> {journey.rating}
                      <small> ({journey.reviewCount})</small>
                    </span>
                  </div>
                  <h3>{journey.title}</h3>
                  <p>{journey.hook}</p>
                  <div className="journey-trust-row">
                    <span>{journey.creator}</span>
                    <span>
                      <Check size={11} /> {journey.reviewLabel}
                    </span>
                  </div>
                  <div className="journey-card-actions">
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={() =>
                        void send({
                          type: "select_journey",
                          journeyId: journey.id,
                        })
                      }
                    >
                      Start
                    </button>
                    <button
                      className="button journey-remix-button"
                      type="button"
                      onClick={() => openRemix(journey)}
                    >
                      <WandSparkles size={14} /> Remix
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {recommendations.length === 0 ? (
            <div className="journey-empty">
              No reviewed Treks match this view yet. Try another filter.
            </div>
          ) : null}

          {remixing ? (
            <section className="journey-remix-panel">
              <div className="journey-remix-heading">
                <div>
                  <p className="eyebrow">Trek Remix Studio</p>
                  <h3>Adapt {remixing.title} for this class</h3>
                </div>
                <span className="tiny-pill">
                  <BookOpen size={12} /> Sources stay attached
                </span>
              </div>
              <div className="journey-remix-grid">
                <label>
                  Trek title
                  <input
                    aria-label="Remix Trek title"
                    maxLength={60}
                    value={customTitle}
                    onChange={(event) => setCustomTitle(event.target.value)}
                  />
                </label>
                <label>
                  Learning goal
                  <textarea
                    aria-label="Remix learning goal"
                    maxLength={240}
                    value={customLearningGoal}
                    onChange={(event) =>
                      setCustomLearningGoal(event.target.value)
                    }
                  />
                </label>
              </div>
              <div className="journey-remix-note">
                Student-made Treks can be remixed, but remain private until a
                teacher or institution reviews and launches them.
              </div>
              <div className="journey-card-actions">
                <button
                  className="button button-cyan"
                  disabled={!customTitle.trim() || !customLearningGoal.trim()}
                  type="button"
                  onClick={() => void launchRemix()}
                >
                  <Sparkles size={14} /> Launch remixed Trek
                </button>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => setRemixing(null)}
                >
                  Cancel
                </button>
              </div>
            </section>
          ) : null}

          {session.journeyHistory.length > 0 ? (
            <div className="journey-history">
              <div className="journey-section-heading">
                <div>
                  <History size={15} />
                  <strong>Continue a previous Trek</strong>
                </div>
              </div>
              <div className="journey-history-list">
                {session.journeyHistory.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      void send({
                        type: "resume_journey",
                        historyId: item.id,
                      })
                    }
                  >
                    <span>
                      <strong>{item.title}</strong>
                      <small>Resume at Scene {item.sceneIndex + 1}</small>
                    </span>
                    <span>Continue →</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
