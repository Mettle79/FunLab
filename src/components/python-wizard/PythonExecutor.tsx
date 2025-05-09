"use client"

import { useEffect, useState } from 'react'
import Script from 'next/script'

interface PythonExecutorProps {
  code: string
  onOutput: (output: string) => void
  onError: (error: string) => void
}

export default function PythonExecutor({ code, onOutput, onError }: PythonExecutorProps) {
  const [pyodide, setPyodide] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load Pyodide
      const loadPyodide = async () => {
        try {
          // @ts-ignore
          const pyodide = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
          })
          setPyodide(pyodide)
          setIsLoading(false)
        } catch (error) {
          console.error('Error loading Pyodide:', error)
          onError('Failed to load Python environment')
        }
      }
      loadPyodide()
    }
  }, [onError])

  useEffect(() => {
    if (pyodide && code) {
      try {
        // Redirect stdout to capture print statements
        pyodide.runPython(`
          import sys
          from io import StringIO
          sys.stdout = StringIO()
        `)

        // Run the user's code
        pyodide.runPython(code)

        // Get the output
        const output = pyodide.runPython("sys.stdout.getvalue()")
        onOutput(output)
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Failed to execute code')
      }
    }
  }, [pyodide, code, onOutput, onError])

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"
        strategy="beforeInteractive"
      />
      {isLoading && <div>Loading Python environment...</div>}
    </>
  )
} 