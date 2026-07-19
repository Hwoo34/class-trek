import type { ClassroomSession, Scene, Source } from "@/lib/types";

export interface JourneyTemplate {
  id: string;
  title: string;
  subject: string;
  gradeBand: string;
  learningGoal: string;
  hook: string;
  accent: "mars" | "ocean" | "rainforest";
  creator: string;
  creatorType: "teacher" | "organization" | "student";
  reviewLabel: string;
  rating: number;
  reviewCount: number;
  momentum: "Top rated" | "Trending" | "New";
  sources: Source[];
  scenes: Scene[];
}

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
    title: "Finding ice is only the first step",
    narration:
      "Mars has water ice in polar regions and beneath parts of the surface. However, average surface temperatures are well below freezing. A crew would need reliable energy to provide heat and help turn collected ice into liquid water.",
    visual: "ice",
    sourceIds: ["nasa-water", "nasa-energy"],
    prompt:
      "Which evidence pair best explains why a crew planning to use Martian water must also consider reliable energy?",
    choices: [
      "Mars has water ice, and missions need energy for heat.",
      "Mars has a carbon-dioxide atmosphere, and missions need energy for communication.",
      "Mars is below freezing, and missions need energy for movement.",
    ],
  },
];

const oceanSources: Source[] = [
  {
    id: "noaa-bleaching",
    title: "What is coral bleaching?",
    publisher: "NOAA Ocean Service",
    url: "https://oceanservice.noaa.gov/facts/coral_bleach.html",
    excerpt:
      "When ocean water is too warm, corals can become stressed and expel the algae living in their tissues, turning the coral white.",
  },
  {
    id: "noaa-temperature",
    title: "Why measure sea surface temperature?",
    publisher: "NOAA Ocean Service",
    url: "https://oceanservice.noaa.gov/facts/sea-surface-temperature.html",
    excerpt:
      "Sea surface temperature measurements help scientists monitor climate patterns and evaluate coral bleaching risk.",
  },
];

const oceanScenes: Scene[] = [
  {
    id: "reef-signal",
    eyebrow: "Ocean Mission 01 · Signal",
    title: "Why is a coral reef losing its color?",
    narration:
      "A reef that once glowed with color is turning pale. The class must choose which clue to investigate before deciding what the reef needs.",
    visual: "ocean",
    sourceIds: ["noaa-bleaching"],
    prompt: "Which clue should the research team investigate first?",
    choices: ["Warmer water", "Less moonlight", "More sand"],
  },
  {
    id: "reef-heat",
    eyebrow: "Ocean Mission 02 · Evidence",
    title: "The reef is sending a heat-stress signal",
    narration:
      "NOAA explains that water that is too warm can stress coral and cause it to expel the algae that give it color. Temperature data can help test the class hypothesis.",
    visual: "ocean",
    sourceIds: ["noaa-bleaching", "noaa-temperature"],
    prompt: "What evidence would best test the class explanation?",
    choices: ["Temperature records", "Moon phases", "Beach width"],
  },
];

const rainforestSources: Source[] = [
  {
    id: "nasa-amazon-water",
    title: "Human Activities Are Drying Out the Amazon",
    publisher: "NASA Earth Observatory",
    url: "https://science.nasa.gov/earth/earth-observatory/human-activities-are-drying-out-the-amazon-145834/",
    excerpt:
      "Trees release water vapor that cools the forest, helps form clouds, and contributes rain that replenishes soil moisture.",
  },
  {
    id: "nasa-carbon-cycle",
    title: "What is the Carbon Cycle?",
    publisher: "NASA Kids Science",
    url: "https://science.nasa.gov/kids/earth/what-is-the-carbon-cycle/",
    excerpt:
      "Plants use carbon dioxide, water, and sunlight during photosynthesis to make food and release oxygen.",
  },
];

const rainforestScenes: Scene[] = [
  {
    id: "forest-clouds",
    eyebrow: "Rainforest Mission 01 · Mystery",
    title: "Can a forest help make its own rain?",
    narration:
      "The air above the forest carries water released by countless leaves. The class must decide which link in the water cycle to investigate first.",
    visual: "rainforest",
    sourceIds: ["nasa-amazon-water"],
    prompt: "Which process should the expedition trace first?",
    choices: ["Water from leaves", "Moonlight", "River salt"],
  },
  {
    id: "forest-cycle",
    eyebrow: "Rainforest Mission 02 · Connection",
    title: "Leaves connect soil, clouds, and rain",
    narration:
      "Water moves from soil through roots and leaves into the atmosphere, where it can help form clouds. A disrupted forest can weaken that connection.",
    visual: "rainforest",
    sourceIds: ["nasa-amazon-water", "nasa-carbon-cycle"],
    prompt: "Which observation would strengthen this explanation?",
    choices: ["Air moisture", "Rock color", "Moon phases"],
  },
];

export const journeyTemplates: JourneyTemplate[] = [
  {
    id: "mars",
    title: "Mission Mars",
    subject: "Earth & Space Science",
    gradeBand: "Grades 6–8",
    learningGoal:
      "Use evidence to explain how water, atmosphere, and energy constrain human survival on Mars.",
    hook: "Design a one-night survival plan using trusted science sources.",
    accent: "mars",
    creator: "ClassTrek Science Studio",
    creatorType: "teacher",
    reviewLabel: "Educator reviewed",
    rating: 4.9,
    reviewCount: 128,
    momentum: "Top rated",
    sources: demoSources,
    scenes: demoScenes,
  },
  {
    id: "ocean",
    title: "Reef Rescue",
    subject: "Ocean Science",
    gradeBand: "Grades 6–8",
    learningGoal:
      "Use NOAA evidence to explain how environmental changes can stress a coral reef.",
    hook: "Follow a reef's warning signs before its color disappears.",
    accent: "ocean",
    creator: "Student Ocean Lab",
    creatorType: "student",
    reviewLabel: "Teacher approved",
    rating: 4.8,
    reviewCount: 86,
    momentum: "Trending",
    sources: oceanSources,
    scenes: oceanScenes,
  },
  {
    id: "rainforest",
    title: "Rainforest Signal",
    subject: "Earth Systems",
    gradeBand: "Grades 6–8",
    learningGoal:
      "Use trusted Earth science evidence to connect plants, atmospheric moisture, clouds, and rainfall.",
    hook: "Solve the mystery of how a forest helps recycle water.",
    accent: "rainforest",
    creator: "Earth Systems Faculty",
    creatorType: "organization",
    reviewLabel: "Institution reviewed",
    rating: 4.7,
    reviewCount: 64,
    momentum: "New",
    sources: rainforestSources,
    scenes: rainforestScenes,
  },
];

export function getJourneyTemplate(id: string): JourneyTemplate | undefined {
  return journeyTemplates.find((journey) => journey.id === id);
}

export function createDemoSession(
  journeyId = "mars",
  history: ClassroomSession["journeyHistory"] = [],
): ClassroomSession {
  const journey = getJourneyTemplate(journeyId) ?? journeyTemplates[0];
  return {
    code: "MARS24",
    journeyId: journey.id,
    title: journey.title,
    subject: journey.subject,
    gradeBand: journey.gradeBand,
    learningGoal: journey.learningGoal,
    status: "ready",
    version: 1,
    currentScene: journey.scenes[0],
    sceneIndex: 0,
    sources: journey.sources,
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
        text:
          "Water first—the selected science source describes ice beneath parts of the surface.",
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
    journeyHistory: history,
    blockedCount: 0,
    updatedAt: new Date().toISOString(),
  };
}
