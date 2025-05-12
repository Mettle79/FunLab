"use client"

import { useEffect, useRef } from "react"
import * as PIXI from "pixi.js"

type GameCanvasProps = {
  selectedCharacter: string
  ringConfig: {
    placement: "static" | "random"
    count: number
  }
  completionEffect: "gameOver" | "fireworks"
  isGameStarted: boolean
}

interface Particle extends PIXI.Graphics {
  vx: number
  vy: number
}

type TickerFunction = PIXI.TickerCallback<any>

export default function GameCanvas({ selectedCharacter, ringConfig, completionEffect, isGameStarted }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const appRef = useRef<PIXI.Application | null>(null)
  const catRef = useRef<PIXI.Sprite | null>(null)
  const keysRef = useRef<{ [key: string]: boolean }>({})
  const ringsRef = useRef<PIXI.Container[]>([])
  const fireworksRef = useRef<(PIXI.Graphics | TickerFunction)[]>([])

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

  // Initialize and cleanup game
  useEffect(() => {
    if (!isGameStarted) {
      // Cleanup existing game
      if (appRef.current) {
        try {
          // Stop the ticker first
          appRef.current.ticker.stop()
          
          // Remove all children from stage
          while (appRef.current.stage.children.length > 0) {
            appRef.current.stage.removeChild(appRef.current.stage.children[0])
          }
          
          // Clean up fireworks and their tickers
          fireworksRef.current.forEach(item => {
            if (item instanceof PIXI.Graphics) {
              if (item.parent) {
                item.parent.removeChild(item)
                item.destroy()
              }
            } else if (typeof item === 'function') {
              appRef.current?.ticker.remove(item as PIXI.TickerCallback<any>)
            }
          })
          fireworksRef.current = []
          
          // Clear the WebGL context
          const gl = canvasRef.current?.getContext('webgl2') || canvasRef.current?.getContext('webgl')
          if (gl) {
            // Clear all buffers
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)
            
            // Force context loss
            const loseContext = gl.getExtension('WEBGL_lose_context')
            if (loseContext) {
              loseContext.loseContext()
            }
            
            // Clear any remaining shader programs
            const maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS)
            for (let i = 0; i < maxAttribs; i++) {
              gl.disableVertexAttribArray(i)
            }
          }
          
          // Destroy the application
          appRef.current.destroy(true, true)
          appRef.current = null
          catRef.current = null
          ringsRef.current = []
        } catch (error) {
          console.error("Error cleaning up PixiJS application:", error)
        }
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    let app: PIXI.Application | null = null

    const initApp = async () => {
      try {
        // Ensure we have a valid WebGL context
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
        if (!gl) {
          throw new Error('WebGL not supported')
        }

        app = new PIXI.Application({
          view: canvas,
          width: 400,
          height: 400,
          backgroundColor: 0xffffff,
          antialias: true,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
          powerPreference: 'high-performance',
          hello: true
        })

        console.log('PixiJS initialized with WebGL context')
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

        // Create and position rings
        const createRing = async () => {
          try {
            if (ringConfig.placement === "static") {
              // For static placement, use a container with a simple shape
              const container = new PIXI.Container()
              const graphics = new PIXI.Graphics()
              graphics.beginFill(0xFFD700)
              graphics.drawCircle(0, 0, 15)
              graphics.endFill()
              container.addChild(graphics)
              return container
            } else {
              // For random placement, use the same simple approach
              const container = new PIXI.Container()
              const graphics = new PIXI.Graphics()
              graphics.beginFill(0xFFD700)
              graphics.drawCircle(0, 0, 15)
              graphics.endFill()
              container.addChild(graphics)
              return container
            }
          } catch (error) {
            console.error('Error creating ring:', error)
            // Fallback to basic container with shape
            const container = new PIXI.Container()
            const graphics = new PIXI.Graphics()
            graphics.beginFill(0xFFD700)
            graphics.drawCircle(0, 0, 15)
            graphics.endFill()
            container.addChild(graphics)
            return container
          }
        }

        const placeRings = async () => {
          if (!app || !app.screen) {
            console.error('No app instance available or screen not initialized')
            return
          }
          
          console.log('Starting ring placement with config:', ringConfig)
          
          // Clear existing rings
          ringsRef.current.forEach(ring => {
            if (ring.parent) {
              ring.parent.removeChild(ring)
              ring.destroy()
            }
          })
          ringsRef.current = []

          // Create new rings
          const rings: PIXI.Container[] = []
          for (let i = 0; i < ringConfig.count; i++) {
            console.log(`Creating ring ${i + 1}/${ringConfig.count}`)
            const ring = await createRing()
            if (!ring) {
              console.error(`Failed to create ring ${i + 1}`)
              continue
            }
            
            if (ringConfig.placement === "static") {
              // Place rings in fixed positions around the canvas
              const angle = (i / ringConfig.count) * Math.PI * 2
              const radius = Math.min(app.screen.width, app.screen.height) * 0.4
              ring.x = app.screen.width / 2 + Math.cos(angle) * radius
              ring.y = app.screen.height / 2 + Math.sin(angle) * radius
              console.log(`Placed static ring at (${ring.x}, ${ring.y})`)
            } else {
              // Place rings randomly within the canvas with padding
              const padding = 30
              ring.x = padding + Math.random() * (app.screen.width - 2 * padding)
              ring.y = padding + Math.random() * (app.screen.height - 2 * padding)
              console.log(`Placed random ring at (${ring.x}, ${ring.y})`)
            }

            app.stage.addChild(ring)
            rings.push(ring)
          }

          ringsRef.current = rings
          console.log('All rings placed successfully')
        }

        await placeRings()

        // Game loop
        const gameLoop = () => {
          if (!app || !catRef.current) return

          const cat = catRef.current
          const speed = 5

          // Handle movement
          if (keysRef.current['ArrowUp']) {
            cat.y -= speed
          }
          if (keysRef.current['ArrowDown']) {
            cat.y += speed
          }
          if (keysRef.current['ArrowLeft']) {
            cat.x -= speed
          }
          if (keysRef.current['ArrowRight']) {
            cat.x += speed
          }

          // Keep cat within bounds
          cat.x = Math.max(0, Math.min(app.screen.width, cat.x))
          cat.y = Math.max(0, Math.min(app.screen.height, cat.y))

          // Check for ring collisions
          ringsRef.current.forEach((ring, index) => {
            if (!ring.parent) return

            const dx = cat.x - ring.x
            const dy = cat.y - ring.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 30) {
              // Remove the ring
              if (ring.parent) {
                ring.parent.removeChild(ring)
                ring.destroy()
              }
              ringsRef.current.splice(index, 1)

              // Check if all rings are collected
              if (ringsRef.current.length === 0) {
                if (completionEffect === "fireworks") {
                  showFireworks()
                } else {
                  showGameOver()
                }
              }
            }
          })
        }

        app.ticker.add(gameLoop)

        return () => {
          if (app) {
            app.ticker.remove(gameLoop)
          }
        }
      } catch (error) {
        console.error('Error initializing game:', error)
      }
    }

    initApp()

    return () => {
      if (app) {
        app.destroy(true, true)
      }
    }
  }, [isGameStarted, selectedCharacter, ringConfig, completionEffect])

  const showGameOver = () => {
    if (!appRef.current) return

    const app = appRef.current
    const graphics = new PIXI.Graphics()
    graphics.beginFill(0x000000, 0.7)
    graphics.drawRect(0, 0, app.screen.width, app.screen.height)
    graphics.endFill()

    const text = new PIXI.Text('Game Over!', {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 0xFFFFFF,
      align: 'center'
    })
    text.anchor.set(0.5)
    text.x = app.screen.width / 2
    text.y = app.screen.height / 2

    app.stage.addChild(graphics)
    app.stage.addChild(text)
  }

  const createFirework = (x: number, y: number) => {
    if (!appRef.current) return

    const app = appRef.current
    const particles: Particle[] = []
    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      const particle = new PIXI.Graphics() as Particle
      particle.beginFill(Math.random() * 0xFFFFFF)
      particle.drawCircle(0, 0, 2)
      particle.endFill()
      particle.x = x
      particle.y = y
      particle.vx = (Math.random() - 0.5) * 8
      particle.vy = (Math.random() - 0.5) * 8
      app.stage.addChild(particle)
      particles.push(particle)
    }

    const updateParticles = () => {
      let allDead = true
      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.1 // gravity
        particle.alpha -= 0.01

        if (particle.alpha > 0) {
          allDead = false
        } else {
          particle.destroy()
        }
      })

      if (allDead) {
        app.ticker.remove(updateParticles)
      }
    }

    app.ticker.add(updateParticles)
    fireworksRef.current.push(updateParticles)
  }

  const showFireworks = () => {
    if (!appRef.current) return

    const app = appRef.current
    const fireworkCount = 5
    const interval = 500

    for (let i = 0; i < fireworkCount; i++) {
      setTimeout(() => {
        const x = Math.random() * app.screen.width
        const y = Math.random() * app.screen.height
        createFirework(x, y)
      }, i * interval)
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className="border-2 border-orange-500 rounded-lg"
    />
  )
} 