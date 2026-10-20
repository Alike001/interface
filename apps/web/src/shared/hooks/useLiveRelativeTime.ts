import { useEffect, useState } from "react"
import { formatRelativeTime } from "@/shared/lib/format"

export type RelativeTimeTick = "second" | "minute" | "hour"

const TICK_MS: Record<RelativeTimeTick, number> = {
  second: 1_000,
  minute: 60_000,
  hour: 3_600_000,
}

/**
 * Keeps a relative timestamp current without making every consumer implement
 * its own interval. The timer is stopped when the tab is hidden and restarted
 * when it becomes visible again so background tabs do not waste work.
 */
export function useLiveRelativeTime(
  value: Date | string | number | null | undefined,
  options?: { tick?: RelativeTimeTick; locale?: string; numeric?: "always" | "auto" },
): string {
  const tick = options?.tick ?? "minute"
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const update = () => setNow(Date.now())
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") update()
    }
    const timer = window.setInterval(update, TICK_MS[tick])
    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [tick])

  // `now` intentionally participates in rendering; it makes the timestamp
  // refresh even when the source value itself has not changed.
  void now
  return formatRelativeTime(value, options)
}

