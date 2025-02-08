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

  // Select all active environments.
  const handleSelectAll = () => {
    const activeIds = options.filter((o) => o.active).map((o) => o.id)
    onSelectedGamesChange(activeIds)
  }

  // Unselect all environments.
  const handleUnselectAll = () => {
    onSelectedGamesChange([])
  }

  return (
    <ScrollArea className="h-[300px] w-[300px]">
      <div className="p-2">
        {/* Centered header with equal-width clickable fields */}
        <div className="flex justify-center items-center mb-2">
          <span
            onClick={handleSelectAll}
            className="cursor-pointer text-white text-sm flex-1 text-center"
          >
            Select All
          </span>
          <span className="mx-2 text-white">|</span>
          <span
            onClick={handleUnselectAll}
            className="cursor-pointer text-white text-sm flex-1 text-center"
          >
            Unselect All
          </span>
        </div>
        {/* Only show active environments */}
        <div className="grid grid-cols-2 gap-2">
          {options.filter((option) => option.active).map((option) => {
            console.log(`Environment ${option.env_name} description:`, option.description)
            return (
              <TooltipProvider key={option.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={selectedGames.includes(option.id) ? "default" : "outline"}
                      className="h-16 w-full text-xs"
                      onClick={() => handleEnvironmentToggle(option.id)}
                    >
                      <span className="truncate">{option.env_name}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      {option.description || "No description available."}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
      </div>
    </ScrollArea>
  )
}
