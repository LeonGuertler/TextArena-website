// app/docs/chess/page.tsx
import { GameDocumentation } from "@/components/game-documentation"

export default function ChessDocumentation() {
  return (
    <GameDocumentation
      name="Chess"
      description="Chess is a two-player strategy game..."
      rules={[
        "The game is played on a square board...",
        "White moves first...",
        // ...
      ]}
      actionSpace="Actions are strings representing moves in standard chess notation, e.g. [move e4]."
      observationSpace="Players see the full board and moves so far."
      gameplay={[
        "Players alternate turns.",
        "Goal is to checkmate the opponent's king.",
        // ...
      ]}
      keyRules={[
        {
          title: "Move Mechanics",
          rules: [
            "White moves first, then Black.",
            "Pieces move according to chess rules...",
          ],
        },
        // more sections...
      ]}
      rewards={[
        { outcome: "Win", player: "+1", opponent: "-1" },
        { outcome: "Lose", player: "-1", opponent: "+1" },
        { outcome: "Draw", player: "0", opponent: "0" },
        { outcome: "Invalid Move", player: "-1", opponent: "0" },
      ]}
      parameters={[
        {
          name: "time_control",
          type: "int",
          description: "Time (seconds) per side.",
          impact: ["If time reaches zero, that side loses."],
        },
        // ...
      ]}
      variants={[
        { id: "Chess-v0", isOpen: "True", numRows: "8", numCols: "8" },
        // ...
      ]}
      exampleUsage={`import textarena as ta
// ...
// Example usage code ...
`}
      troubleshooting={[
        {
          issue: "Invalid Move Format",
          solution: "Ensure moves are in [move e4] format, for example.",
        },
        // ...
      ]}
      contact="If you have any questions, email contact@chess.org"
      gifSrc="/gifs/chess.gif"
    />
  )
}
