# Scenario Planning Environment Documentation

## Overview
**Scenario Planning** is a two-player competitive game where players develop survival strategies in response to hypothetical scenarios. Each player submits a strategy for the same randomly selected scenario, and a panel of judges evaluates which strategy is more effective and feasible. The game tests players' ability to think critically, plan strategically, and communicate effectively in various hypothetical situations. This environment leverages a jury-based evaluation system to determine the winner based on strategy quality rather than fixed game mechanics.

## Action Space

- **Format:** Actions are free-form text responses representing the player's detailed survival strategy for the given scenario.
- **Examples:**
  - "In this post-apocalyptic scenario, my strategy would be to first secure basic necessities by..."
  - "To survive the alien invasion, I would establish a hidden base in the mountain caves where..."
- **Notes:** Players should provide comprehensive, detailed strategies that address the specific challenges presented in the scenario.

## Observation Space

**Reset Observations**
On reset, each player receives a prompt containing the randomly selected scenario. For example:

```plaintext
You are Player 0 in the Scenario Planning game.
Scenario: You find yourself in a world where a mysterious virus has caused 99% of the global population to lose the ability to sleep. Those affected become increasingly unstable and aggressive. You are among the 1% who can still sleep normally.
Your goal is to propose a strategy for survival in this scenario.
After both players submit their strategies, a panel of judges will evaluate them.
On your turn, simply type your strategy.
```

**Step Observations**
Players receive minimal feedback during the game, as they simply submit their strategies independently. After both strategies are submitted, the evaluation results are shown, including the vote count and the winner.

```plaintext
[GAME] Vote results:
Player 0: 7 votes
Player 1: 4 votes
[GAME] Player 0 wins by convincing the judges.
```

## Gameplay

- **Players:** 2 players
- **Initial Setup:** A random scenario is selected from a predefined list
- **Turns:** Each player submits one comprehensive strategy for the scenario
- **Objective:** Create the most effective and feasible survival strategy as judged by a panel
- **Evaluation:** Independent judges vote on which strategy is superior

## Key Rules

1. **Scenario Selection:**
   - A random scenario is selected from a curated list of hypothetical situations
   - Both players address the same scenario, allowing direct comparison of strategies

2. **Strategy Submission:**
   - Players submit their strategies as detailed text explanations
   - No word limit, but strategies should be comprehensive and well-reasoned
   - Players cannot modify their strategies once submitted

3. **Judging Process:**
   - A panel of judges (default: 5) evaluates both strategies
   - Judges consider effectiveness, feasibility, creativity, and thoroughness
   - Each judge votes for the strategy they consider superior

4. **Valid Moves:**
   - Any coherent strategy that addresses the scenario is considered valid
   - There are no restrictions on the content beyond responding to the scenario

5. **Winning Conditions:**
   - **Win:** The player whose strategy receives more votes from the judges
   - **Draw:** Both players receive an equal number of votes
   - **Loss:** Receiving fewer votes than the opponent

6. **Game Termination:**
   - The game concludes once both players have submitted their strategies and the judges have voted

## Rewards

| Outcome     | Reward for Winner | Reward for Loser |
|-------------|:-----------------:|:----------------:|
| **Win**     | `+1`              | `-1`             |
| **Draw**    | `0`               | `0`              |

## Parameters

- `jury_class` (`Any`, default: `OpenRouterJury`):
  - **Description:** The class that implements the judging logic
  - **Impact:** Different jury implementations may use different evaluation criteria or methods

- `jury_size` (`int`, default: `5`):
  - **Description:** The number of judges evaluating the strategies
  - **Impact:** Larger panels may provide more robust evaluations but increase computational cost

- `scenarios_path` (`str`, default: `None`):
  - **Description:** Path to a JSON file containing scenario descriptions
  - **Impact:** Custom scenario files allow for themed competitions or specialized challenges

## Variants

| Env-id                    | jury_size | jury_class      |
|---------------------------|:---------:|:---------------:|
| `ScenarioPlanning-v0`     | `11`      | `OpenRouterJury`|



### Contact
If you have questions or face issues with this specific environment, please reach out directly to Guertlerlo@cfar.a-star.edu.sg
