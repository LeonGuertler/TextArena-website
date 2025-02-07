"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Twitter } from "lucide-react"
import { cn } from "@/lib/utils"

// Simulated game data
const gameData = {
  model1: { id: 1, name: "GPT-4", elo: 2800 },
  model2: { id: 2, name: "Claude 2", elo: 2750 },
  environment: "Chess",
  viewers: 1337,
  chatHistory: [
    { role: "environment", content: "Game started. White to move." },
    { role: "model1", content: "I'll start with e4." },
    { role: "environment", content: "White plays e4. Black to move." },
    { role: "model2", content: "Interesting opening. I'll respond with e5." },
    { role: "environment", content: "Black plays e5. White to move." },
    { role: "model1", content: "Classic response. I'll play Nf3." },
    { role: "environment", content: "White plays Nf3. Black to move." },
    { role: "model2", content: "I'll develop my knight as well with Nc6." },
    { role: "environment", content: "Black plays Nc6. White to move." },
    { role: "model1", content: "Let's open up the center with d4." },
  ],
}

export function WatchGame() {
  const [game, setGame] = useState(gameData)

  const shareOnTwitter = () => {
    const text = `Watching an exciting ${game.environment} match between ${game.model1.name} and ${game.model2.name} on TextArena! Check it out!`
    const url = "https://textarena.com/watch" // Replace with actual URL
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <Link href={`/leaderboard/${game.model1.id}`} className="hover:underline">
                <h3 className="text-xl font-semibold">{game.model1.name}</h3>
              </Link>
              <p className="text-sm text-muted-foreground">ELO: {game.model1.elo}</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-1">
              {game.environment}
            </Badge>
            <div className="text-center md:text-right">
              <Link href={`/leaderboard/${game.model2.id}`} className="hover:underline">
                <h3 className="text-xl font-semibold">{game.model2.name}</h3>
              </Link>
              <p className="text-sm text-muted-foreground">ELO: {game.model2.elo}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 relative">
          <div className="h-[400px] bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Game visualization placeholder</p>
          </div>
          <div className="absolute bottom-8 left-8 bg-background/80 backdrop-blur-sm rounded-md p-2">
            <p className="text-sm font-medium">{game.viewers} watching</p>
          </div>
          <div className="absolute bottom-8 right-8">
            <Button variant="outline" size="sm" onClick={shareOnTwitter}>
              <Twitter className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <ScrollArea className="h-[300px] w-full pr-4">
            <div className="space-y-4">
              {game.chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-2.5 max-w-3xl mx-auto",
                    message.role === "model1"
                      ? "justify-start"
                      : message.role === "model2"
                        ? "justify-end"
                        : "justify-center",
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2",
                      message.role === "model1"
                        ? "bg-blue-500 text-white"
                        : message.role === "model2"
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-black",
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

