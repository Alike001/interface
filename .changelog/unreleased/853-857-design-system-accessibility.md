---
type: fixed
area: docs
pr: 853
breaking: false
---

The component gallery no longer nests a button inside the tooltip trigger's own button, which caused a hydration error and an axe `nested-interactive` violation; the `render` pattern it should have used is now documented in the `@workspace/ui` docs. The gallery's slider, progress examples and scroll areas, and the design-system page's theme and viewport pickers, all have accessible names.
