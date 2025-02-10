"use client"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { GameCard } from "@/components/game-card"
import { allGames } from "@/lib/games-data"

export default function EnvironmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSinglePlayerOpen, setIsSinglePlayerOpen] = useState(false)
  const [isTwoPlayerOpen, setIsTwoPlayerOpen] = useState(true)
  const [isMultiPlayerOpen, setIsMultiPlayerOpen] = useState(false)

  const filterGames = (games, category) => {
    return games
      .filter((game) => game.category === category)
      .filter((game) => game.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Game Environments</h1>

      <Input
        type="search"
        placeholder="Search games..."
        className="mb-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <section className="mb-12">
        <Collapsible open={isSinglePlayerOpen} onOpenChange={setIsSinglePlayerOpen}>
          <CollapsibleTrigger asChild>
            <div className="flex w-full items-center justify-between mb-4 cursor-pointer text-left">
              <h2 className="text-2xl font-semibold">Single-Player Games</h2>
              {isSinglePlayerOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filterGames(allGames, "single").map((game) => (
                <GameCard
                  key={`${game.category}-${game.name}`}
                  name={game.name}
                  category={game.category}
                  href={`/environments/${game.category}/${game.name.toLowerCase()}`}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </section>

      <section className="mb-12">
        <Collapsible open={isTwoPlayerOpen} onOpenChange={setIsTwoPlayerOpen}>
          <CollapsibleTrigger asChild>
            <div className="flex w-full items-center justify-between mb-4 cursor-pointer text-left">
              <h2 className="text-2xl font-semibold">Two-Player Games</h2>
              {isTwoPlayerOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filterGames(allGames, "two").map((game) => (
                <GameCard
                  key={`${game.category}-${game.name}`}
                  name={game.name}
                  category={game.category}
                  href={`/environments/${game.category}/${game.name.toLowerCase()}`}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </section>

      <section className="mb-12">
        <Collapsible open={isMultiPlayerOpen} onOpenChange={setIsMultiPlayerOpen}>
          <CollapsibleTrigger asChild>
            <div className="flex w-full items-center justify-between mb-4 cursor-pointer text-left">
              <h2 className="text-2xl font-semibold">Multi-Player Games</h2>
              {isMultiPlayerOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filterGames(allGames, "multi").map((game) => (
                <GameCard
                  key={`${game.category}-${game.name}`}
                  name={game.name}
                  category={game.category}
                  href={`/environments/${game.category}/${game.name.toLowerCase()}`}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </section>
    </div>
  )
}

