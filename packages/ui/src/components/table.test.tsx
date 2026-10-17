import { afterEach, describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Table, TableBody, TableCell, TableRow } from "./table"

// jsdom has no layout, so overflow is simulated by overriding the two metrics
// the overflow hook measures.
function simulateWidths(scrollWidth: number, clientWidth: number) {
  for (const [prop, value] of [
    ["scrollWidth", scrollWidth],
    ["clientWidth", clientWidth],
  ] as const) {
    Object.defineProperty(HTMLDivElement.prototype, prop, {
      configurable: true,
      get: () => value,
    })
  }
}

function body() {
  return (
    <TableBody>
      <TableRow interactive={false}>
        <TableCell>Cell</TableCell>
      </TableRow>
    </TableBody>
  )
}

afterEach(() => {
  Reflect.deleteProperty(HTMLDivElement.prototype, "scrollWidth")
  Reflect.deleteProperty(HTMLDivElement.prototype, "clientWidth")
})

// Issue #857: a scroll container with no focusable content cannot be scrolled
// from the keyboard (axe `scrollable-region-focusable`).
describe("Table scroll container", () => {
  it("is not a tab stop while the table fits", () => {
    simulateWidths(400, 400)
    const { container } = render(<Table aria-label="Distributions">{body()}</Table>)

    const wrapper = container.querySelector('[data-slot="table-container"]')
    expect(wrapper).not.toHaveAttribute("tabindex")
    expect(wrapper).not.toHaveAttribute("role")
  })

  it("becomes a named, focusable region once it overflows", () => {
    simulateWidths(900, 400)
    render(<Table aria-label="Distributions">{body()}</Table>)

    const region = screen.getByRole("region", { name: "Distributions" })
    expect(region).toHaveAttribute("data-slot", "table-container")
    expect(region).toHaveAttribute("tabindex", "0")
  })

  it("supports aria-labelledby as the region's name", () => {
    simulateWidths(900, 400)
    render(
      <>
        <span id="dist-caption">Distribution history</span>
        <Table aria-labelledby="dist-caption">{body()}</Table>
      </>,
    )

    expect(
      screen.getByRole("region", { name: "Distribution history" }),
    ).toBeInTheDocument()
  })

  it("stays keyboard-reachable but unnamed when the table has no label", () => {
    simulateWidths(900, 400)
    const { container } = render(<Table>{body()}</Table>)

    const wrapper = container.querySelector('[data-slot="table-container"]')
    expect(wrapper).toHaveAttribute("tabindex", "0")
    // An anonymous region is worse than no region at all.
    expect(wrapper).not.toHaveAttribute("role")
  })
})
