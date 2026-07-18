"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ClassroomSession, SessionAction } from "@/lib/types";

interface UseClassroomSession {
  session: ClassroomSession | null;
  loading: boolean;
  connected: boolean;
  error: string | null;
  send: (action: SessionAction) => Promise<ClassroomSession | null>;
}

export function useClassroomSession(code: string): UseClassroomSession {
  const [session, setSession] = useState<ClassroomSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSnapshot = useCallback(async () => {
    try {
      const response = await fetch(`/api/sessions/${code}`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Class session was not found.");
      setSession((await response.json()) as ClassroomSession);
      setError(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load the session.",
      );
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    // This effect intentionally synchronizes React with the authoritative server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchSnapshot();
    pollTimer.current = setInterval(() => void fetchSnapshot(), 800);
    const source = new EventSource(`/api/sessions/${code}`);

    source.addEventListener("open", () => {
      setConnected(true);
    });
    source.addEventListener("session", (event) => {
      const incoming = JSON.parse(event.data) as ClassroomSession;
      setSession((current) =>
        !current || incoming.version >= current.version ? incoming : current,
      );
      setConnected(true);
      setLoading(false);
    });
    source.addEventListener("error", () => {
      setConnected(false);
    });

    return () => {
      source.close();
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, [code, fetchSnapshot]);

  const send = useCallback(
    async (action: SessionAction) => {
      setError(null);
      try {
        const response = await fetch(`/api/sessions/${code}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(action),
        });
        const payload = (await response.json()) as
          | ClassroomSession
          | { error: string };
        if (!response.ok) {
          throw new Error("error" in payload ? payload.error : "Update failed");
        }
        const updated = payload as ClassroomSession;
        setSession(updated);
        return updated;
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to update the session.",
        );
        return null;
      }
    },
    [code],
  );

  return { session, loading, connected, error, send };
}
