import { describe, expect, it } from "vitest";
import { applyAction, getSession } from "@/lib/session-store";

describe("session store versions", () => {
  it("keeps the version monotonic across a demo reset", async () => {
    const initial = await getSession("MARS24");
    expect(initial).not.toBeNull();

    const changed = await applyAction("MARS24", {
      type: "set_status",
      status: "paused",
    });
    const reset = await applyAction("MARS24", { type: "reset_demo" });

    expect(reset.version).toBeGreaterThan(changed.version);
    expect(reset.currentScene.id).toBe("scene-arrival");
  });

  it("switches source-grounded journeys and preserves a resumable story", async () => {
    const mars = await applyAction("MARS24", { type: "reset_demo" });
    const reef = await applyAction("MARS24", {
      type: "select_journey",
      journeyId: "ocean",
    });

    expect(reef.journeyId).toBe("ocean");
    expect(reef.title).toBe("Reef Rescue");
    expect(reef.currentScene.visual).toBe("ocean");
    expect(reef.sources.every((source) => source.publisher.includes("NOAA"))).toBe(
      true,
    );
    expect(reef.version).toBeGreaterThan(mars.version);

    const savedMars = reef.journeyHistory.find(
      (item) => item.journeyId === "mars",
    );
    expect(savedMars).toBeDefined();

    const resumed = await applyAction("MARS24", {
      type: "resume_journey",
      historyId: savedMars?.id ?? "",
    });
    expect(resumed.journeyId).toBe("mars");
    expect(resumed.currentScene.id).toBe("scene-arrival");
    expect(resumed.version).toBeGreaterThan(reef.version);
  });
});
