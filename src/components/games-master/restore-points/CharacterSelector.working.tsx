"use client"

import { useState } from "react"
import Image from "next/image"

const characters = [
  { 
    id: "cat", 
    name: "Cat", 
    image: "/sprites/cat.png",
    code: `const cat = new PIXI.Sprite(texture);
cat.anchor.set(0.5);
cat.scale.set(0.1);
characterContainer.addChild(cat);`
  },
  { 
    id: "dog", 
    name: "Dog", 
    image: "/sprites/dog.png",
    code: `const dog = new PIXI.Sprite(texture);
dog.anchor.set(0.5);
dog.scale.set(0.1);
characterContainer.addChild(dog);`
  },
  { 
    id: "rabbit", 
    name: "Rabbit", 
    image: "/sprites/rabbit.png",
    code: `const rabbit = new PIXI.Sprite(texture);
rabbit.anchor.set(0.5);
rabbit.scale.set(0.1);
characterContainer.addChild(rabbit);`
  }
]

type CharacterSelectorProps = {
  onCharacterSelect: (character: string) => void
}

export default function CharacterSelector({ onCharacterSelect }: CharacterSelectorProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [showCodeFor, setShowCodeFor] = useState<string | null>(null)

  const handleSelect = (characterId: string) => {
    setSelectedCharacter(characterId)
    onCharacterSelect(characterId)
  }

  const toggleCode = (characterId: string) => {
    setShowCodeFor(showCodeFor === characterId ? null : characterId)
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl font-bold">Select Your Character</h2>
      <div className="flex gap-4">
        {characters.map((character) => (
          <div key={character.id} className="flex flex-col items-center">
            <button
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
            <button
              onClick={() => toggleCode(character.id)}
              className="mt-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              {showCodeFor === character.id ? "Hide Code" : "Show Code"}
            </button>
            {showCodeFor === character.id && (
              <pre className="mt-2 p-2 bg-gray-800 text-white rounded text-xs max-w-[200px] overflow-auto">
                {character.code}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 