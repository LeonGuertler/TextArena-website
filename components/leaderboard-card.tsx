import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { BadgeCheck, MoonStar, Sprout } from "lucide-react"

interface LeaderboardCardProps {
  rank: number
  model: {
    model_id: number
    model_name: string
    human_id: number
    human_name: string
    trueskill: number
    trueskill_sd: number
    games_played: number
    win_rate: number
    wins: number
    draws: number
    losses: number
    avg_time: number
    is_standard: boolean
    is_active: boolean
    small_category: boolean
  }
  selectedSubset: string // Add this line
}

export function LeaderboardCard({ rank, model, selectedSubset }: LeaderboardCardProps) {
  return (
    <Card className="w-full bg-[hsl(var(--navbar))] border border-[hsl(var(--border))] overflow-hidden">
      <CardContent className="p-3 sm:p-4">
        <div className="flex justify-between items-start mb-4">
          {/* Left side */}
          <div className="flex-1 min-w-0 mr-2">
            {/* Use a positioned container */}
            <div className="relative">
              {/* Model name with right padding to make room for badges */}
              <Link
                href={`/leaderboard/${encodeURIComponent(model.model_name)}/${model.model_id}/${model.human_id}/${encodeURIComponent(selectedSubset)}`}
                className={`text-lg font-semibold text-navbarForeground hover:underline font-mono inline-block ${(model.is_standard || !model.is_active) ? 'pr-10' : ''}`}
              >
                {model.model_name}
              </Link>
              
              {/* Absolutely positioned badges that will always appear after the model name */}
              {(model.is_standard || !model.is_active || model.small_category) && (
                <div className="absolute top-1 right-0 flex items-center">
                  {model.is_standard && (
                    <div className="relative group mr-1">
                      <BadgeCheck size={20} className="text-blue-400" />
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block bg-background p-1.5 rounded-lg border border-navbar shadow-lg z-20">
                        <p className="text-xs text-muted-foreground font-mono whitespace-nowrap">Standard model</p>
                      </div>
                    </div>
                  )}
                  {model.small_category && (
                    <div className="relative group mr-1">
                      <Sprout size={20} className="text-green-400" />
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block bg-background p-1.5 rounded-lg border border-navbar shadow-lg z-20">
                        <p className="text-xs text-muted-foreground font-mono whitespace-nowrap">Small category</p>
                      </div>
                    </div>
                  )}
                  {!model.is_active && (
                    <div className="relative group">
                      <MoonStar size={20} className="text-gray-400" />
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block bg-background p-1.5 rounded-lg border border-navbar shadow-lg z-20">
                        <p className="text-xs text-muted-foreground font-mono whitespace-nowrap">Inactive model</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Add human name below model name */}
            <div className="text-sm text-navbarForeground mt-1">
              {model.human_name}
            </div>
          </div>
          
          {/* Right side */}
          <div className="text-2xl font-bold text-navbarForeground font-mono flex-shrink-0">#{rank}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 font-mono">
          <div>
            <div className="text-xs text-muted-foreground">Trueskill Rating</div>
            <div className="text-sm text-navbarForeground">{model.trueskill.toFixed(1)} ± {model.trueskill_sd.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Games Played</div>
            <div className="text-sm text-navbarForeground">{model.games_played.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Win Rate</div>
            <div className="text-sm text-navbarForeground">{(model.win_rate * 100).toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">W/D/L</div>
            <div className="text-sm">
              <span className="text-green-400">{model.wins}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-gray-400">{model.draws}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-red-400">{model.losses}</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Avg. Time</div>
            <div className="text-sm text-navbarForeground">{model.avg_time.toFixed(1)}s</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}