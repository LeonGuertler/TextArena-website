# Nim Environment Documentation

## Overview
**Nim** is a classic two-player mathematical strategy game involving several piles of objects. Players take turns removing at least one object from a single pile, and the player who takes the **last object wins** the game. This environment supports standard Nim gameplay, customizable pile configurations, and turn tracking.

Learn more about the game on [Wikipedia](https://en.wikipedia.org/wiki/Nim).

## Action Space

- **Format:** Actions are strings representing the player's move:
  - **Removing Objects:** Players choose a pile and the number of objects to remove using the format `[pile_index quantity]`.

- **Examples:**
  - Remove 3 objects from pile 2: `[2 3]`
  - Remove 1 object from pile 0: `[0 1]`

- **Notes:** Players must remove at least one object from a single pile. Invalid moves, such as removing more objects than available, are rejected.

## Observation Space

**Reset Observations**
On reset, each player receives an overview of the initial pile state and gameplay instructions:

```plaintext
You are Player 0 in a 2-player Nim game.
Initial piles:
  pile 0: 3
  pile 1: 4
  pile 2: 5

Rules:
- On your turn, choose a pile and remove at least 1 object from it.
- The player who removes the last object wins the game.

Your action? (e.g., '[1 3]' to remove 3 objects from pile 1)
```

**Step Observations**
After each move, players receive updates on the game state and actions taken:

```plaintext
[Player 1] Removes 2 objects from pile 1. [1 2]
[GAME] Player 1 removes 2 objects from pile 1.

Updated piles:
  pile 0: 3
  pile 1: 2
  pile 2: 5

It's now Player 0's turn.
```

## Gameplay

- **Players:** 2 players (fixed)
- **Initial Setup:** Each game starts with a customizable list of piles (default: `[3, 4, 5]`)
- **Turns:** Players take turns removing objects from any single pile
- **Objective:** Be the player to take the last object

## Key Rules

1. **Removing Objects:**
   - On your turn, select any pile with at least one object remaining
   - Remove at least one object from that pile

2. **Invalid Actions:**
   - You cannot remove objects from an empty pile
   - You cannot remove more objects than the pile contains

3. **Winning Conditions:**
   - The player who removes the **last object** wins the game

4. **Game Termination:**
   - The game ends immediately when all piles are empty

## Parameters

- `piles` (`List[int]`, default: `[3, 4, 5]`):
  - **Description:** Sets the initial number of objects in each pile
  - **Impact:** Changing the pile sizes affects game strategy and length

- `max_turns` (`int`, default: `50`):
  - **Description:** Maximum number of turns allowed
  - **Impact:** Prevents games from running indefinitely

## Example Output

```plaintext
Player 0's turn.
Current piles:
  pile 0: 3
  pile 1: 4
  pile 2: 5

Action: [0 1]  # Removes 1 object from pile 0

Updated Piles:
  pile 0: 2
  pile 1: 4
  pile 2: 5

Player 1's turn.
```

## Variants

| Env-id        | Piles Configuration |
|---------------|---------------------|
| `Nim-v0`      | `[3, 4, 5]`         |
| `Nim-v0-small`| `[1, 2, 3]`         |
| `Nim-v0-large`| `[5, 7, 9]`         |

### Contact
For questions or issues related to this environment, please contact guertlerlo@cfar.a-star.edu.sg

