import { describe, expect, it } from "vitest";
import { derivePulse } from "@/lib/class-pulse";
import type { Participant, StudentResponse } from "@/lib/types";

const participants: Participant[] = [
  {
    id: "one",
    alias: "One",
    avatar: "O",
    reaction: "understand",
    connected: true,
    lastSeenAt: "2026-07-18T00:00:00.000Z",
  },
  {
    id: "two",
    alias: "Two",
    avatar: "T",
    reaction: "question",
    connected: true,
    lastSeenAt: "2026-07-18T00:00:00.000Z",
  },
];

function response(
  id: string,
  choice: string,
  safety: StudentResponse["safety"] = "safe",
): StudentResponse {
  return {
    id,
    participantId: id,
    alias: id,
    text: choice,
    choice,
    createdAt: "2026-07-18T00:00:00.000Z",
    safety,
    public: false,
  };
}

describe("derivePulse", () => {
  it("clusters safe choices and excludes blocked content", () => {
    const pulse = derivePulse(participants, [
      response("a", "Liquid water"),
      response("b", "Liquid water"),
      response("c", "Reliable energy"),
      response("d", "Blocked answer", "blocked"),
    ]);

    expect(pulse.responseCount).toBe(3);
    expect(pulse.understand).toBe(1);
    expect(pulse.question).toBe(1);
    expect(pulse.clusters[0]).toMatchObject({
      label: "Liquid water",
      count: 2,
    });
    expect(pulse.clusters.some((item) => item.label === "Blocked answer")).toBe(
      false,
    );
  });
});
