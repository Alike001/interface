import { cn } from "../lib/utils"

export type LiveIndicatorStatus = "connected" | "connecting" | "polling" | "disconnected" | "error"

const statuses = {
  connected: { label: "Live", tone: "text-success", dot: "bg-success", pulse: true },
  connecting: { label: "Connecting…", tone: "text-warning", dot: "bg-warning", pulse: true },
  polling: { label: "Polling (Fallback)", tone: "text-warning", dot: "bg-warning", pulse: false },
  disconnected: { label: "Disconnected", tone: "text-destructive", dot: "bg-destructive", pulse: false },
  error: { label: "Disconnected", tone: "text-destructive", dot: "bg-destructive", pulse: false },
} as const

export function LiveIndicator({ status, className }: { status: LiveIndicatorStatus; className?: string }) {
  const { label, tone, dot, pulse } = statuses[status]
  return (
    <span role="status" aria-label={label} className={cn("inline-flex items-center gap-1 font-mono text-xs", tone, className)}>
      <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", dot, pulse && "motion-safe:animate-pulse")} />
      {label}
    </span>
  )
}
