import type { ClassroomSession, Scene, Source } from "@/lib/types";

export const demoSources: Source[] = [
  {
    id: "nasa-water",
    title: "Water on Mars",
    publisher: "NASA Science",
    url: "https://science.nasa.gov/mars/facts/",
    excerpt:
      "Mars has water ice today, especially beneath the polar regions and in the shallow subsurface.",
  },
  {
    id: "nasa-atmosphere",
    title: "Mars: Facts",
    publisher: "NASA Science",
    url: "https://science.nasa.gov/mars/facts/",
    excerpt:
      "Mars has a thin atmosphere made mostly of carbon dioxide and average surface temperatures well below freezing.",
  },
  {
    id: "nasa-energy",
    title: "Powering exploration on Mars",
    publisher: "NASA",
    url: "https://mars.nasa.gov/mars2020/spacecraft/rover/electrical-power/",
    excerpt:
      "Mars missions need reliable energy for heat, instruments, communication, and movement.",
  },
];

export const demoScenes: Scene[] = [
  {
    id: "scene-arrival",
    eyebrow: "Mission 01 · Arrival",
    title: "Could our class survive one night on Mars?",
    narration:
      "Mars looks familiar from orbit, but its atmosphere is thin, cold, and mostly carbon dioxide. Before we build a home, we need to decide what humans must solve first.",
    visual: "mars",
    sourceIds: ["nasa-atmosphere"],
    prompt: "Which survival problem should Mission Control solve first?",
    choices: ["Breathable air", "Liquid water", "Reliable energy"],
  },
  {
    id: "scene-ice",
    eyebrow: "Mission 02 · Evidence",
    title: "Finding ice is not the same as having water",
    narration:
      "Evidence shows water ice exists on Mars. But a crew must locate it, extract it, melt it, clean it, and keep it from freezing again. Every step consumes energy.",
    visual: "ice",
    sourceIds: ["nasa-water", "nasa-energy"],
    prompt: "What resource is tightly connected to using Martian ice?",
    choices: ["Energy", "Gravity", "Daylight color"],
  },
];

export function createDemoSession(): ClassroomSession {
  return {
    code: "MARS24",
    title: "Mission Mars",
    subject: "Earth & Space Science",
    gradeBand: "Grades 6–8",
    learningGoal:
      "Use evidence to explain how water, atmosphere, and energy constrain human survival on Mars.",
    status: "ready",
    version: 1,
    currentScene: demoScenes[0],
    sceneIndex: 0,
    sources: demoSources,
    participants: [
      {
        id: "demo-ada",
        alias: "Ada",
        avatar: "A",
        reaction: "understand",
        connected: true,
        lastSeenAt: new Date().toISOString(),
      },
      {
        id: "demo-orbit",
        alias: "Orbit",
        avatar: "O",
        reaction: "unsure",
        connected: true,
        lastSeenAt: new Date().toISOString(),
      },
    ],
    responses: [
      {
        id: "response-demo-1",
        participantId: "demo-ada",
        alias: "Ada",
        text: "Water first—NASA found ice, so the crew can melt it.",
        choice: "Liquid water",
        createdAt: new Date().toISOString(),
        safety: "safe",
        public: true,
      },
    ],
    pulse: {
      responseCount: 1,
      understand: 1,
      unsure: 1,
      question: 0,
      clusters: [
        { label: "Water is available as ice", count: 1, tone: "cyan" },
      ],
    },
    pendingSuggestion: null,
    blockedCount: 0,
    updatedAt: new Date().toISOString(),
  };
}
