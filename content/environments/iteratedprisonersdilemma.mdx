# Prisoner's Dilemma Environment Documentation

## WARNING
This documentation was created by chatgpt and may be garbage...

## Overview

**Prisoner's Dilemma** is a strategic two-player game where each player can either "cooperate" or "defect" in each round. The objective is to maximize individual scores based on the actions taken by both players according to the game's payoff matrix. Players interact by sending a one-line message to the opponent and then choosing an action (either "cooperate" or "defect").

The environment allows for variable-length games, supporting both fixed and random round lengths based on a beta distribution.

## Action Space

- **Format:** Actions consist of a message followed by either "cooperate" or "defect."
- **Action Structure:**
    - Players may send a one-line message to their opponent, which can include strategy hints, taunts, or other interactions.
    - The message is followed on a new line by the action.
    - **Example Actions:**
        - `"Let's work together!\ncooperate"`
        - `"No trust here...\ndefect"`
- **Action Validity:** 
    - Each action should contain a one-line message and an action ("cooperate" or "defect").
    - Actions that do not conform to this format are marked invalid.

## Observation Space

### Observations

Players receive the messages sent by their opponents, the actions taken in each round, and the updated score information. These observations guide players' decisions to cooperate or defect based on prior interactions.

**Reset Observation:**

On reset, each player is informed about their role in the game and the payoff matrix. For example:
```plaintext
You are Player 0 in the Iterated Prisoner's Dilemma.
On each turn, you may either "cooperate" or "defect".
Payoff matrix:
  - Both cooperate: 3 points each
  - You cooperate, opponent defects: 0 points for you, 5 for them
  - You defect, opponent cooperates: 5 points for you, 0 for them
  - Both defect: 1 point each
Each turn, you can send a one-line message to your opponent, followed by your action.
```

**Step Observation:**
After each step, players receive updates about the actions taken by both players and the resulting scores. For example:
```plaintext
Player 1 chose to defect.
Round result: (cooperate, defect). Scores updated to {Player 0: 3, Player 1: 5}.
```

If the game has multiple rounds, the observation will include a prompt for the next turn, allowing players to strategize based on accumulated information.

## Gameplay

- **Players**: 2
- **Turns**: Players simultaneously select actions each round.
- **Action Format**: Each action includes a one-line message and a choice between "cooperate" or "defect."
- **Objective**: Accumulate the highest score by the end of the game.
- **Game Duration**: Variable length, either a fixed number of rounds or a random duration based on `max_rounds`.

## Key Rules

1. **Action Format**:
    - Actions must contain a one-line message and an action ("cooperate" or "defect").
    - If the format is incorrect, the move will be marked as invalid.

2. **Game Termination**:
    - **Fixed Mode**: Ends after `max_rounds` rounds.
    - **Random Mode**: Ends after a variable number of rounds, influenced by a beta distribution based on `max_rounds`.

3. **Invalid Moves**:
    - Moves that do not contain a message or are not "cooperate" or "defect" will be marked as invalid.
    - Invalid moves do not impact the score but may signal mistrust or indecision to the opponent.

## Rewards

The following payoff matrix determines the points for each player based on their actions:

| Player 0 Action | Player 1 Action | Player 0 Reward | Player 1 Reward |
|-----------------|-----------------|-----------------|-----------------|
| Cooperate       | Cooperate       |       +3        |       +3        |
| Cooperate       | Defect          |       +0        |       +5        |
| Defect          | Cooperate       |       +5        |       +0        |
| Defect          | Defect          |       +1        |       +1        |

## Parameters

- **max_rounds** (`int`): 
    - **Description**: Sets the maximum number of rounds for the game.
    - **Impact**: Controls game length; in "random" mode, it influences the beta distribution for a variable game length.

- **mode** (`str`): 
    - **Description**: Determines the game length style.
    - **Values**:
        - `"random"`: Game length is variable, based on a beta distribution influenced by `max_rounds`.
        - `"fixed"`: Game length is exactly `max_rounds`.

## Example Usage

```python
import textarena as ta

# Initialize the environment
env = PrisonersDilemmaEnv(max_rounds=30, mode="random")

# Reset the environment to start a new game
observations = env.reset(seed=42)

# Game loop
done = False
while not done:
    for player_id in [0, 1]:
        # Example prompt response (could come from an agent)
        action = "Let's work together.\ncooperate" if player_id == 0 else "No trust here.\ndefect"
        
        # Execute the action in the environment
        observations, rewards, truncated, terminated, info = env.step(player_id, action)
        
        # Check if the game has ended
        done = terminated or truncated
        
        # Optionally render the environment
        env.render()
        if done:
            break
```

## Troubleshooting

- **Invalid Move Format**:
    - **Issue**: Action provided by a player does not follow the message-action format.
    - **Solution**: Ensure actions include a one-line message followed by "cooperate" or "defect" on a new line.

- **Unexpected Game End**:
    - **Issue**: Game terminates earlier than expected.
    - **Solution**: Verify `mode` setting and ensure `max_rounds` aligns with intended game length.

