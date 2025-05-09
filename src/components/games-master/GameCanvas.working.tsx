"use client"

import { useEffect, useRef } from "react"
import * as PIXI from "pixi.js"

type GameCanvasProps = {
  characterImage: string
}

export default function GameCanvas({ characterImage }: GameCanvasProps) {
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

        // Create a container for the cat
        const catContainer = new PIXI.Container()
        catContainer.x = app.screen.width / 2
        catContainer.y = app.screen.height / 2
        app.stage.addChild(catContainer)

        // Load and display the cat sprite
        try {
          const texture = await PIXI.Assets.load('/sprites/cat.png')
          console.log('Cat texture loaded')
          const cat = new PIXI.Sprite(texture)
          cat.anchor.set(0.5)
          cat.scale.set(0.1)
          catContainer.addChild(cat)
          catRef.current = cat
          console.log('Cat sprite added to stage')
        } catch (error) {
          console.error('Error loading cat texture:', error)
          // Create a fallback sprite using a texture from a graphics object
          const graphics = new PIXI.Graphics()
          graphics.beginFill(0xFF0000)
          graphics.drawCircle(0, 0, 25)
          graphics.endFill()
          
          const texture = app.renderer.generateTexture(graphics)
          const cat = new PIXI.Sprite(texture)
          cat.anchor.set(0.5)
          catContainer.addChild(cat)
          catRef.current = cat
          console.log('Fallback cat sprite created')
        }

        // Add game loop for movement
        let frameCount = 0
        const gameLoop = () => {
          frameCount++
          if (frameCount % 60 === 0) {
            console.log('Game loop running, frame:', frameCount)
          }

          const cat = catRef.current
          if (!cat || !app) {
            console.log('Missing cat or app:', { cat: !!cat, app: !!app })
            return
          }

          const speed = 2
          const keys = keysRef.current

          // Store previous position
          const prevX = catContainer.x
          const prevY = catContainer.y

          // Update position based on key presses with boundary checking
          if (keys['ArrowUp']) {
            const newY = catContainer.y - speed
            if (newY >= 0) {
              catContainer.y = newY
              console.log('Moving up:', catContainer.y)
            }
          }
          if (keys['ArrowDown']) {
            const newY = catContainer.y + speed
            if (newY <= app.screen.height) {
              catContainer.y = newY
              console.log('Moving down:', catContainer.y)
            }
          }
          if (keys['ArrowLeft']) {
            const newX = catContainer.x - speed
            if (newX >= 0) {
              catContainer.x = newX
              console.log('Moving left:', catContainer.x)
            }
          }
          if (keys['ArrowRight']) {
            const newX = catContainer.x + speed
            if (newX <= app.screen.width) {
              catContainer.x = newX
              console.log('Moving right:', catContainer.x)
            }
          }

          // Force position update if changed
          if (catContainer.x !== prevX || catContainer.y !== prevY) {
            catContainer.position.set(catContainer.x, catContainer.y)
            console.log('Position updated:', { x: catContainer.x, y: catContainer.y })
          }

          // Log position every 60 frames
          if (frameCount % 60 === 0) {
            console.log('Cat position:', { x: catContainer.x, y: catContainer.y })
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
  }, [])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <canvas 
        ref={canvasRef} 
        className="w-[400px] h-[400px] border-2 border-gray-300 rounded-lg" 
      />
    </div>
  )
} 