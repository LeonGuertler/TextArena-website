# Twenty Questions Environment Documentation

## Overview

The Twenty Questions Environment is a single-player, question-driven game where a player aims to deduce a secret word selected by a gamemaster within a limit of 20 yes-or-no questions, followed by a final guess. The gamemaster, configurable in behavior, responds to each question with "Yes," "No," or "I don't know" based on the chosen word, guiding the player toward a correct guess. In hardcore mode, the game uses a refined word list with only common nouns for added difficulty. The environment tracks player moves, validates guesses (formatted as [word]), and updates the game state for each interaction, offering a structured and engaging experience that challenges players’ deductive reasoning and strategic questioning skills.

## Action Space
- **Format:** Actions are strings that can either be a question or a final guess that is formatted as [guess]. For example:
- **Examples:**
    - To ask a question: "Is it a living thing?"
    - To make a final guess: [elephant]
- **Notes:** Players can ask any yes-or-no question, and the gamemaster will respond with "Yes," "No," or "I don't know." To submit a final guess, players must enclose their guess in square brackets (e.g., [word]). Incorrectly formatted guesses or statements outside this format will be marked as invalid.

## Observation Space
**Reset Observation:**
On reset, the observation provides the initial prompt. For example:
```plaintext
[GAME] You are Player 0. You are playing 20 Questions (Basic).
The gamemaster has chosen an object that can be one or two words. This object is related to places. You have to guess this object by asking yes-or-no questions.
The game will last for a maximum of 20 questions. After 20 questions, the gamemaster will prompt you to make a guess.
You may ask your question in any manner, so long they are not wrapped in square brackets.
Then, to make your final word guess, ensure that you wrap it with square brackets, e.g. [plane], [diving bell].
As you play, the history of your questions and gamemaster's responses will be displayed.
```

**Step Observation:**
After each step, the environment returns the action (e.g. "Yes", "No", "I don't know"). For example:
```plaintext
[Player 0] Got it. Let's try to narrow it down.

Is the object a natural geographical feature?
[GAME] No
```

By default, the environment returns observations in the following format:
```python
{
  player_id: int : [
    (sender_id: int, message: str),
    (sender_id: int, message: str),
    ...
  ]
}
```

**Note:** _Should the judge be unable to interpret the questions and provide one of the three assigned options - "yes", "no" or "I don't know" - the judge will respond with "I'm sorry, I don't understand. Please try asking again." in an effort to get the player to rephrase its action._


## Gameplay
**Game Setup:** The game begins with the `reset` method selecting a target word from a predefined word list, based on the selected difficulty. The player then initiates the game by asking yes-or-no questions to uncover hints about the target word.

**Turns:** Players take turns by either asking questions or making a final guess within a maximum of 20 questions. Each turn, the player can ask questions like, “Is it a living thing?” The gamemaster will respond with "Yes," "No," or "I don’t know," providing clues for deducing the word. To submit a final guess, players must wrap it in square brackets (e.g., [elephant]). The environment tracks questions asked, and the correctness of the final guess.

**Objective:** The player’s goal is to identify the target word using the information gleaned from the gamemaster's responses. By formulating strategic questions, the player can narrow down the possibilities and improve their chances of guessing correctly within the question limit.

**Winning Condition:** The game is won if the player successfully guesses the target word within 20 questions. If the player’s guess matches the target word, they receive a congratulatory message, confirming the win. If incorrect, the player loses the game.

## Key Rules:

- **Valid Moves:**
    - For the submission of final guesses, the player must follow the structure of [guess].
    - It is possible for the player to make a final guess even before the 20 question limit is up.
    - The player still can win if on the 21st attempt, it correctly guesses the word. This follows the gameplay rules where after 20 questions, the player would have to makes its final guess.

## Rewards
| Outcome          | Reward for Player |
|------------------|:-----------------:|
| **Win**          |       `+1`        |
| **Lose**         |       `0`         |
| **Invalid Move** |       `-1`        |

## Parameters
- `hardcore` (`bool`)
- Description: Sets the difficulty level of the game by determining the word list difficulty from which words are chosen.
- Impact:
    - False (default): The game uses a basic word list (en-basic), making it easier for players with common and shorter words.
    - True: The game uses a larger and more challenging vocabulary (en), featuring less common and longer words, making it suitable for advanced players.

## Variants

| Env-id                       | hardcore |
|------------------------------|:--------:|
| `TwentyQuestions-v0`         | `False`  |
| `TwentyQuestions-v0-hardcore`|  `True`  |

## Example Usage

```python
import textarena as ta

## initalize agents
agents = {
    0: ta.agents.OpenRouterAgent(model_name="gpt-4o")
}

## initializa the environment
env = ta.make("TwentyQuestions-v0")

## Wrap the environment for easier observation handling
env = ta.wrappers.LLMObservationWrapper(env=env)

## Wrap the environment for pretty rendering
env = ta.wrappers.SimpleRenderWrapper(
    env=env,
    player_names={0: "4o"}
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

**Repeated Question:**

- **Issue**: Due to the open response, the player has given questions that are closely similar to earlier ones.
- **Solution**: Insert into the player's initial prompt the strategy of seeking a diverse range of questions.

**Gamemaster Response Missing or Incorrect:**

  - **Issue**: The gamemaster doesn’t respond or provides an unclear answer to a valid question.
  - **Solution**: Check that _generate_gamemaster_response correctly processes the player’s question and that self.gamemaster.respond_to_action is functioning as expected.


## Version History
- **v0**
  - Initial release 


### Contact
If you have questions or face issues with this specific environment, please reach out directly to bobby_cheng@i2r.a-star.edu.sg