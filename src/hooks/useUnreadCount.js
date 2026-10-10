import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

/**
 * Fetches the count of unread contact messages.
 * Re-polls every `pollMs` milliseconds (default 30s).
 * Fails silently if user is not logged in.
 */
export default function useUnreadCount(pollMs = 30000) {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/contact/unread-count");
      setCount(data?.count ?? 0);
    } catch {
      setCount(0);
    }
  }, []);

  useEffect(() => {
    refresh();
    if (!pollMs) return;
    const id = setInterval(refresh, pollMs);
    return () => clearInterval(id);
  }, [refresh, pollMs]);

  return { count, refresh };
}