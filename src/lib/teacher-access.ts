import { timingSafeEqual } from "node:crypto";

export const teacherAccessHeader = "x-class-trek-teacher-access";

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
  return Boolean(supplied && constantTimeEqual(supplied, expected));
}
