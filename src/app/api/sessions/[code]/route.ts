import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  enforceRateLimit,
  RateLimitError,
  requestFingerprint,
} from "@/lib/rate-limit";
import {
  parseSessionAction,
  teacherActionTypes,
} from "@/lib/session-action";
import { applyAction, getSession, subscribe } from "@/lib/session-store";
import { isTeacherAuthorized } from "@/lib/teacher-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface RouteContext {
  params: Promise<{ code: string }>;
}

export async function GET(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const { code } = await context.params;
  const session = await getSession(code);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (request.headers.get("accept")?.includes("text/event-stream")) {
    const encoder = new TextEncoder();
    let unsubscribe = () => {};
    let heartbeat: ReturnType<typeof setInterval> | undefined;

    const stream = new ReadableStream({
      start(controller) {
        const send = (event: string, data: unknown) => {
          controller.enqueue(
            encoder.encode(
              `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
            ),
          );
        };

        send("session", session);
        unsubscribe = subscribe(code, (updated) => send("session", updated));
        heartbeat = setInterval(() => send("ping", { at: Date.now() }), 15_000);

        request.signal.addEventListener("abort", () => {
          unsubscribe();
          if (heartbeat) clearInterval(heartbeat);
          try {
            controller.close();
          } catch {
            // The runtime may close the stream first.
          }
        });
      },
      cancel() {
        unsubscribe();
        if (heartbeat) clearInterval(heartbeat);
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  }

  return NextResponse.json(session, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { code } = await context.params;
  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > 16_384) {
      return NextResponse.json(
        { error: "Request body is too large" },
        { status: 413 },
      );
    }

    const fingerprint = requestFingerprint(request);
    await enforceRateLimit(`post:${fingerprint}`, 60, 60);

    const body = (await request.json()) as unknown;
    if (
      typeof body === "object" &&
      body !== null &&
      "type" in body &&
      body.type === "verify_teacher_access"
    ) {
      await enforceRateLimit(`teacher-auth:${fingerprint}`, 8, 15 * 60);
      if (!isTeacherAuthorized(request)) {
        return NextResponse.json(
          { error: "Teacher access code is incorrect" },
          { status: 401 },
        );
      }
      return NextResponse.json({ authorized: true });
    }

    const action = parseSessionAction(body);
    if (teacherActionTypes.has(action.type)) {
      if (!isTeacherAuthorized(request)) {
        return NextResponse.json(
          { error: "Teacher authorization is required" },
          { status: 401 },
        );
      }
      await enforceRateLimit(`teacher:${fingerprint}`, 30, 10 * 60);
    }

    if (action.type === "join") {
      await enforceRateLimit(`join:${fingerprint}`, 12, 10 * 60);
    }
    if (action.type === "respond") {
      await enforceRateLimit(`respond:${fingerprint}`, 8, 10 * 60);
    }
    if (action.type === "generate_suggestion") {
      await enforceRateLimit(`generate:${fingerprint}`, 4, 10 * 60);
      await enforceRateLimit("generate:global", 20, 24 * 60 * 60);
    }

    const session = await applyAction(code, action);
    return NextResponse.json(session);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { error: error.message },
        {
          status: 429,
          headers: { "Retry-After": String(error.retryAfterSeconds) },
        },
      );
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid classroom action" },
        { status: 400 },
      );
    }
    const message =
      error instanceof Error ? error.message : "Unable to update the session";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
