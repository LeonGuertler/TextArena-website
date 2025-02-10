# Liar's Dice Environment Documentation

## Overview

**Liar's Dice** is a classic two-player bluffing game where each participant rolls a set number of dice, keeping their results hidden from their opponent. Players take turns making bids on the total number of dice showing a particular face value among all dice rolled. The objective is to either accurately bid based on your understanding of probabilities or to bluff convincingly to make your opponent doubt the validity of your bid. The game concludes when a bluff is called, determining the winner based on the accuracy of the bid.

## Action Space

- **Format:** Actions are strings representing either a bid or a challenge.
- **Special Tokens:**
    - **[Bid]:** To make a bid on the total number of dice showing a specific face value.
        - **Format:** `[Bid] <quantity> <face_value>`
        - **Example:** `[Bid] 3 4`
    - **[Call]:** To challenge the opponent's bluff.
        - **Format:** `[Call]`
- **Examples:**
    - `"I believe there are at least [Bid] 2 5 in total."`
    - `"Based on my roll, I will [Bid] 3 6."`
    - `"That's a bold claim. I choose to [Call]."`
- **Notes:**    
    - Players can include additional text before or after the special tokens.
    - Each action must contain only one of the special tokens (`[Bid]` or `[Call]`).
    - The tokens `[Bid]` and `[Call]` are case-insensitive and can appear anywhere within the action string.
    - Ensure that `[Bid]` is followed by two integers representing the quantity and the face value respectively.



## Observation Space

### Observations

Players receive a series of messages exchanged during the game, including their own dice rolls, current bids, and actions taken by both players. This information aids in making informed decisions about whether to bid higher or call a bluff.

**Reset Observation:**

On reset, each player receives a prompt detailing their initial dice rolls and instructions on how to interact within the game. For example:
```plaintext
[GAME]: Game started.
You are Player 0 in Liar's Dice.
You have rolled 3, 5, 2, 6, 1.
Players take turns making bids on the total quantity of a face value among all dice.
On your turn, you can either make a higher bid or call the opponent's bluff.
Actions:
- To make a bid: '[Bid] <quantity> <face_value>', e.g., '[Bid] 3 4'
- To call a bluff: '[Call]'
If you call a bluff, all dice are revealed:
- If the actual quantity of the face value is less than the bid, you win.
- If the actual quantity meets or exceeds the bid, you lose.
The current bid is: Quantity = 0, Face Value = 0
It's your turn. What is your action?
```

**Step Observation:**
After each step, players receive updates about bids and actions taken. For example:
```plaintext
Player 1: I believe there are at least [Bid] 2 5 in total.
[GAME]: Player 1 increases the bid to Quantity = 2, Face Value = 5.

```

## Gameplay
- **Players**: 2
- **Turns**: Players alternate making bids or calling bluffs.
- **Objective**: Accurately bid the number of dice showing a specific face value or bluff to make the opponent doubt the bid.
- **Turn Limit**: The game ends when a bluff is called; alternatively, it can be configured with a maximum number of turns, after which the player with the highest valid bid wins.

## Key Rules
1. Bidding Mechanics:
    - Players take turns making bids on the total number of dice showing a particular face value among all dice rolled.
    - A valid bid must either increase the quantity or, if the quantity is the same, increase the face value.
    - Example: If the current bid is `[Bid] 2 3`, the next bid must be at least `[Bid] 2 4` or `[Bid] 3 1`

2. Calling a Bluff:
    - Instead of making a bid, a player can challenge the opponent's bid by using the `[Call]` token.
    - When a bluff is called, all dice are revealed:
        - **If the actual quantity of the bid face value is less than the bid**, the challenger wins.
        - **If the actual quantity meets or exceeds the bid**, the challenger loses.

3. Valid Actions:
    - All actions must be strings containing either `[Bid] <quantity> <face_value>` or `[Call]`.
    - Only one action token is allowed per turn.
    - Actions can include additional natural language text but must contain exactly one valid action token.

4. Winning Conditions:
    - **Win:** Successfully calling a bluff when the actual quantity is less than the bid.
    - **Loss:** Failing to call a bluff when the actual quantity meets or exceeds the bid.

5. Invalid Moves:
    - Making a bid that does not increase the quantity or face value appropriately.
    - Including multiple action tokens in a single action string.
    - Calling a bluff when no bid has been made.
    - Any action that does not conform to the `[Bid] <quantity> <face_value>` or `[Call]` format.


## Rewards

| Outcome          | Reward for Player | Reward for Opponent |
|------------------|:-----------------:|:-------------------:|
| **Win**          | `+1`              | `-1`                |
| **Lose**         | `-1`              | `+1`                |
| **Invalid Move** | `-1`              |  `0`                |


## Parameters

- `num_dice` (`int`):
    - **Description**: Specifies the number of dice each player rolls at the start of the game.
    - **Impact**: Determines the initial complexity and variability of the game.




## Variants

| Env-id                   | num_dice  |
|--------------------------|:---------:|
| `LiarsDice-v0`           |    `5`    |
| `LiarsDice-v0-large`     |    `12`   |

## Example Usage

```python
import textarena as ta

# Initialize the environment
env = ta.make(env_id="LiarsDice-v0")

# Wrap the environment for easier observation handling
env = ta.wrappers.LLMObservationWrapper(env=env)

# initalize agents
agents = {
    0: ta.basic_agents.OpenRouter(model_name="gpt-4o"),
    1: ta.basic_agents.OpenRouter(model_name="gpt-4o-mini")
    }

# reset the environment to start a new game
observations = env.reset(seed=490)

# Game loop
done = False
while not done:

    # Get the current player
    current_player_id = env.state.get("current_player")

    # Get the current observation for the player
    obs = observations[current_player_id]

    # Agent decides on an action based on the observation
    action = agents[current_player_id](obs)

    # Execute the action in the environment
    observations, rewards, truncated, terminated, info = env.step(current_player_id, action)

    # Check if the game has ended
    done = terminated or truncated

    # Optionally render the environment to see the current state
    env.render()

    if done:
        break

# Finally, print the game results
for player_id, agent in agents.items():
    print(f"{agent.agent_identifier}: {rewards[player_id]}")
print(f"Reason: {info['reason']}")
```

## Troubleshooting

- **Invalid Action Format:**
    - **Issue:** Player makes an action that doesn't contain exactly one `[Bid] <quantity> <face_value>` or `[Call]` token.
    - **Solution:** Ensure that each action string contains only one of the special tokens and follows the correct format. For example, avoid including multiple `[Bid]` or `[Call]` tokens in a single action.

- **Invalid Bid Parameters:**
    - **Issue:** Player makes a bid that does not increase the quantity or face value appropriately.
    - **Solution:** Verify that each new bid increases either the quantity or, if the quantity remains the same, the face value compared to the current bid.


## Version History
- **v0**
  - Initial release 



### Contact
If you have questions or face issues with this specific environment, please reach out directly to Guertlerlo@cfar.a-star.edu.sg