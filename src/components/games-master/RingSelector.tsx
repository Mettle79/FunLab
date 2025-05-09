"use client"

import { useState } from "react"

type RingPlacement = "static" | "random"
type RingSelectorProps = {
  onRingConfigChange: (config: { placement: RingPlacement; count: number }) => void
}

export default function RingSelector({ onRingConfigChange }: RingSelectorProps) {
  const [placement, setPlacement] = useState<RingPlacement>("static")
  const [count, setCount] = useState<number>(5)

  const handlePlacementChange = (newPlacement: RingPlacement) => {
    setPlacement(newPlacement)
    onRingConfigChange({ placement: newPlacement, count })
  }

  const handleCountChange = (newCount: number) => {
    setCount(newCount)
    onRingConfigChange({ placement, count: newCount })
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl font-bold">Ring Configuration</h2>
      
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <button
            onClick={() => handlePlacementChange("static")}
            className={`px-4 py-2 rounded-lg border-2 ${
              placement === "static"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            Static Placement
          </button>

          <button
            onClick={() => handlePlacementChange("random")}
            className={`px-4 py-2 rounded-lg border-2 ${
              placement === "random"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            Random Placement
          </button>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-gray-700">Number of Rings:</label>
          <input
            type="range"
            min="1"
            max="10"
            value={count}
            onChange={(e) => handleCountChange(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-gray-700">{count}</span>
        </div>

        <div className="mt-2 text-sm text-gray-600">
          {placement === "static" ? (
            <p>Rings will be placed in fixed positions around the game area.</p>
          ) : (
            <p>Rings will be placed randomly within the game area.</p>
          )}
        </div>
      </div>
    </div>
  )
} 