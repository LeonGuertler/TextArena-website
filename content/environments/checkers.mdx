# Checkers Environment Documentation

## Overview

**Checkers** (also known as Draughts) is a turn-based game played on an 8×8 board.  
Each player controls a set of pieces placed on alternating dark squares.  
Pieces move diagonally forward and can capture opponent pieces by jumping over them.  
A piece that reaches the opposite side of the board becomes a "King," gaining the ability to move backward as well.  
The game ends when one player’s pieces are all captured or when a player has no valid moves left.

**In this environment:**

- **Players:** 2 (Red and Black)
- **Board Size:** 8×8
- **Pieces:**
  - `'r'`: Red piece
  - `'b'`: Black piece
  - `'R'`: Red King
  - `'B'`: Black King
  - `'.'`: Empty square
- **Objective:** Capture or block all opponent pieces.

---

## Action Space

- **Format:** `[r1 c1 r2 c2]` indicating moving the piece at `(r1, c1)` to `(r2, c2)`.
- **Examples:**
  - `[2 1 3 2]` moves the piece at row=2, col=1 to row=3, col=2.
- **Notes:**
  - Any extra text in the action string is acceptable as long as the bracketed substring matches the regex.
  - Invalid actions (e.g., out-of-bounds or illegal moves) trigger a penalty under the environment’s `invalid_move` logic.

---

## Observation Space

### Reset Observations
Upon resetting, each player receives:

```plaintext
You are Player 0 playing as Red.
Make your move in the format [rowFrom colFrom rowTo colTo], e.g. [2 1 3 2].
...
Here is the current board:
     0  1  2  3  4  5  6  7
   +-------------------------
 0 | .  b  .  b  .  b  .  b
 1 | b  .  b  .  b  .  b  .
 2 | .  b  .  b  .  b  .  b
 3 | .  .  .  .  .  .  .  .
 4 | .  .  .  .  .  .  .  .
 5 | r  .  r  .  r  .  r  .
 6 | .  r  .  r  .  r  .  r
 7 | r  .  r  .  r  .  r  .
```

### Step Observations
After each step, all players see the relevant moves and updated board. For example:

```plaintext
[Player 1] [2 1 3 2]
[GAME] Player 1 moved (2,1) -> (3,2).
     0  1  2  3  4  5  6  7
   +-------------------------
 0 | .  b  .  b  .  b  .  b
 1 | b  .  b  .  b  .  b  .
 2 | .  .  .  b  .  b  .  b
 3 | .  .  b  .  .  .  .  .
```

---

## Gameplay

1. **Initial Setup:**
   - Each player has 12 pieces on alternating dark squares in the first three rows for Black (rows 0..2) and last three rows for Red (rows 5..7).

2. **Turns:**
   - Red (player 0) goes first, then Black (player 1), alternating turns.

3. **Movement:**
   - **Non-King pieces** move diagonally forward by 1 step to an empty square (`'.'`) or capture an opponent piece by jumping over it.
   - **Kinged pieces** (denoted `'R'` or `'B'`) can move diagonally in any direction.

4. **Capturing:**
   - Pieces capture by jumping diagonally over an opponent’s piece into an empty space behind it.
   - Although not fully enforced here, standard Checkers typically requires multiple jumps if available.

5. **Kinging:**
   - A piece reaching the opposite end of the board becomes a King (`'r'` → `'R'`, `'b'` → `'B'`).

6. **Winning Conditions:**
   - A player wins if the opponent has no pieces left or has no valid moves.
   - The environment may also declare a draw if the `max_turns` limit is reached.

---

## Rewards

| Outcome            | Reward for Winner | Reward for Loser |
|--------------------|:-----------------:|:----------------:|
| **Win**            | `+1`              | `-1`             |
| **Loss**           | `-1`              | `0` or `-1`      |
| **Draw/Truncated** | `0`               | `0`              |
| **Invalid Move**   | `-1` (offending player) | `0`  |


---

## Parameters

- `max_turns` (`int`, default: `50`):
  - **Description:** Maximum number of turns before the environment auto-ends in a draw.
  - **Impact:** Limits the game’s length; can be increased for more complex or complete play.

---

## Variants

| Env ID               | max_turns |
|----------------------|:---------:|
| `Checkers-v0`        | `50`      |


---

## Contact

If you have questions or face issues with this Checkers environment, please reach out to  
[guertlerlo@cfar.a-star.edu.sg](mailto:guertlerlo@cfar.a-star.edu.sg).
