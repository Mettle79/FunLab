"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import CharacterSelector from "@/components/games-master/CharacterSelector"
import RingSelector from "@/components/games-master/RingSelector"
import GameCanvas from "@/components/games-master/GameCanvas"
import { Button } from "@/components/ui/button"

export default function GamesMaster() {
  const router = useRouter()
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
  const [showCompletion, setShowCompletion] = useState(false)

  const handleStartGame = () => {
    setIsGameStarted(true)
  }

  const handleStopGame = () => {
    setIsGameStarted(false)
  }

  const handleCompleteTask = () => {
    setShowCompletion(true)
  }

  if (showCompletion) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-l from-orange-500 to-orange-300">
        <div className="flex justify-end p-4">
          <Image
            src="/logo.png"
            alt="Stellar Elevate Logo"
            width={150}
            height={40}
            className="mr-4 rounded-lg"
          />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center p-8">
          <Card className="w-full max-w-2xl !bg-orange-50 p-8 text-center shadow-xl">
            <h1 className="mb-6 text-4xl font-bold text-gray-900">
              🎮 Game Design Mastered! 🎮
            </h1>
            <p className="mb-8 text-xl text-gray-700">
              You&apos;ve completed the Games Master challenge! You&apos;ve learned:
            </p>
            <ul className="mb-8 list-inside list-disc text-left text-lg text-gray-700">
              <li>How character selection affects gameplay experience</li>
              <li>The impact of game mechanics (ring placement and count)</li>
              <li>How visual effects can enhance game completion</li>
              <li>The importance of game design in user engagement</li>
            </ul>
            <Button 
              onClick={() => router.push('/python-wizard')}
              className="bg-orange-500 px-8 py-4 text-lg text-white hover:bg-orange-600"
            >
              Continue to Python Wizard Challenge
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-l from-orange-500 to-orange-300">
      {/* Logo in top right */}
      <div className="flex justify-end p-4">
        <Image
          src="/logo.png"
          alt="Stellar Elevate Logo"
          width={150}
          height={40}
          className="mr-4 rounded-lg"
        />
      </div>

      <div className="w-full max-w-7xl px-8 pt-2 pb-8">
        <h1 className="text-center text-3xl font-bold mb-8">
          <span className="rounded-lg bg-white px-4 py-2 shadow-sm">
            <span className="text-orange-500">Games</span>{" "}
            <span className="text-gray-900">Master</span>
          </span>
        </h1>
        
        <div className="bg-orange-600/90 rounded-xl p-6 shadow-lg mb-8 max-w-3xl mx-auto">
          <p className="text-center text-lg text-white">
            This page allows you to customize a game to help you experience how slight adjustments to functionality can radically alter the look and feel of a game. Try different characters, ring configurations, and completion effects to see how they change your gaming experience!
          </p>
        </div>
        
        <div className="flex gap-8">
          {/* Left side - Controls */}
          <div className="w-1/3 space-y-6">
            <CharacterSelector
              onCharacterSelect={setSelectedCharacter}
            />
            
            <RingSelector
              onRingConfigChange={setRingConfig}
            />

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Completion Effect</h2>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setCompletionEffect("gameOver")}
                  className={`px-4 py-2 rounded-lg ${
                    completionEffect === "gameOver"
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  }`}
                >
                  Game Over Effect
                </button>
                <button
                  onClick={() => setCompletionEffect("fireworks")}
                  className={`px-4 py-2 rounded-lg ${
                    completionEffect === "fireworks"
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  }`}
                >
                  Fireworks Effect
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Game Canvas and Controls */}
          <div className="flex-1 flex flex-col items-center">
            <div className="mb-4">
              <GameCanvas
                selectedCharacter={selectedCharacter}
                ringConfig={ringConfig}
                completionEffect={completionEffect}
                isGameStarted={isGameStarted}
              />
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={handleStartGame}
                  disabled={!selectedCharacter || isGameStarted}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-200 disabled:text-orange-400 disabled:cursor-not-allowed"
                >
                  Start Game
                </button>
                <button
                  onClick={handleStopGame}
                  disabled={!isGameStarted}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-200 disabled:text-orange-400 disabled:cursor-not-allowed"
                >
                  Stop Game
                </button>
              </div>
              <button
                onClick={handleCompleteTask}
                disabled={!isGameStarted}
                className="px-6 py-3 bg-orange-700 text-white rounded-lg hover:bg-orange-800 disabled:bg-orange-200 disabled:text-orange-400 disabled:cursor-not-allowed"
              >
                Complete Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 