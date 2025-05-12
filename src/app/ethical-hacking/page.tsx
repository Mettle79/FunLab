"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

type Task = {
  id: number
  description: string
  completed: boolean
  hint: string
  solution: string
}

export default function EthicalHacking() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      description: "Find the hidden message in the HTML comments",
      completed: false,
      hint: "",
      solution: "SECURITY_FIRST"
    },
    {
      id: 2,
      description: "Find the admin panel access code in the HTML class",
      completed: false,
      hint: "",
      solution: "SUPER_ADMIN"
    },
    {
      id: 3,
      description: "Find the hidden button's class name",
      completed: false,
      hint: "",
      solution: "secret-access"
    }
  ])
  const [showCompletion, setShowCompletion] = useState(false)
  const [answer, setAnswer] = useState("")
  const [error, setError] = useState("")
  const [foundHighRisk, setFoundHighRisk] = useState(false)

  useEffect(() => {
    // Add console message for task 2
    console.log("System log: User authentication password is 'ETHICAL_HACKER'")
  }, [])

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault()
    const userAnswer = answer.trim()
    
    // Special case for finding the high-risk vulnerability
    if (userAnswer.toLowerCase() === "ethical_hacker") {
      setError("🎉 Excellent work! You&apos;ve found a high-risk vulnerability - exposed authentication credentials in console logs! This is exactly the kind of security issue ethical hackers help identify and fix.")
      setAnswer("")
      setFoundHighRisk(true)
      return
    }
    
    const completedTask = tasks.find(task => 
      !task.completed && task.solution.toLowerCase() === userAnswer.toLowerCase()
    )

    if (completedTask) {
      setTasks(tasks.map(task =>
        task.id === completedTask.id ? { ...task, completed: true } : task
      ))
      setAnswer("")
      setError("")
    } else {
      setError("That&apos;s not the right answer. Keep looking!")
    }
  }

  useEffect(() => {
    if (tasks.every(task => task.completed) && !showCompletion) {
      setShowCompletion(true)
    }
  }, [tasks, showCompletion])

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
              🎉 Congratulations! 🎉
            </h1>
            <p className="mb-8 text-xl text-gray-700">
              You&apos;ve completed the Ethical Hacking challenge! You&apos;ve learned:
            </p>
            <ul className="mb-8 list-inside list-disc text-left text-lg text-gray-700">
              <li>How to inspect webpage source code</li>
              <li>Using browser developer tools</li>
              <li>Finding hidden elements in HTML</li>
              <li>The importance of ethical hacking in cybersecurity</li>
            </ul>
            <Button 
              onClick={() => router.push('/games-master')}
              className="bg-orange-500 px-8 py-4 text-lg text-white hover:bg-orange-600"
            >
              Continue to Games Master Challenge
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

      <div className="flex flex-1 flex-col p-8">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="mb-6 text-center text-3xl font-bold">
            <span className="rounded-lg bg-white px-4 py-2 shadow-sm">
              <span className="text-orange-500">Ethical</span>{" "}
              <span className="text-gray-900">Hacking</span>
            </span>
          </h1>

          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1">
              <Card className="!bg-orange-200 p-6 shadow-xl">
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold text-orange-900">Welcome to SecureBank</h2>
                  <p className="text-orange-800">This is a simulation of a banking website with security vulnerabilities.</p>
                  <p className="text-orange-800">Your job is to find the security issues as an ethical hacker.</p>
                  
                  <div className="mt-4 flex justify-center">
                    <Button 
                      onClick={() => {
                        const sourceWindow = window.open('', '_blank');
                        if (sourceWindow) {
                          sourceWindow.document.write(`
                            <html>
                              <head>
                                <title>Page Source - SecureBank</title>
                                <style>
                                  body { 
                                    font-family: monospace; 
                                    background: #fef3c7;
                                    padding: 20px;
                                  }
                                </style>
                              </head>
                              <body>
                                <h2>SecureBank Page Source</h2>
                                <pre>
&lt;!-- 
  Secret Code: SECURITY_FIRST
--&gt;
&lt;div class="login-form"&gt;
  &lt;script&gt;
    console.log("System log: User authentication password is 'ETHICAL_HACKER'");
  &lt;/script&gt;
  &lt;div class="admin-panel-access-code"&gt;SUPER_ADMIN&lt;/div&gt;
  &lt;button class="secret-access"&gt;Admin Access&lt;/button&gt;
&lt;/div&gt;
                                </pre>
                                <p>Hint: Look for hidden information in the source code!</p>
                              </body>
                            </html>
                          `);
                        }
                      }}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      View Page Source
                    </Button>
                  </div>

                  <div className="mt-4 rounded-lg border border-orange-300 bg-orange-100 p-4">
                    <h3 className="text-lg font-semibold text-orange-900">Account Login</h3>
                    <form className="mt-2">
                      <input 
                        type="text" 
                        className="mb-2 w-full rounded border border-orange-300 bg-orange-50 p-2" 
                        placeholder="Username"
                        disabled
                      />
                      <input 
                        type="password" 
                        className="w-full rounded border border-orange-300 bg-orange-50 p-2" 
                        placeholder="Password"
                        disabled
                      />
                    </form>
                  </div>

                  {/* Hidden button for task 3 - using opacity and pointer-events instead of display:none */}
                  <button 
                    className="secret-access absolute opacity-0 pointer-events-none" 
                    style={{ position: 'absolute', left: '-9999px' }}
                  >
                    Admin Access
                  </button>
                </div>

                <div className="mt-6">
                  <form onSubmit={checkAnswer} className="flex gap-2">
                    <Input
                      type="text"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Enter the vulnerability you found..."
                      className="flex-1 border-orange-300 bg-orange-50"
                    />
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                      Submit
                    </Button>
                  </form>
                  {error && (
                    <p className="mt-2 text-sm text-orange-700">{error}</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 