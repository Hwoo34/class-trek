import { afterEach, describe, expect, it } from "vitest";
import { isTeacherAuthorized } from "@/lib/teacher-access";

const originalAccessCode = process.env.TEACHER_ACCESS_CODE;
const originalVercel = process.env.VERCEL;

afterEach(() => {
  if (originalAccessCode === undefined) {
    delete process.env.TEACHER_ACCESS_CODE;
  } else {
    process.env.TEACHER_ACCESS_CODE = originalAccessCode;
  }
  if (originalVercel === undefined) {
    delete process.env.VERCEL;
  } else {
    process.env.VERCEL = originalVercel;
  }
});

describe("teacher authorization", () => {
  it("fails closed on Vercel when no access code is configured", () => {
    process.env.VERCEL = "1";
    delete process.env.TEACHER_ACCESS_CODE;

    expect(isTeacherAuthorized(new Request("https://example.test"))).toBe(false);
  });

  it("requires an exact teacher access code", () => {
    process.env.TEACHER_ACCESS_CODE = "mission-control";

    const wrong = new Request("https://example.test", {
      headers: { "x-class-trek-teacher-access": "mission-contro1" },
    });
    const correct = new Request("https://example.test", {
      headers: { "x-class-trek-teacher-access": "mission-control" },
    });

    expect(isTeacherAuthorized(wrong)).toBe(false);
    expect(isTeacherAuthorized(correct)).toBe(true);
  });
});
