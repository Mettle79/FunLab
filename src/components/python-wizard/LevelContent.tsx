"use client"

import { Card } from "@/components/ui/card"

interface LevelContentProps {
  level: number
}

const levelContent = {
  1: {
    title: "Hello, Python!",
    description: "Let's start with the basics. Write a program that prints 'Hello, World!' to the console.",
    instructions: [
      "Use the print() function to display text",
      "Remember to use quotes around your text",
      "Click 'Run Code' to see your output"
    ],
    initialCode: "# Write your code here\nprint('Hello, World!')",
    expectedOutput: "Hello, World!"
  },
  2: {
    title: "Variables and Numbers",
    description: "Create variables and perform basic arithmetic operations.",
    instructions: [
      "Create a variable called 'number' and assign it a value",
      "Multiply it by 2 and store the result in a new variable",
      "Print both numbers"
    ],
    initialCode: "# Create your variables here\nnumber = 5\nresult = number * 2\nprint(f'Original number: {number}')\nprint(f'Result: {result}')",
    expectedOutput: "Original number: 5\nResult: 10"
  },
  3: {
    title: "Conditional Statements",
    description: "Use if/else statements to make decisions in your code.",
    instructions: [
      "Create a variable with a number",
      "Use if/else to check if the number is positive or negative",
      "Print the result"
    ],
    initialCode: "# Write your conditional statement here\nnumber = -5\n\nif number > 0:\n    print('The number is positive')\nelse:\n    print('The number is negative')",
    expectedOutput: "The number is negative"
  }
}

export default function LevelContent({ level }: LevelContentProps) {
  const content = levelContent[level as keyof typeof levelContent] || levelContent[1]

  return (
    <Card className="!bg-orange-50 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{content.title}</h2>
      <p className="text-gray-700 mb-4">{content.description}</p>
      
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-2">Instructions:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {content.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ul>
      </div>

      <div className="bg-orange-100 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Expected Output:</h3>
        <pre className="text-sm text-gray-800 whitespace-pre-wrap">
          {content.expectedOutput}
        </pre>
      </div>
    </Card>
  )
} 