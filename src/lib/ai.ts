import { demoScenes } from "@/lib/demo-data";
import { getGenerationProvider } from "@/lib/ai-provider";
import type { ClassroomSession, SuggestedScene } from "@/lib/types";
import { z } from "zod";

const suggestedSceneValidation = z.object({
  teacherSummary: z.string(),
  reason: z.string(),
  eyebrow: z.string(),
  title: z.string(),
  narration: z.string(),
  prompt: z.string(),
  choices: z.tuple([z.string(), z.string(), z.string()]),
  sourceIds: z.array(z.string()).min(1),
  visual: z.enum(["mars", "ice", "energy"]),
  safetyNote: z.string(),
});

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

  const generation = getGenerationProvider();
  if (!generation) return fallbackSuggestion;

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
  const systemContent =
    "You are a K-12 classroom co-host. Propose, never publish, one next scene for teacher approval. Stay strictly inside the supplied source pack. Use age-appropriate language for grades 6-8. Do not introduce violence, crime, drugs, sexual content, hate, self-harm, personal data, or humiliating comparisons. Do not claim facts without a supplied source id.";
  const userContent = JSON.stringify({
    learningGoal: session.learningGoal,
    currentScene: session.currentScene,
    classPulse: session.pulse,
    studentResponses: safeResponses,
    allowedSources: sourcePack,
  });

  try {
    let outputText: string;

    if (generation.provider === "lmstudio") {
      // LM Studio documents JSON-schema enforcement on Chat Completions. Keep
      // the production GPT-5.6 path on the Responses API below.
      const response = await generation.client.chat.completions.create({
        model: generation.model,
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: userContent },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "next_classroom_scene",
            strict: true,
            schema: sceneSchema,
          },
        },
        max_tokens: 1_200,
        temperature: 0.2,
      });
      outputText = response.choices[0]?.message.content ?? "";
    } else {
      const response = await generation.client.responses.create({
        model: generation.model,
        store: false,
        max_output_tokens: 900,
        input: [
          { role: "system", content: systemContent },
          { role: "user", content: userContent },
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
      outputText = response.output_text;
    }

    const parsed = suggestedSceneValidation.parse(JSON.parse(outputText));
    const allowedIds = new Set(session.sources.map((source) => source.id));
    if (!parsed.sourceIds.every((sourceId) => allowedIds.has(sourceId))) {
      return fallbackSuggestion;
    }

    return {
      ...parsed,
      id: `suggestion-${Date.now()}`,
      generatedBy:
        generation.provider === "openai" ? "gpt-5.6" : "lm-studio",
    };
  } catch (error) {
    console.warn("AI scene generation fell back", {
      provider: generation.provider,
      error: error instanceof Error ? error.message : "unknown-error",
    });
    return fallbackSuggestion;
  }
}
