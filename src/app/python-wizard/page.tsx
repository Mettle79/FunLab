"use client"

import { useState } from "react"

export default function Page() {
  const [code, setCode] = useState('print("Hello, World!")')
  const [output, setOutput] = useState("")

  const handleRunCode = () => {
    try {
      // Simple text-based Python execution simulation
      const lines = code.split('\n')
      let result = ""

      for (const line of lines) {
        if (line.trim().startsWith('print(')) {
          const match = line.match(/print\("([^"]*)"\)/)
          if (match) {
            result += match[1] + "\n"
          }
        }
      }

      setOutput(result || "No output")
    } catch (error) {
      setOutput("Error: Invalid Python syntax")
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-300 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          Python Wizard
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Code Editor</h2>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[200px] p-4 font-mono text-sm bg-gray-900 text-white rounded-lg resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={handleRunCode}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Run Code
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Output</h2>
            <div className="bg-gray-100 rounded-lg p-4 min-h-[100px]">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {output || "# Your output will appear here"}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 