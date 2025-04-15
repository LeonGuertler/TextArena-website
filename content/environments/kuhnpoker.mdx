# Kuhn Poker Environment Documentation

## Overview
**Kuhn Poker** is a simplified two-player poker variant developed by Harold W. Kuhn, serving as an ideal model for studying zero-sum imperfect-information games. The game uses only three cards (Jack, Queen, King), with players taking turns betting based on a single hidden card. Despite its simplicity, Kuhn Poker illustrates fundamental concepts in game theory and mixed-strategy equilibria.

You can learn more about the game [here on Wikipedia](https://en.wikipedia.org/wiki/Kuhn_poker).

This environment supports all core mechanics of Kuhn Poker, including betting, checking, folding, calling, and handling showdowns. It's designed for reinforcement learning, AI training, and strategy testing in imperfect information environments.

---

## Action Space

- **Format:** Actions must be provided in the format `[Action]`, where `Action` is one of:
  - **[Check]**: Pass the turn without betting.
  - **[Bet]**: Place a bet of 1 chip.
  - **[Fold]**: Surrender the round when facing a bet.
  - **[Call]**: Match a previous bet.

### Examples:
- `[Check]`: Pass your turn.
- `[Bet]`: Place a bet of 1 chip.
- `[Fold]`: Fold and concede the round.
- `[Call]`: Call an opponent's bet.

---

## Observation Space

**Reset Observations**

Upon game start, each player receives a prompt like:

```plaintext
You are Player 0 in Kuhn Poker.
You have: K
Possible actions: [Check], [Bet], [Fold], [Call]
You and the opponent each ante 1 chip. The pot is 2.
Player 0 acts first.
```

**Step Observations**

After an action is taken, players receive:

```plaintext
[Player 0] [Bet]
[GAME] Player 0 places a bet.
[Player 1] [Call]
[GAME] Player 1 calls the bet.
Showdown:
Player 0's King beats Player 1's Queen.
Player 0 wins the pot of 4 chips.
```

---

## Gameplay

- **Players:** 2
- **Deck:** 3 cards (Jack, Queen, King)
- **Antes:** Each player antes 1 chip before the round starts.
- **Turns:** Player 0 acts first.
- **Objective:** Win by having the highest card in a showdown or by forcing the opponent to fold.

### Betting Rules
1. **Player 0's Turn:**
   - Options: [Check] or [Bet]
2. **Player 1's Turn:**
   - If Player 0 checked:
     - [Check] to trigger a showdown
     - [Bet] to raise the stakes
   - If Player 0 bet:
     - [Call] to continue to showdown
     - [Fold] to concede

### Showdown
- If both players check or a call occurs after a bet, players reveal their cards.
- The player with the highest card wins the pot.
- If a player folds, the other player wins the pot immediately.

---

## Victory Conditions

- **Showdown Victory:** The player with the highest card wins the pot.
- **Fold Victory:** A player wins if their opponent folds.

---

## Rewards

| Outcome        | Reward (Winner) | Reward (Loser) |
|----------------|:---------------:|:--------------:|
| Showdown Win   | +1              | -1             |
| Fold Win       | +1              | -1             |

Invalid actions result in:

| Outcome       | Reward (Player) |
|---------------|:---------------:|
| Invalid Move  | -1              |

---

## Parameters

| Env-id                   | ante | max_rounds |
|--------------------------|:----:|:----------:|
| `KuhnPoker-v0`           | `1`  | `10`       |
| `KuhnPoker-v0-long`      | `1`  | `15`       |
| `KuhnPoker-v0-blind`     | `1`  | `10`       |
| `KuhnPoker-v0-highstakes`| `5`  | `10`       |
| `KuhnPoker-v0-extended`  | `1`  | `30`       |

---

## Strategy Notes

Kuhn Poker has a **mixed-strategy Nash equilibrium**, meaning that players must use probabilistic strategies to avoid predictability. The game is often used to study bluffing strategies, imperfect information, and optimal mixed strategies.

- The first player should occasionally bet with weak hands (bluffs).
- The second player should occasionally call with weaker hands to prevent exploitation.

For more details, refer to the [Kuhn Poker Wikipedia page](https://en.wikipedia.org/wiki/Kuhn_poker).

---

## Contact

For any issues or contributions, please contact:

- **Email:** guertlerlo@cfar.a-star.edu.sg

