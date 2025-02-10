# Truth And Deception Environment Documentation

## Overview

**Truth And Deception** is a strategic two-player game that challenges players' abilities to discern truth from deception. The game involves two roles:
- **Deceiver (Player 0):** Knows which of the two presented facts is correct and aims to convince the Guesser to choose the incorrect one.
- **Guesser (Player 1):** Engages in a conversation with the Deceiver and must determine which of the two facts is correct based on the interaction.

The objective is straightforward:
- **Deceiver:** Successfully mislead the Guesser into selecting the wrong fact.
- **Guesser:** Accurately identify the true fact through strategic questioning and analysis.


## Action Space

- **Format:** Actions are strings representing messages exchanged during the conversation, enclosed in square brackets.
- **Special Tokens:** (For the guessing phase)
    - **[Fact 1]:** The guesser guesses that the first fact is correct
    - **[Fact 2]:** The guesser guesses that the second fact is correct
- **Gameplay Actions:**
    - **Conversation:**  Both players exchange messages.
        - **Format:** Any natural language message without special tokens.
        - **Example:** `"You know, lightning is a fascinating natural phenomenon. There's this popular belief that [...]"`
    - **Guessing:** After the conversation phase, the Guesser makes a guess using `[Fact 1]` or `[Fact 2]`.
        - **Format:** `[Fact 1]` or `[Fact 2]`
        - **Example:** `"I Belive fact 1 is correct. [Fact 1]"`
- **Notes:** 
    - During the conversation phase, no special tokens need to be used by either player.
    - During the guessing phase, the Guesser must use `[Fact 1]` or `[Fact 2]` to make their selection.


## Observation Space

### Observations

Players receive a series of messages exchanged during the game, tailored to their roles. This information aids in making informed decisions about future moves or conceding the game.


### Deceiver (Player 0) Observations

**Reset Observation:**
```plaintext
[GAME]: Game started.
You are Player 0, the Deceiver, in the 'Truth and Deception' game.
You know which of the following two facts is correct:
Fact 1: The Eiffel Tower can be 15 cm taller during hot days. (correct)
Fact 2: Bananas grow on trees. (incorrect)
Your goal is to convince the other player to choose the incorrect fact.
You will have a conversation for 5 turns.
After that, the other player will make their guess.
On your turn, simply type your message.
```

**Step Observation:**
```plaintext
[Player 1] I'm not so sure about that. Fact 2 seems more accurate based on what I've read.
```

### Guesser (Player 1) Observations

**Reset Observation:**
```plaintext
[GAME]: Game started.
You are Player 1, the Guesser, in the 'Truth and Deception' game.
You need to determine which of the following two facts is correct:
Fact 1: The Eiffel Tower can be 15 cm taller during hot days.
Fact 2: Bananas grow on trees.
You will have a conversation with the other player for 5 turns.
After that, you will make your guess by selecting [Fact 1] or [Fact 2].
On your turn, simply type your message.

```

**Step Observation:**
```plaintext
[Player 0]: I believe Fact 1 is more plausible because of thermal expansion.
```

**Decision Observation:**
After the conversation phase, the guesser has to decide which fact they think is the correct one. Before doing so, it receives the following final observation:
```plaintext
[GAME]: Now guess which of the two facts are correct by returning [Fact 1] or [Fact 2].
```


## Gameplay
- **Players**: 2
- **Roles**: Player 0 plays as the deceiver, Player 1 plays as the guesser.
- **Turns**: Players alternate making moves, starting with the Deceiver (Player 0), and ending with the Guesser (Player 1) making their guess.
- **Conversation Phase**: Players engage in a fixed number of conversation turns to discuss and persuade.
- **Guessing Phase**: After the conversation, the Guesser must choose `[Fact 1]` or `[Fact 2]` based on the interaction.
- **Objective**:
    - **Deceiver**: Mislead the Guesser into selecting the incorrect fact.
    - **Guesser**: Correctly identify the true fact.

## Key Rules
1. Conversation Mechanics:
    - The game consists of a fixed number of turns (`max_turns`), during which both players can exchange messages.
    - Each turn, only the active player can send a message.

2. Guessing Phase:
    - After the conversation phase, the Guesser must make a guess by selecting either `[Fact 1]` or `[Fact 2]`.
    - The guess determines the outcome of the game based on the correctness of the selected fact.

3. Game Termination:
    - The game ends after the Guesser makes a guess or if a player resigns.
    - The outcome is determined based on the Guesser's choice and the correctness of the selected fact.

## Rewards

| Outcome          | Reward for Player | Reward for Opponent |
|------------------|:-----------------:|:-------------------:|
| **Win**          | `+1`              | `-1`                |
| **Lose**         | `-1`              | `+1`                |
| **Invalid Move** | `-1`              |  `0`                |


## Parameters

- `max_turns` (`int`):
    - **Description**: Maximum number of conversation turns before the Guesser must make a guess.
    - **Impact**: Determines the duration of the conversation phase, influencing the depth of interaction and strategy.

- `data_path` (`str`):
    - **Description**: Path to the JSON file containing the facts data.
    - **Impact**: Specifies the source of the facts used in the game, allowing for customization and expansion of fact sets.



## Variants

| Env-id                                 | max_turns  |
|----------------------------------------|:----------:|
| `TruthAndDeception-v0`                 | `6`        |
| `TruthAndDeception-v0-long`            | `12`       |
| `TruthAndDeception-v0-super-long`      | `50`       |



## Example Usage

```python
import textarena as ta

# Initialize the environment
env = ta.make(env_id="TruthAndDeception-v0")

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

- **Invalid Move Format:**
    - **Issue:** Player provides a message that doesn't follow the required format, missing special tokens.
    - **Solution:** Make sure that the Guesser returns either the `[Fact 1]` or `[Fact 2]` token as the final action.


## Version History
- **v0**
  - Initial release 



### Contact
If you have questions or face issues with this specific environment, please reach out directly to Guertlerlo@cfar.a-star.edu.sg