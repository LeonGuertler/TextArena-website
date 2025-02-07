// "use client"

// import { Button } from "@/components/ui/button"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// const twoPlayerGames = [
//   {
//     name: "Chess",
//     available: true,
//     description:
//       "A classic strategy game where two players move pieces on a checkered board with the goal of checkmating the opponent's king.",
//   },
//   {
//     name: "ConnectFour",
//     available: true,
//     description:
//       "A two-player connection game in which players drop colored discs into a vertical grid, aiming to connect four of their own discs.",
//   },
//   {
//     name: "Debate",
//     available: true,
//     description:
//       "A structured discussion where two parties present arguments and counter-arguments on a specific topic.",
//   },
//   {
//     name: "DontSayIt",
//     available: true,
//     description:
//       "A word-guessing game where players try to get their teammate to guess a word without using certain forbidden words.",
//   },
//   {
//     name: "IteratedPrisonersDilemma",
//     available: true,
//     description:
//       "A game theory scenario where two players must decide whether to cooperate or betray each other over multiple rounds.",
//   },
//   {
//     name: "LiarsDice",
//     available: true,
//     description:
//       "A bluffing dice game where players make bids on the total number of dice with a certain value on the table.",
//   },
//   {
//     name: "Negotiation",
//     available: true,
//     description:
//       "A game where two players engage in a discussion to reach a mutually beneficial agreement on a given scenario.",
//   },
//   {
//     name: "Poker",
//     available: true,
//     description:
//       "A card game involving betting and bluffing, where players aim to win by having the best hand or by making others fold.",
//   },
//   {
//     name: "SpellingBee",
//     available: true,
//     description: "A word game where players try to spell words correctly based on a given definition or context.",
//   },
//   {
//     name: "Stratego",
//     available: true,
//     description: "A strategy board game where two players command armies and try to capture the opponent's flag.",
//   },
//   {
//     name: "Tak",
//     available: true,
//     description: "An abstract strategy game where players aim to create a road of their pieces across the board.",
//   },
//   {
//     name: "UltimateTicTacToe",
//     available: true,
//     description: "A complex version of Tic-Tac-Toe where each cell of the game contains a smaller Tic-Tac-Toe board.",
//   },
//   {
//     name: "TruthAndDeception",
//     available: true,
//     description: "A game where players must discern truth from lies in a series of statements made by their opponent.",
//   },
//   {
//     name: "WordChains",
//     available: true,
//     description:
//       "A word game where players take turns saying words that begin with the last letter of the previous word.",
//   },
//   {
//     name: "Battleship",
//     available: false,
//     description:
//       "A guessing game where players try to sink their opponent's fleet of ships by calling out coordinates on a grid.",
//   },
//   {
//     name: "Brass",
//     available: false,
//     description:
//       "An economic strategy game set in the Industrial Revolution, where players compete to build networks of industries and connections.",
//   },
//   {
//     name: "CarPuzzle",
//     available: false,
//     description:
//       "A logic puzzle where players must maneuver cars to allow a specific car to exit a gridlocked parking lot.",
//   },
//   {
//     name: "Jaipur",
//     available: false,
//     description:
//       "A two-player card game where players are merchants competing to become the Maharaja's personal trader.",
//   },
//   {
//     name: "LetterAuction",
//     available: false,
//     description: "A word game where players bid on letters to form words and score points.",
//   },
//   {
//     name: "Mastermind",
//     available: false,
//     description:
//       "A code-breaking game where one player creates a secret code and the other tries to guess it within a limited number of tries.",
//   },
//   {
//     name: "MathProof",
//     available: false,
//     description: "A game where players construct mathematical proofs to solve given theorems or problems.",
//   },
//   {
//     name: "MemoryGame",
//     available: false,
//     description:
//       "A game where players must remember the locations of paired cards in a grid, flipping them over two at a time.",
//   },
//   {
//     name: "ScenarioPlanning",
//     available: false,
//     description:
//       "A strategic thinking game where players develop and analyze potential future scenarios based on current trends and uncertainties.",
//   },
//   {
//     name: "SpiteAndMalice",
//     available: false,
//     description: "A card game where players race to be the first to play all of their cards from their pay-off pile.",
//   },
//   {
//     name: "Taboo",
//     available: false,
//     description:
//       "A word-guessing party game where a player must get their team to guess a word without using certain related words.",
//   },
// ]

// interface EnvironmentSelectorProps {
//   selectedGames: string[]
//   onSelectedGamesChange: (games: string[]) => void
// }

// export function EnvironmentSelector({ selectedGames, onSelectedGamesChange }: EnvironmentSelectorProps) {
//   const handleEnvironmentToggle = (environment: string) => {
//     onSelectedGamesChange(
//       selectedGames.includes(environment)
//         ? selectedGames.filter((e) => e !== environment)
//         : [...selectedGames, environment],
//     )
//   }

//   return (
//     <ScrollArea className="h-[300px] w-[300px]">
//       <div className="grid grid-cols-2 gap-2 p-2">
//         {twoPlayerGames.map((game) => (
//           <TooltipProvider key={game.name}>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant={selectedGames.includes(game.name) ? "default" : "outline"}
//                   className={`h-16 w-full text-xs ${game.available ? "" : "opacity-50 cursor-not-allowed"}`}
//                   onClick={() => game.available && handleEnvironmentToggle(game.name)}
//                   disabled={!game.available}
//                 >
//                   <span className="truncate">{game.name}</span>
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p className="max-w-xs text-xs">{game.description}</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         ))}
//       </div>
//     </ScrollArea>
//   )
// }

"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface EnvironmentOption {
  id: string
  env_name: string
  description: string
  active: boolean
}

interface EnvironmentSelectorProps {
  options: EnvironmentOption[]
  selectedGames: string[]
  onSelectedGamesChange: (games: string[]) => void
}

export function EnvironmentSelector({ options, selectedGames, onSelectedGamesChange }: EnvironmentSelectorProps) {
  const handleEnvironmentToggle = (environmentId: string) => {
    onSelectedGamesChange(
      selectedGames.includes(environmentId)
        ? selectedGames.filter((e) => e !== environmentId)
        : [...selectedGames, environmentId],
    )
  }

  return (
    <ScrollArea className="h-[300px] w-[300px]">
      <div className="grid grid-cols-2 gap-2 p-2">
        {options.map((option) => {
          // Debug log for the description
          console.log(`Environment ${option.env_name} description:`, option.description)
          return (
            <TooltipProvider key={option.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedGames.includes(option.id) ? "default" : "outline"}
                    className={`h-16 w-full text-xs ${option.active ? "" : "opacity-50 cursor-not-allowed"}`}
                    onClick={() => option.active && handleEnvironmentToggle(option.id)}
                    disabled={!option.active}
                  >
                    <span className="truncate">{option.env_name}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">{option.description || "No description available."}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
    </ScrollArea>
  )
}
