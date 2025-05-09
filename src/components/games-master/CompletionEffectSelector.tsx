"use client"

import { useState } from "react"

type CompletionEffect = "gameOver" | "fireworks"
type CompletionEffectSelectorProps = {
  onEffectChange: (effect: CompletionEffect) => void
}

export default function CompletionEffectSelector({ onEffectChange }: CompletionEffectSelectorProps) {
  const [effect, setEffect] = useState<CompletionEffect>("gameOver")
  const [showGameOverCode, setShowGameOverCode] = useState(false)
  const [showFireworksCode, setShowFireworksCode] = useState(false)

  const handleEffectChange = (newEffect: CompletionEffect) => {
    setEffect(newEffect)
    onEffectChange(newEffect)
  }

  const getGameOverCode = () => {
    return `// Display game over message
const gameOverText = new PIXI.Text("Game Over!", {
  fontFamily: "Arial",
  fontSize: 36,
  fill: 0xff0000,
  align: "center"
})
gameOverText.anchor.set(0.5)
gameOverText.x = app.screen.width / 2
gameOverText.y = app.screen.height / 2
app.stage.addChild(gameOverText)`
  }

  const getFireworksCode = () => {
    return `// Create fireworks effect
const createFirework = (x: number, y: number) => {
  const particles = []
  for (let i = 0; i < 50; i++) {
    const particle = new PIXI.Graphics()
    particle.beginFill(Math.random() * 0xffffff)
    particle.drawCircle(0, 0, 2)
    particle.endFill()
    
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 5 + 2
    particle.vx = Math.cos(angle) * speed
    particle.vy = Math.sin(angle) * speed
    
    particle.x = x
    particle.y = y
    app.stage.addChild(particle)
    particles.push(particle)
  }
  
  return particles
}

// Launch multiple fireworks
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    const x = Math.random() * app.screen.width
    const y = Math.random() * app.screen.height
    const fireworks = createFirework(x, y)
    
    // Animate particles
    app.ticker.add(() => {
      fireworks.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.alpha -= 0.02
        
        if (particle.alpha <= 0) {
          app.stage.removeChild(particle)
        }
      })
    })
  }, i * 1000)
}`
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl font-bold">Completion Effect</h2>
      
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleEffectChange("gameOver")}
              className={`px-4 py-2 rounded-lg border-2 ${
                effect === "gameOver"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              Game Over
            </button>
            <button
              onClick={() => setShowGameOverCode(!showGameOverCode)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              {showGameOverCode ? "Hide Code" : "Show Code"}
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleEffectChange("fireworks")}
              className={`px-4 py-2 rounded-lg border-2 ${
                effect === "fireworks"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              Fireworks
            </button>
            <button
              onClick={() => setShowFireworksCode(!showFireworksCode)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              {showFireworksCode ? "Hide Code" : "Show Code"}
            </button>
          </div>
        </div>

        {(showGameOverCode || showFireworksCode) && (
          <div className="flex gap-4">
            {showGameOverCode && (
              <pre className="flex-1 p-4 bg-gray-100 rounded-lg text-sm overflow-x-auto">
                <code className="text-gray-800">
                  {getGameOverCode()}
                </code>
              </pre>
            )}
            {showFireworksCode && (
              <pre className="flex-1 p-4 bg-gray-100 rounded-lg text-sm overflow-x-auto">
                <code className="text-gray-800">
                  {getFireworksCode()}
                </code>
              </pre>
            )}
          </div>
        )}

        <div className="mt-2 text-sm text-gray-600">
          {effect === "gameOver" ? (
            <p>A "Game Over" message will be displayed when all rings are collected.</p>
          ) : (
            <p>A fireworks display will appear when all rings are collected.</p>
          )}
        </div>
      </div>
    </div>
  )
} 