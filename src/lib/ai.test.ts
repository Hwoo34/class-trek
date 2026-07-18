import { describe, expect, it } from "vitest";
import { zodTextFormat } from "openai/helpers/zod";
import { suggestedSceneValidation } from "@/lib/ai";

describe("OpenAI scene schema", () => {
  it("emits a supported fixed-length string array for choices", () => {
    const format = zodTextFormat(
      suggestedSceneValidation,
      "next_classroom_scene",
    );

    expect(format.schema.properties?.choices).toMatchObject({
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { type: "string" },
    });
    expect(
      Array.isArray(format.schema.properties?.choices?.items),
    ).toBe(false);
  });
});
