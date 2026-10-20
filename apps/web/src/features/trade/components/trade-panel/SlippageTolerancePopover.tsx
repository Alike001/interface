"use client"

import { useState } from "react"

import { Popover, PopoverContent, PopoverTrigger, PopoverTitle, PopoverDescription } from "@workspace/ui/components/popover"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Kbd } from "@workspace/ui/components/kbd"

const PRESETS: ReadonlyArray<number> = [0.1, 0.5, 1]

type SlippageTolerancePopoverProps = {
  slippagePct: number
  onSlippageChange: (value: number) => void
}

export function SlippageTolerancePopover({ slippagePct, onSlippageChange }: SlippageTolerancePopoverProps) {
  const [open, setOpen] = useState(false)
  const [customValue, setCustomValue] = useState(String(slippagePct))

  function handlePreset(value: number) {
    onSlippageChange(value)
    setCustomValue(String(value))
    setOpen(false)
  }

  function handleCustomChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCustomValue(e.target.value)
  }

  function handleCustomSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const value = Number(customValue)
    if (Number.isFinite(value) && value >= 0 && value <= 10) {
      onSlippageChange(value)
      setCustomValue(String(value))
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="w-auto min-w-[86px] text-xs"
        >
          Slippage <span className="font-medium">{slippagePct}%</span>
          <Kbd className="ml-1 size-2.5">▾</Kbd>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[252px] p-3">
        <PopoverTitle>Slippage tolerance</PopoverTitle>
        <PopoverDescription>
          Maximum allowable price movement before the order reverts.
        </PopoverDescription>
        <form onSubmit={handleCustomSubmit} className="mt-3 space-y-3">
          <div className="grid grid-cols-3 gap-1">
            {PRESETS.map((value) => (
              <Button
                key={value}
                type="button"
                variant={slippagePct === value ? "default" : "outline"}
                size="sm"
                onClick={() => handlePreset(value)}
                className="text-xs"
              >
                {value}%
              </Button>
            ))}
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground block">Custom</label>
            <Input
              type="text"
              inputMode="decimal"
              value={customValue}
              onChange={handleCustomChange}
              placeholder="0.3"
              className="text-xs font-mono"
            />
          </div>
          {slippagePct > 1 && (
            <p className="mt-1 text-xs text-red-500">
              High slippage may result in worse fill prices.
            </p>
          )}
          <button type="submit" className="sr-only" aria-hidden="true" />
        </form>
      </PopoverContent>
    </Popover>
  )
}
