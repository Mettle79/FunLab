"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function WelcomePage() {
  const router = useRouter()
  
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
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center space-y-8">
          {/* Video Card */}
          <Card className="w-full max-w-2xl !bg-orange-50 shadow-xl overflow-hidden mx-auto">
            <div className="aspect-video w-full">
              {/* Video placeholder - replace src with your actual video */}
              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                <p className="text-gray-500">Video content will be displayed here</p>
              </div>
            </div>
          </Card>

          {/* Welcome Text */}
          <div className="text-center">
            <p className="text-2xl font-semibold">
              Welcome to <span className="text-orange-500">Stellar</span>{" "}
              <span className="text-gray-900">Elevate</span>{" "}
              <span className="text-gray-900">Cyber Learning Fun Rooms</span>
            </p>
          </div>

          {/* Enter Button */}
          <Button 
            onClick={() => router.push('/terminal-tycoon')}
            className="mt-8 px-8 py-6 text-xl bg-orange-500 text-white hover:bg-orange-600"
          >
            Enter Cyber Fun Room Activities
          </Button>
        </div>
      </div>
    </div>
  )
} 