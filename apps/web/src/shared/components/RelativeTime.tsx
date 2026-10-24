import { useLiveRelativeTime } from "@/shared/hooks/useLiveRelativeTime"

type Props = {
  value: Date | string | number | null | undefined
  className?: string
  tick?: "second" | "minute" | "hour"
  locale?: string
  numeric?: "always" | "auto"
}

/** Accessible, self-updating relative timestamp for activity and trade data. */
export function RelativeTime({ value, className, tick, locale, numeric = "auto" }: Props) {
  const label = useLiveRelativeTime(value, { tick, locale, numeric })
  const date = value == null ? null : new Date(value)

  return (
    <time className={className} dateTime={date && !Number.isNaN(date.getTime()) ? date.toISOString() : undefined}>
      {label}
    </time>
  )
}

