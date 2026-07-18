import type {
  ClassPulse,
  Participant,
  StudentResponse,
} from "@/lib/types";

export function derivePulse(
  participants: Participant[],
  responses: StudentResponse[],
): ClassPulse {
  const safeResponses = responses.filter((response) => response.safety === "safe");
  const choices = new Map<string, number>();

  for (const response of safeResponses) {
    if (!response.choice) continue;
    choices.set(response.choice, (choices.get(response.choice) ?? 0) + 1);
  }

  const tones = ["cyan", "amber", "violet"] as const;
  const clusters = [...choices.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([label, count], index) => ({
      label,
      count,
      tone: tones[index % tones.length],
    }));

  return {
    responseCount: safeResponses.length,
    understand: participants.filter(
      (participant) => participant.reaction === "understand",
    ).length,
    unsure: participants.filter(
      (participant) => participant.reaction === "unsure",
    ).length,
    question: participants.filter(
      (participant) => participant.reaction === "question",
    ).length,
    clusters,
  };
}
