// app/game/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Trophy, Minus, X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface GameMessage {
    sender: "left" | "right" | "center"
    text: string
}

interface SharedGameData {
    messages: GameMessage[];
    metadata: {
      game_id: string | number;
      outcome: string | null;
      opponent_name: string;
      opponent_elo: number;
      change_in_elo: number;
      reason: string;
      timestamp: string;
    }
  }


export default function GamePage({ params }: { params: { id: string } }) {
  const [gameData, setGameData] = useState<SharedGameData | null>(null);
  const [loading, setLoading] = useState(true);


useEffect(() => {
    const fetchGame = async () => {
      try {
        //const response = await fetch(`https://localhost:8000/api/games/${params.id}`);
        const response = await fetch(`http://54.179.78.11:8000/api/games/${params.id}`);
        if (!response.ok) throw new Error('Game not found');
        const data = await response.json();
        setGameData(data);
      } catch (error) {
        console.error('Error fetching game:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchGame();
  }, [params.id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!gameData) {
    return <div className="flex items-center justify-center min-h-screen">Game not found</div>;
  }

  const getOutcomeIcon = () => {
    switch (gameData.metadata.outcome?.toLowerCase()) {
      case 'win':
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 'loss':
        return <X className="h-6 w-6 text-red-500" />;
      case 'draw':
        return <Minus className="h-6 w-6 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with game info */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getOutcomeIcon()}
          <span className="font-medium">
            vs {gameData.metadata.opponent_name} ({gameData.metadata.opponent_elo})
          </span>
        </div>
        <div className={cn(
          "font-medium",
          gameData.metadata.change_in_elo >= 0 ? "text-green-500" : "text-red-500"
        )}>
          {gameData.metadata.change_in_elo >= 0 ? '+' : ''}{gameData.metadata.change_in_elo}
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-4 space-y-2 font-mono" style={{ fontFamily: "'Ubuntu Mono', monospace" }}>
        {gameData.messages.map((message, i) => {
          let containerClass = "flex justify-center mb-2";
          let maxWidthClass = "max-w-[60%]";
          
          if (message.sender === "left") {
            containerClass = "flex justify-start mb-2";
          } else if (message.sender === "right") {
            containerClass = "flex justify-end mb-2";
          }

          let bubbleClass = "text-muted-foreground";
          if (message.sender === "left") {
            bubbleClass = "bg-accent text-accent-foreground px-3 py-1.5 rounded-lg";
          } else if (message.sender === "right") {
            bubbleClass = "bg-primary text-primary-foreground px-3 py-1.5 rounded-lg";
          }

          return (
            <div key={i} className={containerClass}>
              <div className={maxWidthClass}>
                <span className={cn(
                  bubbleClass,
                  "whitespace-pre-wrap break-words inline-block",
                  message.sender === "center" ? "text-center w-full" : ""
                )}>
                  {message.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer with game outcome */}
      <div className="border-t p-4 text-center text-sm text-muted-foreground">
        {gameData.metadata.reason}
      </div>
    </div>
  );
}