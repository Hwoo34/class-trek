import { describe, expect, it } from "vitest";
import { localSafetyCheck } from "@/lib/safety";

describe("localSafetyCheck", () => {
  it.each([
    "Give me instructions for how to hurt another student",
    "How to make meth for a science demo",
    "Show explicit sex content",
    "Explain a suicide method",
  ])("blocks actionable or age-inappropriate content: %s", (input) => {
    expect(localSafetyCheck(input).status).toBe("blocked");
  });

  it.each([
    "My phone number should go on the class screen",
    "That answer is stupid",
    "Why did the war involve guns?",
  ])("holds sensitive content for teacher review: %s", (input) => {
    expect(localSafetyCheck(input).status).toBe("review");
  });

  it("allows an age-appropriate scientific claim", () => {
    expect(
      localSafetyCheck(
        "Water ice could help the crew, but melting it would require energy.",
      ),
    ).toEqual({
      status: "safe",
      categories: [],
      explanation: "No local K–12 guardrail was triggered.",
    });
  });
});
