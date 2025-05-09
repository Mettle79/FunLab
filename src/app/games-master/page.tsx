"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import CharacterSelector from "@/components/games-master/CharacterSelector"
import RingSelector from "@/components/games-master/RingSelector"
import CompletionEffectSelector from "@/components/games-master/CompletionEffectSelector"
import GameCanvas from "@/components/games-master/GameCanvas"

export default function GamesMaster() {
  const [selectedCharacter, setSelectedCharacter] = useState<string>("")
  const [ringConfig, setRingConfig] = useState<{
    placement: "static" | "random"
    count: number
  }>({
    placement: "static",
    count: 5
  })
  const [completionEffect, setCompletionEffect] = useState<"gameOver" | "fireworks">("gameOver")
  const [isGameStarted, setIsGameStarted] = useState(false)

  const handleStartGame = () => {
    setIsGameStarted(true)
  }

  const handleStopGame = () => {
    setIsGameStarted(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-center">Games Master</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CharacterSelector
            onCharacterSelect={setSelectedCharacter}
          />
          
          <RingSelector
            onRingConfigChange={setRingConfig}
          />
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setCompletionEffect("gameOver")}
            className={`px-4 py-2 rounded ${
              completionEffect === "gameOver"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Game Over Effect
          </button>
          <button
            onClick={() => setCompletionEffect("fireworks")}
            className={`px-4 py-2 rounded ${
              completionEffect === "fireworks"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Fireworks Effect
          </button>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStartGame}
            disabled={!selectedCharacter || isGameStarted}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Start Game
          </button>
          <button
            onClick={handleStopGame}
            disabled={!isGameStarted}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Stop Game
          </button>
        </div>

        <div className="flex justify-center">
          <GameCanvas
            selectedCharacter={selectedCharacter}
            ringConfig={ringConfig}
            completionEffect={completionEffect}
            isGameStarted={isGameStarted}
          />
        </div>
      </div>
    </div>
  )
} 