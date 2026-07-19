import { getJourneyTemplate } from "@/lib/demo-data";
import { getGenerationProvider } from "@/lib/ai-provider";
import type { ClassroomSession, SuggestedScene } from "@/lib/types";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

export const suggestedSceneValidation = z.object({
  teacherSummary: z.string(),
  reason: z.string(),
  eyebrow: z.string(),
  title: z.string(),
  narration: z.string(),
  prompt: z.string(),
  choices: z.array(z.string()).length(3),
  sourceIds: z.array(z.string()).min(1),
  visual: z.enum(["mars", "ice", "energy", "ocean", "rainforest"]),
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
    visual: {
      type: "string",
      enum: ["mars", "ice", "energy", "ocean", "rainforest"],
    },
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
  const journey = getJourneyTemplate(session.journeyId);
  const journeyScenes = journey?.scenes ?? [session.currentScene];
  const fallback =
    journeyScenes[
      Math.min(session.sceneIndex + 1, journeyScenes.length - 1)
    ] ?? session.currentScene;
  const fallbackSuggestion: SuggestedScene = {
    ...fallback,
    id: `suggestion-${Date.now()}`,
    teacherSummary:
      "Students see water ice as an immediate solution, but the energy needed to use it is underexplored.",
    reason:
      "Connect the class’s most common response to the next scientific constraint.",
    safetyNote:
      "Uses only the teacher-selected source pack and contains no sensitive content.",
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
    "You are a K-12 classroom co-host. Propose, never publish, one next scene for teacher approval. Stay strictly inside the teacher-supplied source pack, regardless of publisher or subject. Use age-appropriate language for grades 6-8. Do not introduce violence, crime, drugs, sexual content, hate, self-harm, personal data, or humiliating comparisons. Do not claim facts without a supplied source id.";
  const userContent = JSON.stringify({
    learningGoal: session.learningGoal,
    currentScene: session.currentScene,
    classPulse: session.pulse,
    studentResponses: safeResponses,
    allowedSources: sourcePack,
  });

  try {
    let parsed: z.infer<typeof suggestedSceneValidation>;

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
      parsed = suggestedSceneValidation.parse(
        JSON.parse(response.choices[0]?.message.content ?? ""),
      );
    } else {
      const response = await generation.client.responses.parse({
        model: generation.model,
        store: false,
        max_output_tokens: 1_400,
        reasoning: { effort: "low" },
        input: [
          { role: "system", content: systemContent },
          { role: "user", content: userContent },
        ],
        text: {
          format: zodTextFormat(
            suggestedSceneValidation,
            "next_classroom_scene",
          ),
        },
      });
      if (response.status !== "completed" || !response.output_parsed) {
        throw new Error(
          `OpenAI structured response was ${response.status ?? "unavailable"}`,
        );
      }
      parsed = suggestedSceneValidation.parse(response.output_parsed);
    }

    const allowedIds = new Set(session.sources.map((source) => source.id));
    if (!parsed.sourceIds.every((sourceId) => allowedIds.has(sourceId))) {
      return fallbackSuggestion;
    }
    const [firstChoice, secondChoice, thirdChoice] = parsed.choices;
    if (!firstChoice || !secondChoice || !thirdChoice) {
      return fallbackSuggestion;
    }

    return {
      ...parsed,
      choices: [firstChoice, secondChoice, thirdChoice],
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
