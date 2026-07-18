import Link from "next/link";
import { ArrowRight, MonitorUp, Radio, ShieldCheck, Users } from "lucide-react";
import { AppHeader } from "@/components/app-header";

export default function HomePage() {
  return (
    <main className="app-shell">
      <AppHeader status="Hackathon build · Education" />
      <div className="page landing">
        <section className="landing-copy">
          <p className="eyebrow">The lesson listens back</p>
          <h1 className="display-title">
            Turn a class
            <br />
            into a live idea.
          </h1>
          <p className="lede">
            A source-grounded AI co-host that reads the room, proposes the next
            teaching move, and waits for the teacher to say go.
          </p>
          <div className="landing-actions">
            <Link className="button button-cyan" href="/teacher">
              Open teacher studio
              <ArrowRight size={16} />
            </Link>
            <Link className="button button-secondary" href="/join/MARS24">
              Join as a student
              <Users size={16} />
            </Link>
            <Link className="button button-secondary" href="/display/MARS24">
              Open class display
              <MonitorUp size={16} />
            </Link>
          </div>
          <div className="safety-note" style={{ maxWidth: 650 }}>
            <ShieldCheck size={18} />
            <span>
              Student input and AI output are moderated. Nothing new reaches the
              classroom display without teacher approval.
            </span>
          </div>
        </section>
        <section className="landing-visual" aria-label="Live class preview">
          <div className="orbit-card">
            <div className="orbit-grid" />
            <div className="mars" />
            <div className="orbit-copy">
              <span className="tiny-pill">
                <Radio size={12} /> Mission Mars · Live
              </span>
              <h2>Could our class survive one night on Mars?</h2>
              <p>
                24 students are comparing evidence about air, water, and energy.
              </p>
            </div>
          </div>
          <div className="floating-pulse">
            <span className="mono">CLASS PULSE</span>
            <strong>68% chose water</strong>
            <span>AI found a useful misconception</span>
          </div>
        </section>
      </div>
    </main>
  );
}
