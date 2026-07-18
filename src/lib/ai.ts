import OpenAI from "openai";
import { demoScenes } from "@/lib/demo-data";
import type { ClassroomSession, SuggestedScene } from "@/lib/types";

const sceneSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    teacherSummary: { type: "string" },
    reason: { type: "string" },
    eyebrow: { type: "string" },
    title: { type: "string" },
    narration: { type: "string" },
    prompt: { type: "string" },
    choices: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 3,
    },
    sourceIds: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
    },
    visual: { type: "string", enum: ["mars", "ice", "energy"] },
    safetyNote: { type: "string" },
  },
  required: [
    "teacherSummary",
    "reason",
    "eyebrow",
    "title",
    "narration",
    "prompt",
    "choices",
    "sourceIds",
    "visual",
    "safetyNote",
  ],
} as const;

export async function generateNextScene(
  session: ClassroomSession,
): Promise<SuggestedScene> {
  const fallback = demoScenes[Math.min(session.sceneIndex + 1, demoScenes.length - 1)];
  const fallbackSuggestion: SuggestedScene = {
    ...fallback,
    id: `suggestion-${Date.now()}`,
    teacherSummary:
      "Students see water ice as an immediate solution, but the energy needed to use it is underexplored.",
    reason:
      "Connect the class’s most common response to the next scientific constraint.",
    safetyNote:
      "Uses only the teacher-approved NASA source pack and contains no sensitive content.",
    generatedBy: "fallback",
  };

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackSuggestion;

  const safeResponses = session.responses
    .filter((response) => response.safety === "safe")
    .slice(-24)
    .map((response) => ({
      choice: response.choice,
      text: response.text,
    }));

  const sourcePack = session.sources.map((source) => ({
    id: source.id,
    title: source.title,
    excerpt: source.excerpt,
  }));

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5.6-terra",
      input: [
        {
          role: "system",
          content:
            "You are a K-12 classroom co-host. Propose, never publish, one next scene for teacher approval. Stay strictly inside the supplied source pack. Use age-appropriate language for grades 6-8. Do not introduce violence, crime, drugs, sexual content, hate, self-harm, personal data, or humiliating comparisons. Do not claim facts without a supplied source id.",
        },
        {
          role: "user",
          content: JSON.stringify({
            learningGoal: session.learningGoal,
            currentScene: session.currentScene,
            classPulse: session.pulse,
            studentResponses: safeResponses,
            allowedSources: sourcePack,
          }),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "next_classroom_scene",
          strict: true,
          schema: sceneSchema,
        },
      },
    });

    const parsed = JSON.parse(response.output_text) as Omit<
      SuggestedScene,
      "id" | "generatedBy"
    >;
    const allowedIds = new Set(session.sources.map((source) => source.id));
    if (!parsed.sourceIds.every((sourceId) => allowedIds.has(sourceId))) {
      return fallbackSuggestion;
    }

    return {
      ...parsed,
      id: `suggestion-${Date.now()}`,
      generatedBy: "gpt-5.6",
    };
  } catch {
    return fallbackSuggestion;
  }
}
