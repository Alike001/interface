import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { LiveIndicator } from "./live-indicator"

describe("LiveIndicator", () => {
  it.each([
    ["connected", "Live"],
    ["connecting", "Connecting…"],
    ["polling", "Polling (Fallback)"],
    ["disconnected", "Disconnected"],
    ["error", "Disconnected"],
  ] as const)("renders accessible status for %s", (status, label) => {
    render(<LiveIndicator status={status} />)
    expect(screen.getByRole("status", { name: label })).toBeInTheDocument()
  })
  it("uses semantic color tokens and reduced-motion-safe animation", () => {
    const { container } = render(<LiveIndicator status="connected" />)
    expect(container.firstElementChild).toHaveClass("text-success")
    expect(container.querySelector("[aria-hidden=true]")).toHaveClass("bg-success", "motion-safe:animate-pulse")
  })
})
