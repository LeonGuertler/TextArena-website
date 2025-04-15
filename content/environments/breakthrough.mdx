# Breakthrough Environment Documentation

## Overview
**Breakthrough** is a two-player abstract strategy game played on an 8×8 board. Each player starts with two rows of pawns, with White occupying rows 0 and 1 and Black occupying rows 6 and 7. The objective is to either move one of your pawns to the opponent's home row or capture all of your opponent's pawns.

This environment supports all core game mechanics, including pawn movement, captures, and victory conditions. It is designed for reinforcement learning experiments, strategy testing, and AI agent training.

https://en.wikipedia.org/wiki/Breakthrough_(board_game)

---

## Action Space

- **Format:** Actions are specified using a chess-like UCI format in brackets: `[start end]`, where `start` and `end` are the starting and ending positions of a pawn.
- **Examples:**
  - `[a2a3]`: Moves the pawn from square `a2` to `a3` (straight forward).
  - `[c2b3]`: Moves the pawn diagonally forward from `c2` to `b3` to capture an opponent's piece.

### Rules for Moves
1. A pawn can move **straight forward** into an empty square.
2. A pawn can move **diagonally forward** only if capturing an opponent's piece.
3. Moving backward or sideways is not allowed.

---

## Observation Space

**Reset Observations**
Upon game start, players receive a prompt like this:

```plaintext
You are White (Player 0) or Black (Player 1).
You move forward by one square, either straight ahead or diagonally to capture.
Example move format: [a2a3] moves a pawn from a2 to a3.
Objective: Reach the opponent's home row or eliminate all their pawns.

Initial Board State:
 8 | B B B B B B B B
 7 | B B B B B B B B
 6 | . . . . . . . .
 5 | . . . . . . . .
 4 | . . . . . . . .
 3 | . . . . . . . .
 2 | W W W W W W W W
 1 | W W W W W W W W
    a b c d e f g h
```

**Step Observations**
After each move, players receive:

```plaintext
[Player 0] [a2a3]
[GAME] Player 0 moves a2a3.

Updated Board State:
 8 | B B B B B B B B
 7 | B B B B B B B B
 6 | . . . . . . . .
 5 | . . . . . . . .
 4 | . . . . . . . .
 3 | W . . . . . . .
 2 | . W W W W W W W
 1 | W W W W W W W W
    a b c d e f g h
```

---

## Gameplay

- **Players:** 2
- **Initial Setup:**
  - White pawns on rows 0 and 1.
  - Black pawns on rows 6 and 7.
- **Turns:** Players alternate turns, starting with White.
- **Objective:** Reach the opponent's home row first or capture all opponent pawns.

### Movement Rules
1. **Forward Moves:** Pawns can move one square forward into an empty space.
2. **Diagonal Captures:** Pawns can capture diagonally by moving into a square occupied by an opponent's pawn.
3. **No Backward Moves:** Movement is only allowed forward.

---

## Victory Conditions

A player wins if:
1. **Breakthrough Victory:** One of their pawns reaches the opponent’s home row.
2. **Elimination Victory:** They capture all the opponent’s pawns.

Draws are impossible since pawns cannot move backward, and the game always progresses forward.

---

## Rewards

| Outcome                  | Reward (Winner) | Reward (Loser) |
|--------------------------|:---------------:|:--------------:|
| Reached Opponent's Row   | +1              | -1             |
| Opponent's Pawns Captured| +1              | -1             |

Invalid moves will result in:

| Outcome         | Reward (Player) |
|-----------------|:---------------:|
| Invalid Move    | -1              |

---

## Parameters

| Env-ID                        | Board Size | Max Turns | Open Board |
|-------------------------------|:----------:|:---------:|:----------:|
| `Breakthrough-v0`             | `8`        | `100`     | `True`     |
| `Breakthrough-v0-small`       | `6`        | `80`      | `True`     |
| `Breakthrough-v0-large`       | `10`       | `120`     | `True`     |
| `Breakthrough-v0-blind`       | `8`        | `100`     | `False`    |
| `Breakthrough-v0-long`        | `8`        | `200`     | `True`     |

---



### Contact
If you have questions or face issues with this specific environment, please reach out directly to Guertlerlo@cfar.a-star.edu.sg
