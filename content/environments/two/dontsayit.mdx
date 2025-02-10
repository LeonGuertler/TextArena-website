# Don't Say It Environment Documentation

## Overview

**Don't Say It** is a two-player conversational game where each player is assigned a secret word. The objective is to subtly guide the conversation to make the other player say your secret word while avoiding mentioning theirs. The game encourages strategic communication and subtlety, making it both challenging and entertaining.

## Action Space

- **Format:** Actions are strings representing the player's messages.
- **Example:** `"Let's talk about something interesting."`, `"Do you enjoy traveling?"`
- **Notes:** Players can converse freely, but mentioning the opponent's secret word results in a loss.

## Observation Space

### Observations

Players receive messages in the form of a conversation history, including their own secret word in the initial prompt.

**Reset Observation:**

On reset, each player receives a prompt containing their secret word and game instructions. For example:
```plaintext
[GAME]: You are Player {player_id} in 'Don't Say It'.
Your secret word is: '{secret_word}'.
Your goal is to get the other player to say your secret word before you say theirs.
You can converse freely, but try to be subtle to avoid mentioning your own secret word.
On your turn, simply type your message.
The game lasts for {max_turns} turns in total.
```

**Step Observation:**
After each step, the players receive the latest message from the other player. For example:
```plaintext
[Player 0]: How was your weekend?
[Player 1]: It was great! I went hiking in the mountains.
```

## Gameplay
- **Players**: 2
- **Turns**: Players alternate sending messages to each other.
- **Secret Words**: Each player has a unique secret word assigned at the start of the game.
- **Objective**: Make the opponent say your secret word while avoiding saying theirs.
- **Turn Limit**: The game can be configured with a maximum number of turns, after which it ends in a draw if no secret words are mentioned.

## Key Rules
1. Secret Words:
    - Each player is assigned a secret word at the start.
    - Players must avoid saying the opponent's secret word, while trying to make them say theirs.

2. Valid Moves:
    - Players send messages as strings.
    - Messages can contain any text but should aim to indirectly lead the opponent to say the secret word.

3. Winning Conditions:
    - **Win**: If a player successfully makes the opponent say their secret word.
    - **Loss**: If a player accidentally says the opponents secret word.
    - **Draw**: If the maximum number of turns is reached without any secret word being mentioned.

4. Game Termination:
    - The game ends immediately upon a win or loss.
    - If the turn limit is reached, the game ends in a draw.

## Rewards

| Outcome          | Reward for Player | Reward for Opponent |
|------------------|:-----------------:|:-------------------:|
| **Win**          | `+1`              | `-1`               |
| **Lose**         | `-1`              | `+1`               |
| **Draw**         | `0`               | `0`                |


## Parameters

- `hardcore` (`bool`):
    - **Description**: Determines the complexity of the secret words.
    - **Impact**:
        - `True`: Uses a full English word set, including complex words.
        - `False`: Uses a simplified English word set for easier gameplay.

- `max_turns` (`int`):
    - **Description**: Specifies the maximum number of turns allowed before the game ends in a draw.
    - **Impact**: Limits the duration of the game, promoting quicker resolutions.



## Variants

| Env-id                   | hardcore | max_turns |
|--------------------------|:--------:|:---------:|
| `DontSayIt-v0`           | `False`  |    `30`   |
| `DontSayIt-v0-hardcore`  | `True`   |    `30`   |
| `DontSayIt-v0-unlimited` | `False`  |   `None`  |

## Example Usage

```python
import textarena as ta

# Initialize the environment
env = ta.make(env_id="DontSayIt-v0")

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

- **Opponent's Word Not Being Mentioned:**
    - **Issue:** Players are unable to guide the conversation towards the opponent's secret word.
    - **Solution:** Encourage creative and subtle conversational strategies to indirectly reference the opponent's word.

- **Invalid Messages:**
    - **Issue:** Players send non-string actions or invalid message formats.
    - **Solution:** Ensure that all actions are valid strings representing meaningful messages.

- **Turn Limit Reached Without Outcome:**
    - **Issue:** The game ends in a draw after reaching the maximum number of turns.
    - **Solution:** Increase the max_turns parameter to allow more conversational exchanges if desired.

## Version History
- **v0**
  - Initial release 



### Contact
If you have questions or face issues with this specific environment, please reach out directly to Guertlerlo@cfar.a-star.edu.sg