"use client"

import { useEffect, useRef } from "react"
import * as PIXI from "pixi.js"

type GameCanvasProps = {
  selectedCharacter: string
}

export default function GameCanvas({ selectedCharacter }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const appRef = useRef<PIXI.Application | null>(null)
  const catRef = useRef<PIXI.Sprite | null>(null)
  const keysRef = useRef<{ [key: string]: boolean }>({})

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.startsWith('Arrow')) {
        e.preventDefault()
        keysRef.current[e.key] = true
        console.log('Key pressed:', e.key)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.startsWith('Arrow')) {
        e.preventDefault()
        keysRef.current[e.key] = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let app: PIXI.Application | null = null

    const initApp = async () => {
      try {
        app = new PIXI.Application()
        await app.init({
          canvas: canvas,
          width: 400,
          height: 400,
          backgroundColor: 0xffffff,
          antialias: true,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true
        })

        console.log('PixiJS initialized')
        appRef.current = app

        // Create a container for the character
        const characterContainer = new PIXI.Container()
        characterContainer.x = app.screen.width / 2
        characterContainer.y = app.screen.height / 2
        app.stage.addChild(characterContainer)

        // Load and display the selected character
        try {
          const texture = await PIXI.Assets.load(`/sprites/${selectedCharacter}.png`)
          console.log('Character texture loaded:', selectedCharacter)
          const character = new PIXI.Sprite(texture)
          character.anchor.set(0.5)
          character.scale.set(0.1)
          characterContainer.addChild(character)
          catRef.current = character
          console.log('Character sprite added to stage')
        } catch (error) {
          console.error('Error loading character texture:', error)
          // Create a fallback sprite using a texture from a graphics object
          const graphics = new PIXI.Graphics()
          graphics.beginFill(0xFF0000)
          graphics.drawCircle(0, 0, 25)
          graphics.endFill()
          
          const texture = app.renderer.generateTexture(graphics)
          const character = new PIXI.Sprite(texture)
          character.anchor.set(0.5)
          characterContainer.addChild(character)
          catRef.current = character
          console.log('Fallback character sprite created')
        }

        // Add game loop for movement
        let frameCount = 0
        const gameLoop = () => {
          frameCount++
          if (frameCount % 60 === 0) {
            console.log('Game loop running, frame:', frameCount)
          }

          const character = catRef.current
          if (!character || !app) {
            console.log('Missing character or app:', { character: !!character, app: !!app })
            return
          }

          const speed = 2
          const keys = keysRef.current

          // Store previous position
          const prevX = characterContainer.x
          const prevY = characterContainer.y

          // Update position based on key presses with boundary checking
          if (keys['ArrowUp']) {
            const newY = characterContainer.y - speed
            if (newY >= 0) {
              characterContainer.y = newY
              console.log('Moving up:', characterContainer.y)
            }
          }
          if (keys['ArrowDown']) {
            const newY = characterContainer.y + speed
            if (newY <= app.screen.height) {
              characterContainer.y = newY
              console.log('Moving down:', characterContainer.y)
            }
          }
          if (keys['ArrowLeft']) {
            const newX = characterContainer.x - speed
            if (newX >= 0) {
              characterContainer.x = newX
              console.log('Moving left:', characterContainer.x)
            }
          }
          if (keys['ArrowRight']) {
            const newX = characterContainer.x + speed
            if (newX <= app.screen.width) {
              characterContainer.x = newX
              console.log('Moving right:', characterContainer.x)
            }
          }

          // Force position update if changed
          if (characterContainer.x !== prevX || characterContainer.y !== prevY) {
            characterContainer.position.set(characterContainer.x, characterContainer.y)
            console.log('Position updated:', { x: characterContainer.x, y: characterContainer.y })
          }

          // Log position every 60 frames
          if (frameCount % 60 === 0) {
            console.log('Character position:', { x: characterContainer.x, y: characterContainer.y })
          }
        }

        app.ticker.add(gameLoop)
        console.log('Game loop added to ticker')
      } catch (error) {
        console.error("Error initializing PixiJS:", error)
      }
    }

    initApp()

    return () => {
      if (appRef.current) {
        try {
          appRef.current.destroy(true, true)
          appRef.current = null
          catRef.current = null
        } catch (error) {
          console.error("Error destroying PixiJS application:", error)
        }
      }
    }
  }, [selectedCharacter])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <canvas 
        ref={canvasRef} 
        className="w-[400px] h-[400px] border-2 border-gray-300 rounded-lg" 
      />
    </div>
  )
} 