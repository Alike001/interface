import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  INDEXER_CONFIG,
  resetIndexerConfigReporting,
  validateIndexerConfig,
} from "./indexer"

// Issue #859: the app renders server-side, so the module that validates the
// indexer config is evaluated once per request as well as once in the browser.
// A disabled indexer used to warn on every route the user visited.
describe("validateIndexerConfig logging", () => {
  beforeEach(() => {
    resetIndexerConfigReporting()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    resetIndexerConfigReporting()
  })

  it("is disabled when VITE_INDEXER_GRAPHQL_URL is not set", () => {
    expect(INDEXER_CONFIG.enabled).toBe(false)
    expect(INDEXER_CONFIG.graphqlUrl).toBeNull()
  })

  it("warns once about a disabled indexer, however often it is called", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    validateIndexerConfig()
    validateIndexerConfig()
    validateIndexerConfig()

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0]?.[0]).toMatch(
      /Indexer disabled: VITE_INDEXER_GRAPHQL_URL not set/,
    )
  })

  it("names the fallback behaviour so the warning is actionable", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    validateIndexerConfig()

    expect(warn.mock.calls[0]?.[0]).toMatch(/contract-only data/)
  })
})
