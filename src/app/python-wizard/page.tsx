"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Task {
  id: string
  title: string
  description: string
  test: (code: string, output: string) => boolean
  completed: boolean
  example?: string
  completedAt?: number
}

interface Context {
  [key: string]: string | number
}

export default function Page() {
  const router = useRouter()
  const [code, setCode] = useState('# Write your Python code here!\n# Try completing the tasks below.')
  const [output, setOutput] = useState("")
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task1",
      title: "Hello World",
      description: "Print a message using a print statement with a string literal (text in quotes)",
      test: (code, output) => {
        // Check if there's a print statement with a string literal
        const hasPrint = code.includes('print(')
        const hasStringLiteral = /print\s*\(\s*["'].*["']\s*\)/.test(code)
        return hasPrint && hasStringLiteral && output.trim().length > 0
      },
      completed: false,
      example: 'print("Hello, World!")'
    },
    {
      id: "task2",
      title: "Variables",
      description: "Create a variable and print its value",
      test: (code, output) => {
        const hasVariable = code.includes("=")
        const hasPrint = code.includes("print")
        return hasVariable && hasPrint && output.trim().length > 0
      },
      completed: false,
      example: 'name = "Python"\nprint(name)'
    },
    {
      id: "task3",
      title: "F-strings",
      description: "Use an f-string to print a variable",
      test: (code, output) => {
        return code.includes('f"') && code.includes("{") && code.includes("}")
      },
      completed: false,
      example: 'name = "Python"\nprint(f"Hello, {name}!")'
    },
    {
      id: "task4",
      title: "Basic Arithmetic",
      description: "Perform addition and print the result",
      test: (code, output) => {
        return code.includes("+") && output.includes("=")
      },
      completed: false,
      example: 'x = 10\ny = 5\nprint(f"{x} + {y} = {x + y}")'
    },
    {
      id: "task5",
      title: "Multiple Operations",
      description: "Perform at least two different arithmetic operations",
      test: (code, output) => {
        const operations = ["+", "-", "*", "/"]
        const usedOperations = operations.filter(op => code.includes(op))
        return usedOperations.length >= 2
      },
      completed: false,
      example: 'x = 10\ny = 5\nprint(f"{x} + {y} = {x + y}")\nprint(f"{x} * {y} = {x * y}")'
    }
  ])
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  const handleRunCode = () => {
    try {
      // Create a context for variables
      const context: Context = {}
      let result = ""

      // Helper function to evaluate expressions
      const evaluateExpression = (expr: string): string | number => {
        console.log('Evaluating expression:', expr)
        // Handle string literals
        if (expr.startsWith('"') || expr.startsWith("'")) {
          return expr.slice(1, -1)
        }
        // Handle numbers
        if (!isNaN(Number(expr))) {
          return Number(expr)
        }
        // Handle variables
        if (context[expr] !== undefined) {
          console.log('Found variable in context:', expr, context[expr])
          return context[expr]
        }
        // Handle arithmetic expressions
        if (expr.includes('+')) {
          const [left, right] = expr.split('+').map(e => evaluateExpression(e.trim()))
          const result = Number(left) + Number(right)
          console.log('Addition result:', left, '+', right, '=', result)
          return result
        }
        if (expr.includes('-')) {
          const [left, right] = expr.split('-').map(e => evaluateExpression(e.trim()))
          const result = Number(left) - Number(right)
          console.log('Subtraction result:', left, '-', right, '=', result)
          return result
        }
        if (expr.includes('*')) {
          const [left, right] = expr.split('*').map(e => evaluateExpression(e.trim()))
          const result = Number(left) * Number(right)
          console.log('Multiplication result:', left, '*', right, '=', result)
          return result
        }
        if (expr.includes('/')) {
          const [left, right] = expr.split('/').map(e => evaluateExpression(e.trim()))
          const result = Number(left) / Number(right)
          console.log('Division result:', left, '/', right, '=', result)
          return result
        }
        console.log('Expression not handled:', expr)
        return expr
      }

      // Process each line
      const lines = code.split('\n')
      console.log('Processing lines:', lines)
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        console.log('Processing line:', line)
        
        // Skip empty lines and comments
        if (!line || line.startsWith('#')) {
          console.log('Skipping empty line or comment')
          continue
        }

        // Handle print statements first
        if (line.startsWith('print(')) {
          const content = line.slice(6, -1)
          console.log('Print content:', content)
          
          if (content.startsWith('f"')) {
            // Handle f-strings in print
            let fString = content.slice(2, -1)
            console.log('Processing f-string:', fString)
            
            fString = fString.replace(/\{([^}]+)\}/g, (match, expr) => {
              console.log('Found expression in f-string:', expr)
              const evaluated = evaluateExpression(expr)
              console.log('Evaluated expression:', evaluated)
              return evaluated !== undefined ? String(evaluated) : expr
            })
            
            console.log('Final f-string result:', fString)
            result += fString + "\n"
          } else {
            // Handle regular print
            const value = evaluateExpression(content)
            console.log('Regular print value:', value)
            result += String(value) + "\n"
          }
          continue
        }

        // Handle variable assignment
        if (line.includes('=')) {
          const [varName, value] = line.split('=').map(s => s.trim())
          console.log('Variable assignment:', varName, '=', value)
          context[varName] = evaluateExpression(value)
          console.log('Context after assignment:', context)
          continue
        }
      }

      console.log('Final result:', result)
      const finalOutput = result || "No output"

      // Check task completion after running the code
      setTasks(prevTasks => 
        prevTasks.map(task => {
          // If task was already completed, keep it completed
          if (task.completed) {
            return task
          }
          // Otherwise, check if it's completed now
          const isCompleted = task.test(code, finalOutput)
          return {
            ...task,
            completed: isCompleted,
            completedAt: isCompleted ? Date.now() : undefined
          }
        })
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid Python syntax'
      console.error('Error:', errorMessage)
    }
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const progress = (completedTasks / totalTasks) * 100

  const allTasksCompleted = tasks.every(task => task.completed)

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-300 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Logo */}
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
              <span className="text-orange-500">Python</span>{" "}
              <span className="text-gray-900">Wizard</span>
            </span>
          </h1>

          {/* Introduction */}
          <div className="bg-orange-600/90 rounded-xl p-6 shadow-lg mb-8 max-w-3xl mx-auto">
            <p className="text-center text-lg text-white">
              Learn Python programming through interactive challenges. Write code, see the results instantly, and complete tasks to progress.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Editor and Output */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Code Editor</h2>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-64 p-4 font-mono text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Write your Python code here..."
                />
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={handleRunCode}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Run Code
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Output</h2>
                <pre className="w-full h-32 p-4 font-mono text-sm bg-gray-50 rounded-lg overflow-auto">
                  {output}
                </pre>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={() => router.push('/ethical-hacking')}
                  disabled={!allTasksCompleted}
                  className="bg-orange-500 px-8 py-4 text-lg text-white hover:bg-orange-600 disabled:bg-orange-200 disabled:text-orange-400 disabled:cursor-not-allowed"
                >
                  Continue to Next Task
                </Button>
              </div>
            </div>

            {/* Right Column - Tasks and Progress */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Progress</h2>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-gray-600">
                  {completedTasks} of {totalTasks} tasks completed
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
                <div className="space-y-4">
                  {tasks.map(task => (
                    <div 
                      key={task.id}
                      className={`p-4 rounded-lg border ${
                        task.completed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                          task.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {task.completed && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{task.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                          {task.example && (
                            <div className="mt-2">
                              <button
                                onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                                className="text-sm text-orange-500 hover:text-orange-600"
                              >
                                {selectedTask === task.id ? 'Hide Example' : 'Show Example'}
                              </button>
                              {selectedTask === task.id && (
                                <pre className="mt-2 p-2 bg-gray-900 text-white rounded text-sm overflow-x-auto">
                                  {task.example}
                                </pre>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 