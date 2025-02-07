"use client"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { GameCard } from "@/components/game-card"

const allGames = [
  { name: "CarPuzzle", category: "single" },
  { name: "Chess", category: "single" },
  { name: "ConnectFour", category: "single" },
  { name: "Crosswords", category: "single" },
  { name: "FifteenPuzzle", category: "single" },
  { name: "GuessTheNumber", category: "single" },
  { name: "GuessWho", category: "single" },
  { name: "Hangman", category: "single" },
  { name: "LogicPuzzle", category: "single" },
  { name: "MathProof", category: "single" },
  { name: "Minesweeper", category: "single" },
  { name: "Sudoku", category: "single" },
  { name: "TowerOfHanoi", category: "single" },
  { name: "TwentyQuestions", category: "single" },
  { name: "WordLadder", category: "single" },
  { name: "WordSearch", category: "single" },
  { name: "Battleship", category: "two" },
  { name: "Brass", category: "two" },
  { name: "CarPuzzle", category: "two" },
  { name: "Chess", category: "two" },
  { name: "ConnectFour", category: "two" },
  { name: "Debate", category: "two" },
  { name: "DontSayIt", category: "two" },
  { name: "IteratedPrisonersDilemma", category: "two" },
  { name: "Jaipur", category: "two" },
  { name: "LetterAuction", category: "two" },
  { name: "LiarsDice", category: "two" },
  { name: "Mastermind", category: "two" },
  { name: "MathProof", category: "two" },
  { name: "MemoryGame", category: "two" },
  { name: "Negotiation", category: "two" },
  { name: "Poker", category: "two" },
  { name: "ScenarioPlanning", category: "two" },
  { name: "SpellingBee", category: "two" },
  { name: "SpiteAndMalice", category: "two" },
  { name: "Stratego", category: "two" },
  { name: "Taboo", category: "two" },
  { name: "Tak", category: "two" },
  { name: "UltimateTicTacToe", category: "two" },
  { name: "TruthAndDeception", category: "two" },
  { name: "WordChains", category: "two" },
  { name: "7 Wonders", category: "multi" },
  { name: "Bohnanza", category: "multi" },
  { name: "Codenames", category: "multi" },
  { name: "Negotiation", category: "multi" },
  { name: "Poker", category: "multi" },
  { name: "Risk", category: "multi" },
  { name: "SettlersOfCatan", category: "multi" },
  { name: "TerraformingMars", category: "multi" },
  { name: "Werewolf", category: "multi" },
]

export default function EnvironmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSinglePlayerOpen, setIsSinglePlayerOpen] = useState(true)
  const [isTwoPlayerOpen, setIsTwoPlayerOpen] = useState(true)
  const [isMultiPlayerOpen, setIsMultiPlayerOpen] = useState(true)

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
                  key={game.name}
                  name={game.name}
                  href={`/environments/${game.name.toLowerCase()}`}
                  gifSrc={`/gifs/${game.name.toLowerCase()}.gif`}
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
                  key={game.name}
                  name={game.name}
                  href={`/environments/${game.name.toLowerCase()}`}
                  gifSrc={`/gifs/${game.name.toLowerCase()}.gif`}
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
                  key={game.name}
                  name={game.name}
                  href={`/environments/${game.name.toLowerCase()}`}
                  gifSrc={`/gifs/${game.name.toLowerCase()}.gif`}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </section>
    </div>
  )
}

