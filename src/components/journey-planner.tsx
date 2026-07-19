"use client";

import { useMemo, useState } from "react";
import { BookOpen, ChevronDown, Compass, History, Sparkles } from "lucide-react";
import { journeyTemplates } from "@/lib/demo-data";
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
  const recommendations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return journeyTemplates.filter(
      (journey) =>
        journey.id !== session.journeyId &&
        (!normalized ||
          `${journey.title} ${journey.subject} ${journey.hook}`
            .toLowerCase()
            .includes(normalized)),
    );
  }, [query, session.journeyId]);

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
          <strong>Choose the next learning journey</strong>
          <small>
            Pick a mission grounded in teacher-selected sources, or continue
            where the class left off.
          </small>
        </span>
        <ChevronDown className="journey-chevron" size={18} />
      </button>

      {open ? (
        <div className="journey-planner-body">
          <div className="journey-planner-heading">
            <div>
              <p className="eyebrow">Teacher journey desk</p>
              <h2>Where should the class travel next?</h2>
            </div>
            <span className="tiny-pill">
              <BookOpen size={12} /> Teacher-selected sources
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
              <Sparkles size={15} />
              <strong>Recommended next</strong>
            </div>
            <input
              aria-label="Find a journey topic"
              placeholder="Find a topic: ocean, forest…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="journey-grid">
            {recommendations.map((journey) => (
              <article className="journey-card" key={journey.id}>
                <span className={`journey-art journey-art-${journey.accent}`} />
                <div>
                  <small>{journey.subject}</small>
                  <h3>{journey.title}</h3>
                  <p>{journey.hook}</p>
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
                    Start this journey
                  </button>
                </div>
              </article>
            ))}
          </div>

          {session.journeyHistory.length > 0 ? (
            <div className="journey-history">
              <div className="journey-section-heading">
                <div>
                  <History size={15} />
                  <strong>Continue a previous story</strong>
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
