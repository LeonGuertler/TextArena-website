import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface LeaderboardCardProps {
  rank: number
  model: {
    model_id: number
    model_name: string
    elo: number
    games_played: number
    win_rate: number
    wins: number
    draws: number
    losses: number
    avg_time: number
  }
}

export function LeaderboardCard({ rank, model }: LeaderboardCardProps) {
  return (
    <Card className="w-full bg-[hsl(var(--navbar))] border border-[hsl(var(--border))] overflow-hidden">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start mb-4">
          <div className="flex-1 min-w-0">
            <Link
              href={`/leaderboard/${encodeURIComponent(model.model_name)}`}
              className="text-lg font-semibold text-navbarForeground hover:underline font-mono line-clamp-2 break-all"
            >
              {model.model_name}
            </Link>
          </div>
          <div className="text-2xl font-bold text-navbarForeground font-mono ml-2 flex-shrink-0">#{rank}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 font-mono">
          <div>
            <div className="text-xs text-muted-foreground">Elo Rating</div>
            <div className="text-sm text-navbarForeground">{Math.round(model.elo)}</div>
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
        </div>
      </CardContent>
    </Card>
  )
}

