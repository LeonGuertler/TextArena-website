# Guess The Number Environment Documentation

## Overview

Guess The Number is a single-player game where the player attempts to guess a randomly chosen number within a specified range. The environment supports two modes: Basic (numbers between 1 and 20) and Hardcore (numbers between 1 and 100). The player receives hints ("higher" or "lower") after each guess until they find the correct number or run out of turns.

## Action Space

    - **Format**: Actions are strings containing a guess in the format [number], where number is the player's guess within the range specified for the game mode.
    - **Examples**:
        [7]: Player guesses the number 7.
        [25]: Player guesses the number 25 (only valid in Hardcore mode).
    - **Notes**: Additional text may accompany the action, but it must include the correct format [number] for the guess to be processed. For example, "I think the number is [10]" would be valid as long as the number is within the allowed range.

## Observation Space
**Reset Observation:**
On reset, the observation provides the initial prompt and the state of the Sudoku grid. For example:
```plaintext
[GAME] You are Player 0. You are playing Guess The Number (Basic).
You have to guess the number between 1 and 20.
As you enter your guess, the game will provide you with hints such as 'higher' or 'lower'.
You may provide your response in any manner. Only the number that is wrapped in square brackets will be considered as your guess. For example, [5].
As you play, the history of your guesses will be appended below. Use the information to complete the game before you run out of guesses.
Enter your guess.
```

**Step Observation:**
After each step, the environment returns the action and the updated Sudoku grid as the observation. For example:
```plaintext
[Player 0] Let's start the game. I'll make my first guess.

[50]
[GAME] Your guess of 50 is lower.
```

By default, the environment returns observations in the following format:
```python
{
  player_id: int : [
    (sender_id: int, message: str),
    ...
  ]
}
```
where each step can product zero, one or many message tuples.

## Gameplay

- **Number Range**:
    - Basic Mode: 1 to 20.
    - Hardcore Mode: 1 to 100.
- **Turns**: The player has a maximum of 10 turns to guess the correct number.
- *Hints*: After each guess, the player receives a hint indicating whether the target number is "higher" or "lower" than their guess.
- **Winning Condition**: The player wins the game when they correctly guess the target number within the allowed turns.
- **Restart Condition**: The player can reset the environment to start a new game with a different target number.

## Key Rules

- **Valid Moves**:
    - The player must enter a valid number guess within the specified range for the chosen mode in the [number] format.
    - The guess must be a positive integer that falls within the range of numbers allowed (e.g., 1-20 for Basic mode and 1-100 for Hardcore mode).

- **Invalid Moves**:
    - Entering a number outside the specified range (e.g., [21] in Basic mode).
    - Entering a guess without the required format [number] will result in an invalid move.
    - Repeating a previously guessed number without progress will be invalid.

## Rewards
| Outcome          | Reward for Player  |
|------------------|:------------------:|
| **Win**          |       `+1`         |
| **Lose**         |       `0`          |
| **Invalid Move** |       `-1`         |

## Parameters

- `hardcore` (`bool`):
    - **Description**: Determines the difficulty level of the game by setting the range of numbers the player must guess from.
    - **Impact**:
        - **False** (Default): The game runs in Basic mode, with numbers ranging from 1 to 20.
        - **True**: The game runs in Hardcore mode, with numbers ranging from 1 to 100.

## Variants

| Env-id                       | hardcore  |
|------------------------------|:---------:|
| `GuessTheNumber-v0`          |   `False` |
| `GuessTheNumber-v0-hardcore` |   `True`  |

## Example Usage

```python
import textarena as ta

## initalize agents
agents = {
    0: ta.agents.OpenRouterAgent(model_name="gpt-4o-mini")
}

## initializa the environment
env = ta.make("GuessTheNumber-v0")

## Wrap the environment for easier observation handling
env = ta.wrappers.LLMObservationWrapper(env=env)

## Wrap the environment for pretty rendering
env = ta.wrappers.SimpleRenderWrapper(
    env=env,
    player_names={0: "4o-mini"}
)

## reset the environment to start a new game
env.reset(seed=490)

## Game loop
done = False
while not done:

    player_id, observation = env.get_observation()
    action = agents[player_id](observation)
    done, info = env.step(action=action)

rewards = env.close()
```

## Troubleshooting

**Invalid Guess Format:**

- **Issue**: The player submits a guess in an incorrect format (e.g., missing square brackets).
- **Solution**: Remind the player to submit guesses in the format [number], where number is their chosen guess.

**No Hint Provided:**

- **Issue**: The game does not give a "higher" or "lower" hint after an incorrect guess.
- **Solution**: Ensure the step function correctly compares the player’s guess with the game number and adds an observation with the appropriate hint.


## Version History
- **v0**
  - Initial release 


### Contact
If you have questions or face issues with this specific environment, please reach out directly to bobby_cheng@i2r.a-star.edu.sg