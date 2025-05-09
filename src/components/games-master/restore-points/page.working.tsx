"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import GameCanvas from "@/components/games-master/GameCanvas"
import CharacterSelector from "@/components/games-master/CharacterSelector"

export default function GamesMaster() {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [gameKey, setGameKey] = useState(0)

  const handleCharacterSelect = (character: string) => {
    setSelectedCharacter(character)
  }

  const handleStartGame = () => {
    if (selectedCharacter) {
      setIsGameStarted(true)
      setGameKey(prev => prev + 1) // Force GameCanvas to remount
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-l from-orange-500 to-orange-300 p-8">
      <div className="mx-auto w-full max-w-6xl">
        <Card className="mb-8">
          <CardContent className="p-6">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Games Master Challenge
            </h1>
            <p className="text-lg text-gray-700">
              Control the cat with arrow keys and collect all the stars!
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <CharacterSelector onCharacterSelect={handleCharacterSelect} />
            <button
              onClick={handleStartGame}
              disabled={!selectedCharacter}
              className={`mt-4 px-6 py-2 rounded-lg text-white font-semibold ${
                selectedCharacter
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isGameStarted ? "Restart Game" : "Start Game"}
            </button>
          </div>
          
          <div className="aspect-square rounded-lg border-2 border-gray-300 bg-white">
            {isGameStarted ? (
              <GameCanvas key={gameKey} selectedCharacter={selectedCharacter!} />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                <p>Select a character and click Start Game to begin!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 