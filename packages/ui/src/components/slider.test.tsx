import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import { Slider } from "./slider"

describe("Slider accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Slider defaultValue={[50]} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup()
    const { container } = render(<Slider defaultValue={[50]} min={0} max={100} />)

    // Base UI renders the accessible control as a visually hidden range input
    const slider = container.querySelector("input[type='range']")
    expect(slider).toHaveAttribute("min", "0")
    expect(slider).toHaveAttribute("max", "100")
    expect(slider).toHaveAttribute("aria-valuenow")
  })
})

// Issue #857: the control a person actually operates is the `<input
// type="range">` Base UI nests inside the thumb. `aria-label` on the root only
// names the surrounding `role="group"`, so without forwarding the input stays
// anonymous (axe `label`).
describe("Slider labelling", () => {
  it("names the range input from aria-label", () => {
    const { container } = render(<Slider defaultValue={[50]} aria-label="Leverage" />)

    const input = container.querySelector("input[type='range']")
    expect(input).toHaveAttribute("aria-label", "Leverage")
  })

  it("names the range input from aria-labelledby", () => {
    const { container } = render(
      <>
        <span id="slider-label">Example value</span>
        <Slider defaultValue={[50]} aria-labelledby="slider-label" />
      </>,
    )

    const input = container.querySelector("input[type='range']")
    expect(input).toHaveAttribute("aria-labelledby", "slider-label")
  })

  it("names every thumb of a range slider", () => {
    const { container } = render(
      <Slider defaultValue={[20, 80]} aria-label="Price range" />,
    )

    const inputs = container.querySelectorAll("input[type='range']")
    expect(inputs).toHaveLength(2)
    for (const input of inputs) {
      expect(input).toHaveAttribute("aria-label", "Price range")
    }
  })
})
