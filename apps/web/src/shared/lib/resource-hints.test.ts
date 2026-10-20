import { describe, expect, it } from "vitest"
import { buildResourceHints, originOf } from "./resource-hints"

describe("originOf", () => {
  it("returns the origin of absolute http(s) URLs", () => {
    expect(originOf("https://rpc.example.org/soroban?x=1")).toBe("https://rpc.example.org")
  })

  it("ignores same-origin paths and non-http schemes", () => {
    expect(originOf("/api/pyth")).toBeUndefined()
    expect(originOf("wss://stream.binance.com:9443/ws")).toBeUndefined()
    expect(originOf("")).toBeUndefined()
  })
})

describe("buildResourceHints", () => {
  const sources = {
    rpcUrl: "https://rpc.example.org/path",
    horizonUrl: "https://horizon.stellar.org",
    pythHermesUrl: "https://hermes.pyth.network",
  }

  it("preconnects RPC and Horizon, and dns-prefetches the route-specific origins", () => {
    expect(buildResourceHints(sources)).toEqual([
      { rel: "preconnect", href: "https://rpc.example.org", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://horizon.stellar.org", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://hermes.pyth.network" },
      { rel: "dns-prefetch", href: "https://api.binance.com" },
      { rel: "dns-prefetch", href: "https://stream.binance.com" },
    ])
  })

  it("skips a relative Pyth proxy path and de-duplicates shared origins", () => {
    const hints = buildResourceHints({
      rpcUrl: "https://shared.example.org/rpc",
      horizonUrl: "https://shared.example.org/horizon",
      pythHermesUrl: "/api/pyth",
    })
    expect(hints.filter((h) => h.href === "https://shared.example.org")).toHaveLength(1)
    expect(hints.some((h) => h.href.includes("pyth"))).toBe(false)
  })
})
