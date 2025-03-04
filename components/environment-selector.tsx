"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

export interface EnvironmentOption {
  id: string
  env_name: string
  description: string
  active: boolean
  num_players: number // Already updated from Step 1
}

interface EnvironmentSelectorProps {
  options: EnvironmentOption[]
  selectedGames: string[] // Note: This is string[] here, matching the component's usage
  onSelectedGamesChange: (games: string[]) => void
}

export function EnvironmentSelector({ options, selectedGames, onSelectedGamesChange }: EnvironmentSelectorProps) {
  const isMobile = useIsMobile()

  const handleEnvironmentToggle = (environmentId: string) => {
    onSelectedGamesChange(
      selectedGames.includes(environmentId)
        ? selectedGames.filter((e) => e !== environmentId)
        : [...selectedGames, environmentId],
    )
  }

  const handleSelectAll = () => {
    const activeIds = options.filter((o) => o.active).map((o) => o.id)
    onSelectedGamesChange(activeIds)
  }

  const handleUnselectAll = () => {
    onSelectedGamesChange([])
  }

  const columns = isMobile ? "grid-cols-2" : "grid-cols-3"
  const width = isMobile ? "w-[300px]" : "w-[600px]"
  const height = "h-[300px]"

  return (
    <ScrollArea className={cn(height, width)}>
      <div className="p-2">
        <div className="flex justify-center items-center mb-2">
          <span
            onClick={handleSelectAll}
            className="cursor-pointer text-navbarForeground text-sm flex-1 text-center font-bold"
          >
            SELECT ALL
          </span>
          <span className="mx-2 text-navbarForeground">|</span>
          <span
            onClick={handleUnselectAll}
            className="cursor-pointer text-navbarForeground text-sm flex-1 text-center font-bold"
          >
            UNSELECT ALL
          </span>
        </div>
        <div className={cn("grid gap-2", columns)}>
          {options.filter((option) => option.active).map((option) => (
            <TooltipProvider key={option.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedGames.includes(option.id) ? "default" : "outline"}
                    className={cn(
                      "h-[80px] w-full text-xs py-3 flex flex-col items-center justify-center", // Increased height to 80px, adjusted padding
                      selectedGames.includes(option.id)
                        ? "bg-white text-[#0b2b26] hover:bg-white/90"
                        : "bg-transparent text-secondary-foreground hover:bg-secondary/80"
                    )}
                    onClick={() => handleEnvironmentToggle(option.id)}
                  >
                    <span className="whitespace-normal break-words text-center max-w-[100%]">
                      {option.env_name}
                    </span>
                    <span
                      className={cn(
                        "mt-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px]",
                        "bg-green-950 text-white" // Keeping the darker green pill
                      )}
                    >
                      {option.num_players} {option.num_players === 1 ? "player" : "players"}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    {option.description || "No description available."}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}