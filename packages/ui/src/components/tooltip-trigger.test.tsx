import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Button } from "./button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

// Issue #853: Base UI's TooltipTrigger renders its own <button>. Passing a
// Button as a *child* produced <button><button>…</button></button>, which is
// invalid HTML (hydration mismatch) and an axe `nested-interactive`
// violation. A custom element has to go through the `render` prop instead.
describe("TooltipTrigger render prop", () => {
  it("renders the custom element as the trigger, not inside one", () => {
    const { container } = render(
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
        <TooltipContent>Tip</TooltipContent>
      </Tooltip>,
    )

    const buttons = container.querySelectorAll("button")
    expect(buttons).toHaveLength(1)
    expect(buttons[0]).toHaveAttribute("data-slot", "tooltip-trigger")
    expect(screen.getByRole("button", { name: "Hover me" })).toBeInTheDocument()
  })

  it("never nests an interactive element inside the trigger", () => {
    const { container } = render(
      <Tooltip>
        <TooltipTrigger render={<Button>Open</Button>} />
        <TooltipContent>Tip</TooltipContent>
      </Tooltip>,
    )

    const trigger = container.querySelector('[data-slot="tooltip-trigger"]')
    expect(trigger).not.toBeNull()
    expect(
      trigger?.querySelectorAll("button, a[href], input, select, textarea"),
    ).toHaveLength(0)
  })
})
