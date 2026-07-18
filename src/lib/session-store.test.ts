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
});
