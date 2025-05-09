import { Card, CardContent } from "@/components/ui/card"

export default function InstructionsBox() {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">How to Play</h2>
        
        <div className="space-y-6">
          {/* Game Instructions */}
          <div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">Objective</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li>Use arrow keys to move the cat</li>
              <li>Collect all the stars to win</li>
              <li>Each star is worth 10 points</li>
              <li>Try to collect them as fast as you can!</li>
            </ol>
          </div>

          {/* Controls */}
          <div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">Controls:</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>↑ - Move Up</li>
              <li>↓ - Move Down</li>
              <li>← - Move Left</li>
              <li>→ - Move Right</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 