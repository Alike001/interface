# Live feed indicator

Use `LiveIndicator` from `@workspace/ui/components/live-indicator` for realtime connection state in market panels, rather than hardcoding color classes.

- `connected`: success token; “Live”; pulse when motion is permitted.
- `connecting`: warning token; “Connecting…”; pulse when motion is permitted.
- `polling`: warning token; “Polling (Fallback)”; no pulse.
- `disconnected` / `error`: destructive token; “Disconnected”; no pulse.

The status element has an accessible label and the decorative dot is hidden from assistive technology. Colors inherit design-system tokens across light and dark themes.
