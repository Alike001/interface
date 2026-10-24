import { Button } from "@workspace/ui/components/button"
import { EmptyState } from "@workspace/ui/components/empty-state"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Text } from "@workspace/ui/components/text"
import { cn } from "@workspace/ui/lib/utils"

/**
 * List and table state treatments.
 *
 * `EmptyState` lives in `empty-state.tsx` — the single empty-state primitive.
 * It is re-exported here so existing imports from
 * `@workspace/ui/components/states` keep working.
 */

/**
 * Skeleton placeholder for a list or table body.
 *
 * Announces itself through an `sr-only` status message so screen-reader users
 * are told content is loading instead of hearing nothing.
 */
function LoadingState({
  rows = 3,
  label = "Loading…",
  rowClassName,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  rows?: number
  label?: string
  rowClassName?: string
}) {
  return (
    <div
      data-slot="loading-state"
      role="status"
      aria-live="polite"
      className={cn("space-y-2 p-4", className)}
      {...props}
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className={cn("h-10 w-full", rowClassName)} />
      ))}
    </div>
  )
}

type ErrorStateProps = React.ComponentProps<"div"> & {
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
}

function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  retryLabel = "Try again",
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      data-slot="error-state"
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-4 py-12 text-center",
        className
      )}
      {...props}
    >
      <div>
        <Text size="base" weight="medium" tone="danger">
          {title}
        </Text>
        {description && (
          <Text size="sm" tone="muted" className="mt-0.5">
            {description}
          </Text>
        )}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

export { LoadingState, EmptyState, ErrorState }
