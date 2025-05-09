"use client"

import { useState } from "react"

type RingPlacement = "static" | "random"
type RingSelectorProps = {
  onRingConfigChange: (config: { placement: RingPlacement; count: number }) => void
}

export default function RingSelector({ onRingConfigChange }: RingSelectorProps) {
  const [placement, setPlacement] = useState<RingPlacement>("static")
  const [count, setCount] = useState<number>(5)
  const [showStaticCode, setShowStaticCode] = useState(false)
  const [showRandomCode, setShowRandomCode] = useState(false)

  const handlePlacementChange = (newPlacement: RingPlacement) => {
    setPlacement(newPlacement)
    onRingConfigChange({ placement: newPlacement, count })
  }

  const handleCountChange = (newCount: number) => {
    setCount(newCount)
    onRingConfigChange({ placement, count: newCount })
  }

  const getStaticCode = () => {
    return `// Place rings in fixed positions around the canvas
const angle = (i / ringConfig.count) * Math.PI * 2
const radius = Math.min(app.screen.width, app.screen.height) * 0.4
ring.x = app.screen.width / 2 + Math.cos(angle) * radius
ring.y = app.screen.height / 2 + Math.sin(angle) * radius`
  }

  const getRandomCode = () => {
    return `// Place rings randomly within the canvas
ring.x = Math.random() * (app.screen.width - 40) + 20
ring.y = Math.random() * (app.screen.height - 40) + 20`
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl font-bold">Ring Configuration</h2>
      
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-2">
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
              onClick={() => setShowStaticCode(!showStaticCode)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              {showStaticCode ? "Hide Static Code" : "Show Static Code"}
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
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
            <button
              onClick={() => setShowRandomCode(!showRandomCode)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              {showRandomCode ? "Hide Random Code" : "Show Random Code"}
            </button>
          </div>
        </div>

        {(showStaticCode || showRandomCode) && (
          <div className="flex gap-4">
            {showStaticCode && (
              <pre className="flex-1 p-4 bg-gray-100 rounded-lg text-sm overflow-x-auto">
                <code className="text-gray-800">
                  {getStaticCode()}
                </code>
              </pre>
            )}
            {showRandomCode && (
              <pre className="flex-1 p-4 bg-gray-100 rounded-lg text-sm overflow-x-auto">
                <code className="text-gray-800">
                  {getRandomCode()}
                </code>
              </pre>
            )}
          </div>
        )}

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