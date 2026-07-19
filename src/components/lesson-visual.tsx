import { ExternalLink, ShieldCheck } from "lucide-react";
import type { Scene, Source } from "@/lib/types";

interface LessonVisualProps {
  scene: Scene;
  sources: Source[];
}

export function LessonVisual({ scene, sources }: LessonVisualProps) {
  const source = sources.find((candidate) =>
    scene.sourceIds.includes(candidate.id),
  );

  return (
    <section className={`card lesson-hero lesson-hero-${scene.visual}`}>
      <div className="orbit-grid" />
      <div
        className={`story-orb story-orb-${scene.visual}`}
        aria-hidden="true"
      />
      <div className="lesson-copy">
        <p className="eyebrow">{scene.eyebrow}</p>
        <h2>{scene.title}</h2>
        <p>{scene.narration}</p>
        {source ? (
          <a
            className="lesson-source"
            href={source.url}
            target="_blank"
            rel="noreferrer"
          >
            <ShieldCheck size={14} />
            Source material: {source.publisher}
            <ExternalLink size={12} />
          </a>
        ) : null}
      </div>
    </section>
  );
}
