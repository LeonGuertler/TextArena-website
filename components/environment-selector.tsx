"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Clock3 } from "lucide-react"

export interface EnvironmentOption {
  id: string
  env_name: string
  description: string
  active: boolean
  num_players: number
  avg_duration_seconds?: number
}

interface EnvironmentSelectorProps {
  options: EnvironmentOption[]
  selectedGames: string[]
  onSelectedGamesChange: (games: string[]) => void
  customSortOrder?: number[] // New prop for custom sort order
}

// Helper function to format duration in minutes
function formatDuration(seconds?: number): string {
  if (!seconds) return "Unknown"
  const minutes = Math.round(seconds / 60)
  return `~${minutes} min`
}

export function EnvironmentSelector({ 
  options, 
  selectedGames, 
  onSelectedGamesChange, 
  customSortOrder = [] // Default to empty array
}: EnvironmentSelectorProps) {
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

  // Sort the options using the custom sort order
  const sortedOptions = [...options].filter(option => option.active).sort((a, b) => {
    const aId = parseInt(a.id)
    const bId = parseInt(b.id)
    
    // Check if both IDs are in the custom sort order
    const aIndex = customSortOrder.indexOf(aId)
    const bIndex = customSortOrder.indexOf(bId)
    
    // Case 1: Both IDs are in custom sort order
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex
    }
    
    // Case 2: Only a's ID is in custom sort order
    if (aIndex !== -1) {
      return -1 // a comes first
    }
    
    // Case 3: Only b's ID is in custom sort order
    if (bIndex !== -1) {
      return 1 // b comes first
    }
    
    // Case 4: Neither ID is in custom sort order, sort alphabetically
    return a.env_name.localeCompare(b.env_name)
  })

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
          {sortedOptions.map((option) => (
            <TooltipProvider key={option.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    {/* Custom button implementation */}
                    <div
                      className={cn(
                        "h-[85px] w-full rounded-md border border-input relative",
                        isMobile ? "px-1" : "px-3",
                        "flex flex-col items-center justify-center",
                        selectedGames.includes(option.id)
                          ? "bg-white text-[#0b2b26] border-primary" 
                          : "bg-transparent text-secondary-foreground"
                      )}
                      onClick={() => handleEnvironmentToggle(option.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <span
                        className={cn(
                          "whitespace-normal break-words text-center max-w-[100%]",
                          isMobile ? "text-[10px]" : "text-xs"
                        )}
                      >
                        {option.env_name}
                      </span>

                      <div className="flex flex-wrap gap-1 mt-1 justify-center">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px]",
                            "bg-green-950 text-white"
                          )}
                        >
                          {option.num_players} {option.num_players === 1 ? "player" : "players"}
                        </span>
                        {option.avg_duration_seconds && (
                          <span
                            className={cn(
                              "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px]",
                              "bg-blue-900 text-white"
                            )}
                          >
                            <Clock3 className="h-[10px] w-[10px] mr-0.5 opacity-80" strokeWidth={1} /> {formatDuration(option.avg_duration_seconds)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    {option.description || "No description available."}
                    {option.avg_duration_seconds && (
                      <><br /><br /><span className="font-semibold">Average game duration:</span> {formatDuration(option.avg_duration_seconds)}</>
                    )}
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