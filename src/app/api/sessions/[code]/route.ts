import { NextResponse } from "next/server";
import { applyAction, getSession, subscribe } from "@/lib/session-store";
import type { SessionAction } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    const action = (await request.json()) as SessionAction;
    const session = await applyAction(code, action);
    return NextResponse.json(session);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update the session";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
