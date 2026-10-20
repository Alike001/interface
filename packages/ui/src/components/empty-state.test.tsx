import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { axe } from "vitest-axe"

import { EmptyState } from "./empty-state"
import { EmptyState as StatesEmptyState } from "./states"

describe("EmptyState", () => {
  it("renders the canonical slot and default variant", () => {
    const { container } = render(<EmptyState title="No data yet" />)

    const root = container.querySelector("[data-slot='empty-state']")
    expect(root).toHaveAttribute("data-variant", "compact")
  })

  it("renders title, description and actions", () => {
    render(
      <EmptyState
        title="No deposits"
        description="Start earning by depositing."
        actions={{
          primary: <button type="button">Browse pools</button>,
          secondary: <a href="/docs">Learn more</a>,
        }}
      />
    )

    expect(screen.getByText("No deposits")).toBeInTheDocument()
    expect(screen.getByText("Start earning by depositing.")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Browse pools" })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Learn more" })).toBeInTheDocument()
  })

  it("supports the deprecated singular action prop from states.tsx", () => {
    render(
      <EmptyState
        title="No deposits"
        action={<button type="button">Browse pools</button>}
      />
    )

    expect(
      screen.getByRole("button", { name: "Browse pools" })
    ).toBeInTheDocument()
  })

  it("does not render an action slot without actions", () => {
    const { container } = render(<EmptyState title="Nothing here" />)

    expect(
      container.querySelector("[data-slot='empty-state-actions']")
    ).toBeNull()
  })

  it("hides the icon wrapper from assistive technology", () => {
    const { container } = render(
      <EmptyState
        icon={<svg data-testid="empty-icon" aria-hidden="true" />}
        title="Nothing here"
      />
    )

    expect(screen.getByTestId("empty-icon")).toBeInTheDocument()
    expect(container.querySelector("[aria-hidden='true']")).not.toBeNull()
  })

  it("merges caller classes onto the root", () => {
    const { container } = render(
      <EmptyState className="py-10" title="Nothing here" />
    )

    expect(container.querySelector("[data-slot='empty-state']")).toHaveClass(
      "py-10"
    )
  })

  it("is the same component that states.tsx re-exports", () => {
    expect(StatesEmptyState).toBe(EmptyState)
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <EmptyState
        title="No deposits"
        description="Start earning by depositing."
        actions={{ primary: <button type="button">Browse pools</button> }}
      />
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})
