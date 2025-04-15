# Othello Environment Documentation

## Overview
**Othello** (also known as Reversi) is a strategic two-player board game played on an 8×8 grid. Players take turns placing their colored pieces on the board, with the objective of having the majority of their color showing when the game ends. The key mechanic involves "flipping" the opponent's pieces when they become surrounded. This implementation provides a complete game environment with move validation, piece flipping, and win/draw detection. Othello offers deeper strategic complexity than simpler games like TicTacToe while maintaining straightforward rules, making it excellent for studying perfect information games and strategic depth.

## Action Space

- **Format:** Actions are strings representing the row and column coordinates of where to place a piece, in the format `[row, col]` or `[row col]`, where row and col are 0-indexed positions on the 8×8 grid (0-7).
- **Examples:**
  - Place a piece at row 2, column 3: `[2, 3]` or `[2 3]`
  - Place a piece at row 5, column 4: `[5, 4]` or `[5 4]`
- **Notes:** Players can include additional text before and after their action command. Spaces around the coordinates are optional, and a comma between coordinates is also optional.

## Observation Space

**Reset Observations**
On reset, each player receives a prompt containing the initial game board, rules, and valid moves. For example:

```plaintext
You are playing Black pieces ('B') in Othello (Reversi).

Rules:
- On your turn, place one of your pieces on the board to capture opponent pieces.
- You must place your piece such that it creates a straight line (horizontal, vertical, or diagonal) between your new piece and another of your pieces, with opponent pieces in between.
- All opponent pieces in that line are then flipped to your color.
- You must make a move that captures at least one opponent piece.
- If you cannot make a valid move, your turn is skipped.
- The game ends when neither player can make a valid move.
- The player with more pieces on the board wins.

To submit your move, provide the coordinates as [row, col], where both row and col are between 0 and 7.
For example, '[2, 3]' places your piece at row 2, column 3.

Current board state:
  0 1 2 3 4 5 6 7
0|.|.|.|.|.|.|.|.|
1|.|.|.|.|.|.|.|.|
2|.|.|.|.|.|.|.|.|
3|.|.|.|W|B|.|.|.|
4|.|.|.|B|W|.|.|.|
5|.|.|.|.|.|.|.|.|
6|.|.|.|.|.|.|.|.|
7|.|.|.|.|.|.|.|.|

Piece count - Black: 2, White: 2
Valid moves for Black: [2, 3], [3, 2], [4, 5], [5, 4]
```

**Step Observations**
After each move, players receive an updated view of the board. For example:

```plaintext
[Black] I'll place my piece at [4, 5]
[GAME] Player 0 (B) placed a piece at [4, 5] and flipped 1 opponent W piece(s).
Current scores - Black: 4, White: 1

Updated board state:
  0 1 2 3 4 5 6 7
0|.|.|.|.|.|.|.|.|
1|.|.|.|.|.|.|.|.|
2|.|.|.|.|.|.|.|.|
3|.|.|.|W|B|.|.|.|
4|.|.|.|B|B|B|.|.|
5|.|.|.|.|.|.|.|.|
6|.|.|.|.|.|.|.|.|
7|.|.|.|.|.|.|.|.|

Piece count - Black: 4, White: 1
Valid moves for White: [3, 5], [5, 3], [5, 5]
```

## Gameplay

- **Players:** 2 players
- **Initial Setup:** An 8×8 grid with four pieces in the center arranged diagonally (two black, two white)
- **Player Symbols:** Player 0 uses 'B' (Black), Player 1 uses 'W' (White)
- **Turns:** Players take turns placing one piece per turn
- **Objective:** Have the majority of pieces on the board when the game ends

## Key Rules

1. **Grid Structure:**
   - The game is played on an 8×8 grid
   - Each cell can be empty or contain one player's piece ('B' or 'W')
   - The game starts with four pieces in the center in a diagonal pattern

2. **Turn Order:**
   - Players alternate turns, with Black typically going first
   - On each turn, a player places one piece on an empty cell

3. **Valid Moves:**
   - A move is valid only if it would flip at least one opponent piece
   - To flip pieces, the new piece must create a straight line (horizontal, vertical, or diagonal) with another piece of the same color, with opponent pieces in between
   - All opponent pieces between the new piece and the existing piece of the same color are flipped

4. **Skipping Turns:**
   - If a player has no valid moves, their turn is skipped
   - If both players have no valid moves consecutively, the game ends

5. **Winning Conditions:**
   - **Win:** The player with the most pieces on the board when the game ends wins
   - **Draw:** The game ends in a draw if both players have the same number of pieces
   - **Game End:** The game ends when the board is full or when neither player can make a valid move

6. **Game Termination:**
   - The game concludes when the board is full, when neither player can make a valid move, or after a maximum number of turns (configurable, default 60)

## Rewards

| Outcome     | Reward for Winner | Reward for Loser |
|-------------|:-----------------:|:----------------:|
| **Win**     | `+1`              | `-1`             |
| **Draw**    | `0`               | `0`              |
| **Invalid** | `-1`              | `0`              |

## Environment Parameters

The `OthelloEnv` class accepts the following initialization parameters:

- **max_turns** (Optional[int], default=60): Maximum number of turns before the game is truncated
- **show_valid** (bool, default=True): If True, players are shown valid moves in their observations

## Examples

### Valid Move with Capture

```
Board before move:
  0 1 2 3 4 5 6 7
0|.|.|.|.|.|.|.|.|
1|.|.|.|.|.|.|.|.|
2|.|.|.|.|.|.|.|.|
3|.|.|.|W|B|.|.|.|
4|.|.|.|B|W|.|.|.|
5|.|.|.|.|.|.|.|.|
6|.|.|.|.|.|.|.|.|
7|.|.|.|.|.|.|.|.|

Black plays [3, 2]:
  0 1 2 3 4 5 6 7
0|.|.|.|.|.|.|.|.|
1|.|.|.|.|.|.|.|.|
2|.|.|.|.|.|.|.|.|
3|.|.|B|B|B|.|.|.|
4|.|.|.|B|W|.|.|.|
5|.|.|.|.|.|.|.|.|
6|.|.|.|.|.|.|.|.|
7|.|.|.|.|.|.|.|.|

The move at [3, 2] creates a line between the new piece and the existing Black piece at [3, 4], 
with the White piece at [3, 3] in between. The White piece is flipped to Black.
```

### Invalid Move

```
Invalid move: Black tries to play at [0, 0]
This move doesn't create a line that would flip any White pieces, so it's invalid.

The player receives an error message:
"Player 0 tried to place a piece at an invalid position. Valid moves are: [2, 3], [3, 2], [4, 5], [5, 4]"
```

### Game End

```
Final board state (filled):
  0 1 2 3 4 5 6 7
0|B|B|B|B|B|B|B|B|
1|B|B|B|B|B|B|B|B|
2|B|B|B|B|B|B|B|B|
3|B|B|B|B|B|B|B|B|
4|B|B|B|B|B|B|B|W|
5|B|B|B|B|B|B|W|W|
6|B|B|B|B|B|W|W|W|
7|B|B|B|B|W|W|W|W|

Game over. Black wins with 54 pieces to White's 10 pieces.
```

## Note on Strategy
Unlike TicTacToe, Othello has significant strategic depth. Key principles include:
- Corner positions are valuable as they can't be flipped
- Edge positions are stronger than center positions
- Sometimes fewer pieces mid-game is advantageous for mobility
- Limiting opponent's moves can be more important than maximizing piece count early

### Contact
If you have questions or face issues with this specific environment, please reach out directly to guertlerlo@cfar.a-star.edu.sg