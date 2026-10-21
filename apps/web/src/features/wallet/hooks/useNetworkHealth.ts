import { useEffect, useState } from "react"
import { useNetwork } from "./useNetwork"
import { useWalletStore } from "../store/wallet-store"

export type NetworkHealthStatus = "healthy" | "offline" | "mismatch" | "disconnected"

export function useNetworkHealth() {
  const { mismatch, displayLabel } = useNetwork()
  const walletStatus = useWalletStore((state) => state.status)
  const [online, setOnline] = useState(() => typeof navigator === "undefined" || navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const status: NetworkHealthStatus = !online
    ? "offline"
    : walletStatus !== "connected"
      ? "disconnected"
      : mismatch
        ? "mismatch"
        : "healthy"

  const message = status === "offline"
    ? "Your browser is offline"
    : status === "mismatch"
      ? `Wallet network (${displayLabel}) does not match the selected network`
      : status === "disconnected"
        ? "Connect a wallet to verify network health"
        : `Connected to ${displayLabel}`

  return { status, message, online, displayLabel, isHealthy: status === "healthy" }
}

