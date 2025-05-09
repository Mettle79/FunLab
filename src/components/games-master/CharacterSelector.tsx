"use client"

import { useState } from "react"
import Image from "next/image"

const characters = [
  { 
    id: "cat", 
    name: "Cat", 
    image: "/sprites/cat.png"
  },
  { 
    id: "dog", 
    name: "Dog", 
    image: "/sprites/dog.png"
  },
  { 
    id: "rabbit", 
    name: "Rabbit", 
    image: "/sprites/rabbit.png"
  }
]

type CharacterSelectorProps = {
  onCharacterSelect: (character: string) => void
}

export default function CharacterSelector({ onCharacterSelect }: CharacterSelectorProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)

  const handleSelect = (characterId: string) => {
    setSelectedCharacter(characterId)
    onCharacterSelect(characterId)
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl font-bold">Select Your Character</h2>
      <div className="flex gap-4">
        {characters.map((character) => (
          <button
            key={character.id}
            onClick={() => handleSelect(character.id)}
            className={`p-2 rounded-lg border-2 transition-all ${
              selectedCharacter === character.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="w-24 h-24 relative">
              <Image
                src={character.image}
                alt={character.name}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-center mt-2">{character.name}</p>
          </button>
        ))}
      </div>
    </div>
  )
} 