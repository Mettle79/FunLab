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

export default function GameCanvas({ selectedCharacter, ringConfig, completionEffect, isGameStarted }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const appRef = useRef<PIXI.Application | null>(null)
  const catRef = useRef<PIXI.Sprite | null>(null)
  const keysRef = useRef<{ [key: string]: boolean }>({})
  const ringsRef = useRef<PIXI.Container[]>([])
  const fireworksRef = useRef<PIXI.Graphics[]>([])

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
              appRef.current?.ticker.remove(item)
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

        app = new PIXI.Application()
        await app.init({
          canvas: canvas,
          width: 400,
          height: 400,
          backgroundColor: 0xffffff,
          antialias: true,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
          powerPreference: 'high-performance',
          context: gl as WebGL2RenderingContext
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
          console.log(`Successfully placed ${rings.length} rings`)
        }

        // Initialize the game
        await placeRings()
        console.log('Game initialization complete')

        // Add game loop for movement
        let frameCount = 0
        const gameLoop = () => {
          frameCount++
          if (frameCount % 60 === 0) {
            console.log('Game loop running, frame:', frameCount)
          }

          const character = catRef.current
          if (!character || !app || !app.screen) {
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

          // Check for ring collection
          const ringsToRemove: number[] = []
          ringsRef.current.forEach((ring, index) => {
            const distance = Math.sqrt(
              Math.pow(characterContainer.x - ring.x, 2) +
              Math.pow(characterContainer.y - ring.y, 2)
            )
            if (distance < 30) { // Collection radius
              if (ring.parent) {
                ring.parent.removeChild(ring)
                ring.destroy()
              }
              ringsToRemove.push(index)
              console.log('Ring collected! Rings remaining:', ringsRef.current.length - 1)
            }
          })

          // Remove collected rings in reverse order to maintain indices
          for (let i = ringsToRemove.length - 1; i >= 0; i--) {
            ringsRef.current.splice(ringsToRemove[i], 1)
          }

          // Check if all rings are collected
          if (ringsRef.current.length === 0) {
            if (completionEffect === "gameOver") {
              showGameOver()
            } else {
              showFireworks()
            }
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
              appRef.current?.ticker.remove(item)
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
    }
  }, [selectedCharacter, ringConfig, completionEffect, isGameStarted])

  const showGameOver = () => {
    if (!appRef.current) return
    
    const gameOverText = new PIXI.Text("Game Over!", {
      fontFamily: "Arial",
      fontSize: 36,
      fill: 0xff0000,
      align: "center"
    })
    gameOverText.anchor.set(0.5)
    gameOverText.x = appRef.current.screen.width / 2
    gameOverText.y = appRef.current.screen.height / 2
    appRef.current.stage.addChild(gameOverText)
  }

  const createFirework = (x: number, y: number) => {
    if (!appRef.current) return []
    
    const particles: Particle[] = []
    for (let i = 0; i < 20; i++) {
      const particle = new PIXI.Graphics() as Particle
      particle.beginFill(Math.random() * 0xffffff)
      particle.drawCircle(0, 0, 2)
      particle.endFill()
      
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 5 + 2
      particle.vx = Math.cos(angle) * speed
      particle.vy = Math.sin(angle) * speed
      
      particle.x = x
      particle.y = y
      appRef.current.stage.addChild(particle)
      particles.push(particle)
    }
    
    return particles
  }

  const showFireworks = () => {
    if (!appRef.current) return
    
    const fireworks: Particle[] = []
    
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (!appRef.current) return // Check if app still exists
        
        const x = Math.random() * appRef.current.screen.width
        const y = Math.random() * appRef.current.screen.height
        const newFireworks = createFirework(x, y)
        fireworks.push(...newFireworks)
        fireworksRef.current.push(...newFireworks)
        
        // Store the ticker function reference
        const tickerFunction = () => {
          if (!appRef.current) return // Check if app still exists
          
          newFireworks.forEach(particle => {
            particle.x += particle.vx
            particle.y += particle.vy
            particle.alpha -= 0.02
            
            if (particle.alpha <= 0) {
              if (particle.parent) {
                particle.parent.removeChild(particle)
              }
            }
          })
        }
        
        // Add the ticker and store its reference
        const ticker = appRef.current.ticker.add(tickerFunction)
        
        // Store the ticker reference for cleanup
        fireworksRef.current.push(ticker as any)
      }, i * 1000)
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {isGameStarted ? (
        <canvas 
          key={`canvas-${Date.now()}`}
          ref={canvasRef} 
          className="w-[400px] h-[400px] border-2 border-gray-300 rounded-lg" 
        />
      ) : (
        <div className="w-[400px] h-[400px] border-2 border-gray-300 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Game stopped</p>
        </div>
      )}
    </div>
  )
} 