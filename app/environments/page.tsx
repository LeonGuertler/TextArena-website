"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { GameCard } from "@/components/game-card"
import { allGames } from "@/lib/games-data"

export default function EnvironmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filterGames = (games) => {
    return games.filter((game) => 
      game.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 font-mono">
      <h1 className="text-3xl font-bold mb-8">Game Environments</h1>

      <Input
        type="search"
        placeholder="Search games..."
        className="mb-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">All Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filterGames(allGames).map((game) => (
            <GameCard
              key={game.name} // Still assuming uniqueness
              name={game.name}
              href={`/environments/${game.name.toLowerCase()}`}
              numPlayers={game.num_players} // Passing num_players as numPlayers
            />
          ))}
        </div>
      </section>
    </div>
  )
}