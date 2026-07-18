import { createHmac, timingSafeEqual } from "node:crypto";

export const teacherAccessHeader = "x-class-trek-teacher-access";
export const teacherSessionCookie = "class-trek-teacher-session";

function constantTimeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function isTeacherAuthorized(request: Request): boolean {
  const expected = process.env.TEACHER_ACCESS_CODE;

  // Local development remains zero-setup. Hosted environments fail closed.
  if (!expected) return !process.env.VERCEL;

  const supplied = request.headers.get(teacherAccessHeader);
  if (supplied && constantTimeEqual(supplied, expected)) return true;

  const session = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${teacherSessionCookie}=`))
    ?.slice(teacherSessionCookie.length + 1);
  const expectedSession = createTeacherSessionValue(expected);
  return Boolean(session && constantTimeEqual(session, expectedSession));
}

function createTeacherSessionValue(accessCode: string): string {
  return createHmac("sha256", accessCode)
    .update("class-trek-teacher-session-v1")
    .digest("base64url");
}

export function getTeacherSessionValue(): string | null {
  const accessCode = process.env.TEACHER_ACCESS_CODE;
  return accessCode ? createTeacherSessionValue(accessCode) : null;
}
