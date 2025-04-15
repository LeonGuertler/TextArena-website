# Pig Dice Game Environment Documentation

## Overview
**Pig Dice** is a simple turn-based dice game where players must decide between risk and reward. On their turn, players repeatedly roll a die to accumulate points but risk losing everything if they roll a 1. The game continues until a player reaches the target score (default: 100). This environment supports two players and includes features for rolling, holding points, and tracking scores across turns.

## Action Space

- **Format:** Actions are strings representing the player's choice:
  - **Rolling:** Players can choose to roll the die by typing `[roll]`.
  - **Holding:** Players can bank their current turn points by typing `[hold]`.

- **Examples:**
  - Roll the die: `[roll]`
  - Bank current points: `[hold]`

- **Notes:** Players can include additional text in their replies as long as they provide their action in the correct format.

## Observation Space

**Reset Observations**
On reset, each player receives a prompt containing their game instructions and score information. For example:

```plaintext
[GAME] Pig Dice Game - Player 0's turn

Player 0 score: 0
Player 1 score: 0

Current turn total: 0

Rules:
- Roll a 2-6: Add to your turn total
- Roll a 1: Lose turn total and end turn
- Hold: Add turn total to your score and end turn
- First to 100 points wins

Available actions: '[roll]', '[hold]'
```

**Step Observations**
After each step, players receive updates about actions taken and their consequences. For example:

```plaintext
[Player 0] I'll roll the die [Roll]
[GAME] Player 0 rolls a 4.
[GAME] Turn total is now 4.
[Player 0] I'll roll again [Roll]
[GAME] Player 0 rolls a 6.
[GAME] Turn total is now 10.
[Player 0] I'll hold to bank my points [Hold]
[GAME] Player 0 holds and banks 10 points. Total score: 10
```

## Gameplay

- **Players:** 2 players
- **Initial Setup:** Each player starts with 0 points
- **Turns:** Players take turns either rolling to accumulate points or holding to bank points
- **Dice:** A single six-sided die (1-6)
- **Objective:** Be the first player to reach the target score (default: 100)

## Key Rules

1. **Rolling:**
   - On a roll of 2-6, the number is added to the player's turn total
   - On a roll of 1 ("Pig"), the player loses their entire turn total and their turn ends
   - A player may roll as many times as they want on their turn

2. **Holding:**
   - When a player holds, their turn total is added to their overall score
   - After holding, the turn passes to the next player

3. **Turn Structure:**
   - Each turn begins with a turn total of 0
   - Players accumulate points through successful rolls
   - A turn ends when a player holds or rolls a 1

4. **Winning Conditions:**
   - The first player to reach or exceed the target score (default: 100) wins the game

5. **Game Termination:**
   - The game concludes when a player reaches the target score
   - If the maximum number of turns is reached (default: 500), the player with the highest score wins

## Parameters

- `winning_score` (`int`, default: `100`):
  - **Description:** Sets the score needed to win the game
  - **Impact:** Higher values create longer games and more strategic decisions

- `max_turns` (`int`, default: `500`):
  - **Description:** Maximum number of turns before the game ends
  - **Impact:** Prevents infinite games, especially with high winning scores

## Variants

| Env-id               | winning_score | max_turns |
|----------------------|:-------------:|:---------:|
| `PigDice-v0`         | `100`         | `100`     |
| `PigDice-v0-short`   | `50`          | `50`      |
| `PigDice-v0-long`    | `500`         | `500`     |

### Contact
If you have questions or face issues with this specific environment, please reach out directly to guertlerlo@cfar.a-star.edu.sg