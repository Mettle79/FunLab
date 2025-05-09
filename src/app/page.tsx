"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Function to generate dynamic PIN based on date
function generateDynamicPin() {
  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth() + 1 // getMonth() returns 0-11

  // Calculate the dynamic values (2 days before and 2 months before)
  const dynamicDay = Math.max(1, day - 2)
  const dynamicMonth = Math.max(1, month - 2)

  // Format as DDMM
  const pin = `${String(dynamicDay).padStart(2, '0')}${String(dynamicMonth).padStart(2, '0')}`
  console.log('Generated PIN:', pin) // Debug log
  return pin
}

export default function Home() {
  const [pin, setPin] = useState("")
  const [error, setError] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const correctPin = generateDynamicPin()
    console.log('Entered PIN:', pin) // Debug log
    console.log('Correct PIN:', correctPin) // Debug log
    
    if (pin === correctPin) {
      console.log('PIN matched, redirecting...') // Debug log
      setError(false)
      // Store pin verification in sessionStorage
      sessionStorage.setItem("hasEnteredPin", "true")
      // Use Next.js router for navigation
      router.push('/welcome')
    } else {
      console.log('PIN incorrect') // Debug log
      setError(true)
    }
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
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center">
          <Card className="w-full !bg-orange-50 shadow-xl [&>*]:!bg-orange-50">
            <CardContent className="p-8 !bg-orange-50">
              <div className="mb-8 text-center !bg-orange-50">
                <h1 className="mb-4 text-4xl font-bold text-gray-900 bg-orange-50">
                  Welcome to the <span className="text-orange-500">Stellar</span>{" "}
                  <span className="text-gray-900">Elevate</span>{" "}
                  <span className="text-gray-900">Cyber Learning Fun Rooms</span>
                </h1>
                
                <form onSubmit={handleSubmit} className="mx-auto max-w-sm !bg-orange-50">
                  <div className="mb-4 !bg-orange-50">
                    <Input
                      type="password"
                      placeholder="Enter PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="border-gray-300 !bg-white text-gray-900 placeholder:text-gray-500"
                    />
                    {error && (
                      <p className="mt-2 text-sm text-red-500">
                        Incorrect PIN. Please try again.
                      </p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-orange-500 text-white hover:bg-orange-600"
                  >
                    Begin Challenge
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-white">
            <p className="text-lg">
              <span className="text-orange-500">Stellar</span>{" "}
              <span className="text-gray-900">Elevate</span>{" "}
              is a digital technology education programme aimed at people with little or no experience in the tech sector. 
              Learn essential skills to elevate your potential and set you up for a rewarding career in digital technology.
            </p>
            <p className="mt-4 text-lg">
              For enquiries, please contact{" "}
              <a 
                href="https://stellaruk.co.uk/contact-us/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold hover:text-gray-100"
              >
                <span className="text-orange-500">Stellar</span>{" "}
                <span className="text-gray-900">Elevate</span> here
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

