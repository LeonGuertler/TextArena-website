# Snake Environment Documentation

## Overview
**Snake** is a multi-player adaptation of the classic arcade game where each player controls a snake that grows by eating apples. In this implementation, multiple players (2-15) move simultaneously on a shared grid. Players must navigate their snakes to collect apples while avoiding walls, other snakes, and their own bodies. The game features simultaneous movement, where all living snakes' moves are collected and then executed at once. This creates a dynamic, strategic environment where players must anticipate others' movements to survive and thrive.

## Action Space

- **Format:** Actions are directional commands specifying which way to move the snake, provided in square brackets.
- **Examples:**
  - Move upward: `[up]` or `[w]`
  - Move downward: `[down]` or `[s]`
  - Move leftward: `[left]` or `[a]`
  - Move rightward: `[right]` or `[d]`
- **Notes:** Players can include additional text before and after their directional command. The game recognizes both the arrow directions and WASD key equivalents.

## Observation Space

**Reset Observations**
On reset, each player receives a prompt containing the game board and their snake identification. For example:

```plaintext
4-Player Snake on a 10x10 grid.
You control snake 0.
Valid moves: '[up]'/'[w]', '[down]'/'[s]', '[left]'/'[a]', '[right]'/'[d]'.
Current board:
+---------------------+
| . . . . . . . . . . |
| . . . . . . . . . . |
| . . . . . . . 3 . . |
| . . . A . . . . . . |
| . . . . . . . . . . |
| . . . . 2 . . . A . |
| . . 1 . . . . . . . |
| . . . . . . . . . . |
| . . A . . . . 0 . . |
| . . . . . . . . . . |
+---------------------+
Scores: {0: 0, 1: 0, 2: 0, 3: 0}
```

**Step Observations**
After each round of simultaneous movements, all players receive an updated board state. For example:

```plaintext
[Player 0] I'll move right to approach the apple. [right]
[Player 1] Moving up to get closer to an apple. [up]
[Player 2] I'll go left to avoid the wall. [left]
[Player 3] Moving down to grab that apple. [down]
[GAME] Board after simultaneous moves:
+---------------------+
| . . . . . . . . . . |
| . . . . . . . . . . |
| . . . . . . . . . . |
| . . . A . . . 3 . . |
| . . . . . . . . . . |
| . . 1 4 . . . . A . |
| . . . . . . . . . . |
| . . . . . . . . . . |
| . . A . . . . . 0 . |
| . . . . . . . . . . |
+---------------------+
Scores: {0: 0, 1: 0, 2: 0, 3: 1}
```

## Gameplay

- **Players:** 2-15 players
- **Initial Setup:** Each player starts with a single-cell snake at a random position on the grid
- **Board:** A rectangular grid (default: 10×10) with randomly placed apples
- **Turns:** Players submit moves simultaneously, and all moves are executed at once
- **Objective:** Grow your snake by collecting apples and survive longer than other players
- **Maximum Turns:** Configurable, default is 100 turns

## Key Rules

1. **Movement:**
   - Snakes move one cell at a time in one of four directions: up, down, left, or right
   - All living snakes move simultaneously after all players have submitted their moves
   - A snake of length 1 cannot stay in place (i.e., cannot move into its own cell)

2. **Growth:**
   - When a snake's head moves into a cell containing an apple, the snake grows by one cell
   - The apple is consumed and a new apple appears at a random empty location
   - The player's score increases by 1 for each apple consumed

3. **Collision and Death:**
   - A snake dies if its head moves outside the grid boundaries
   - A snake dies if its head moves into a cell occupied by any snake's body
   - If multiple snakes attempt to move their heads into the same cell, all those snakes die (head-on collision)
   - If two snakes attempt to swap positions, both snakes die
   - A snake can move into its own tail cell only if it's not growing on that turn

4. **Valid Moves:**
   - Only directional commands ([up]/[w], [down]/[s], [left]/[a], [right]/[d]) are accepted
   - Invalid move formats require the player to retry their turn

5. **Winning Conditions:**
   - **Last Survivor:** If only one snake remains alive, that player wins
   - **Turn Limit:** If the turn limit is reached, the player with the highest score among surviving snakes wins
   - **Tiebreaker:** If all snakes die simultaneously or have the same score at the turn limit, the result is a draw
   - **Survival Tiebreaker:** If all snakes die but at different times, the player(s) who survived the longest win(s)

6. **Game Termination:**
   - The game concludes when only one snake remains alive, all snakes are dead, or the turn limit is reached

## Rewards

| Outcome           | Reward for Winner | Reward for Others |
|-------------------|:-----------------:|:-----------------:|
| **Win**           | `+1`              | `-1`              |
| **Draw**          | `0`               | `0`               |
| **Invalid Move**  | `-1`              | `0`               |

## Parameters

- `width` (`int`, default: `10`):
  - **Description:** Sets the width of the game grid
  - **Impact:** Larger grids provide more space for movement and survival

- `height` (`int`, default: `10`):
  - **Description:** Sets the height of the game grid
  - **Impact:** Larger grids provide more space for movement and survival

- `num_apples` (`int`, default: `3`):
  - **Description:** Sets the number of apples on the grid at any time
  - **Impact:** More apples increase growth opportunities and potential scores

- `max_turns` (`int`, default: `100`):
  - **Description:** Sets the maximum number of turns before the game ends
  - **Impact:** Longer games allow for larger snakes and more complex strategies

## Variants

| Env-id                 | width | height | num_apples | max_turns |
|------------------------|:-----:|:------:|:----------:|:---------:|
| `Snake-v0`             | `5`   | `5`    | `2`        | `40`      |
| `Snake-v0-standard`    | `10`  | `10`   | `3`        | `100`     |
| `Snake-v0-large`       | `15`  | `15`   | `5`        | `250`     |


### Contact
If you have questions or face issues with this specific environment, please reach out directly to Guertlerlo@cfar.a-star.edu.sg