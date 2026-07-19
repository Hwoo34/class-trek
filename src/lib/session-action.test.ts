import { describe, expect, it } from "vitest";
import { parseSessionAction, teacherActionTypes } from "@/lib/session-action";

describe("classroom action validation", () => {
  it("accepts bounded student input", () => {
    expect(
      parseSessionAction({
        type: "respond",
        participantId: "student-1",
        text: "Energy keeps the habitat warm.",
        choice: "Reliable energy",
      }),
    ).toMatchObject({ type: "respond", participantId: "student-1" });
  });

  it("rejects unknown actions and oversized input", () => {
    expect(() => parseSessionAction({ type: "delete_everything" })).toThrow();
    expect(() =>
      parseSessionAction({
        type: "respond",
        participantId: "student-1",
        text: "x".repeat(321),
      }),
    ).toThrow();
  });

  it("classifies every model-spending action as teacher-only", () => {
    expect(teacherActionTypes.has("generate_suggestion")).toBe(true);
  });

  it("keeps journey selection and resume teacher-only", () => {
    expect(
      parseSessionAction({
        type: "select_journey",
        journeyId: "ocean",
      }),
    ).toEqual({ type: "select_journey", journeyId: "ocean" });
    expect(teacherActionTypes.has("select_journey")).toBe(true);
    expect(teacherActionTypes.has("resume_journey")).toBe(true);
  });
});
