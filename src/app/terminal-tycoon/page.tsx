"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

type CommandHistory = {
  command: string
  output: string
  isError?: boolean
}

type Task = {
  id: number
  description: string
  completed: boolean
  requiredCommand: string
  hint: string
}

export default function TerminalTycoon() {
  const router = useRouter()
  const [command, setCommand] = useState("")
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: "",
      output: "Welcome to Terminal Tycoon! Type 'help' to see available commands.\nComplete all tasks to become a terminal master!",
    },
  ])
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      description: "List all files in the current directory",
      completed: false,
      requiredCommand: "ls",
      hint: "Use the 'ls' command to list files",
    },
    {
      id: 2,
      description: "Check the system logs",
      completed: false,
      requiredCommand: "cat system_logs.txt",
      hint: "Use 'cat' to read file contents",
    },
    {
      id: 3,
      description: "Run a virus scan",
      completed: false,
      requiredCommand: "scan",
      hint: "Use the 'scan' command to check for viruses",
    },
    {
      id: 4,
      description: "Navigate to the secret_files directory",
      completed: false,
      requiredCommand: "cd secret_files",
      hint: "Use 'cd' to change directories",
    },
  ])
  const [showCompletion, setShowCompletion] = useState(false)

  useEffect(() => {
    if (tasks.every(task => task.completed) && !showCompletion) {
      setShowCompletion(true)
    }
  }, [tasks, showCompletion])

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault()
    const newCommand = command.trim().toLowerCase()
    let output = ""
    let isError = false

    // Check for task completion
    const taskToComplete = tasks.find(task => 
      !task.completed && task.requiredCommand === newCommand
    )
    
    if (taskToComplete) {
      setTasks(tasks.map(task => 
        task.id === taskToComplete.id ? { ...task, completed: true } : task
      ))
      output = `Task completed: ${taskToComplete.description}! 🎉\n`
    }

    switch (newCommand) {
      case "help":
        output += `
Available commands:
- help: Show this help message
- ls: List files in current directory
- cd <directory>: Change directory
- scan: Scan system for viruses
- clear: Clear terminal
- cat <file>: Read file contents
- tasks: Show current tasks and progress
`
        break
      case "tasks":
        output += "\nCurrent Tasks:\n" + tasks.map(task => 
          `${task.completed ? '✅' : '⬜'} ${task.description}\n${task.completed ? '' : `Hint: ${task.hint}`}`
        ).join('\n\n')
        break
      case "ls":
        output += `
Documents/
Downloads/
secret_files/
system_logs.txt
virus_scan_results.txt
`
        break
      case "scan":
        output += `
Scanning system for viruses...
Checking Documents/... ✓
Checking Downloads/... ✓
Checking system files... ✓
No viruses found! System is secure.
`
        break
      case "clear":
        setHistory([])
        setCommand("")
        return
      default:
        if (newCommand.startsWith("cd ")) {
          const dir = newCommand.slice(3)
          output += `Changed directory to ${dir}`
        } else if (newCommand.startsWith("cat ")) {
          const file = newCommand.slice(4)
          if (file === "system_logs.txt") {
            output += `
System Log:
[10:15] User login successful
[10:20] System scan initiated
[10:25] Updated security protocols
[10:30] Backup completed
`
          } else if (file === "virus_scan_results.txt") {
            output += `
Last Scan Results:
Date: ${new Date().toLocaleDateString()}
Files Scanned: 1,234
Threats Found: 0
Status: System Secure
`
          } else {
            output = `File '${file}' not found`
            isError = true
          }
        } else if (newCommand !== "") {
          output = `Command not found: ${newCommand}. Type 'help' for available commands.`
          isError = true
        }
    }

    setHistory([...history, { command: newCommand, output, isError }])
    setCommand("")
  }

  if (showCompletion) {
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

        <div className="flex flex-1 flex-col items-center justify-center p-8">
          <Card className="w-full max-w-2xl !bg-orange-50 p-8 text-center shadow-xl">
            <h1 className="mb-6 text-4xl font-bold text-gray-900">
              🎉 Congratulations! 🎉
            </h1>
            <p className="mb-8 text-xl text-gray-700">
              You&apos;ve mastered the terminal basics! You can now:
            </p>
            <ul className="mb-8 list-inside list-disc text-left text-lg text-gray-700">
              <li>Navigate through directories using the command line</li>
              <li>List and view files in directories</li>
              <li>Read file contents using terminal commands</li>
              <li>Perform system security checks</li>
            </ul>
            <Button 
              onClick={() => router.push('/ethical-hacking')}
              className="bg-orange-500 px-8 py-4 text-lg text-white hover:bg-orange-600"
            >
              Continue to Ethical Hacking Challenge
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

      {/* Main Content */}
      <div className="flex flex-1 flex-col p-8">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="mb-6 text-center text-3xl font-bold">
            <span className="rounded-lg bg-white px-4 py-2 shadow-sm">
              <span className="text-orange-500">Terminal</span>{" "}
              <span className="text-gray-900">Tycoon</span>
            </span>
          </h1>
          
          <div className="flex gap-6">
            {/* Terminal */}
            <Card className="flex-1 min-h-[500px] !bg-gray-900 p-4 font-mono text-green-400 shadow-xl">
              <div className="mb-4 h-[400px] overflow-y-auto">
                {history.map((entry, index) => (
                  <div key={index} className="mb-2">
                    {entry.command && (
                      <div className="mb-1">
                        <span className="text-blue-400">$ </span>
                        {entry.command}
                      </div>
                    )}
                    <div className={entry.isError ? "text-red-400" : "text-green-400"}>
                      {entry.output}
                    </div>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleCommand} className="flex items-center">
                <span className="text-blue-400">$ </span>
                <Input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-green-400"
                  placeholder="Enter command..."
                />
              </form>
            </Card>

            {/* Tasks Panel */}
            <Card className="w-80 !bg-orange-200 p-4 shadow-xl">
              <h2 className="mb-4 border-b border-orange-300 pb-2 text-lg font-semibold text-orange-900">
                Tasks to Complete
              </h2>
              <div className="space-y-3">
                {tasks.map(task => (
                  <div key={task.id} className="rounded-lg bg-orange-100 p-3 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full border border-orange-300 bg-orange-50">
                        {task.completed && (
                          <svg className="h-3.5 w-3.5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-900">{task.description}</p>
                        {!task.completed && task.hint && (
                          <p className="mt-1 text-xs text-orange-700">{task.hint}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 