# Mastermind Environment Documentation

## Overview
**Mastermind Game** is a two-player turn-based deduction game where each player attempts to guess the opponent's secret code set by the game environment. Each secret code consists of a series of numbers, with the length and range of these numbers determined by the difficulty level. Players submit guesses in a specific format, and after each guess, they receive feedback in the form of black and white pegs. A black peg represents a correct digit in the correct position, while a white peg indicates a correct digit in the wrong position. The game continues until a player correctly guesses the opponent’s secret code or until the maximum number of turns is reached. This environment supports flexible difficulty settings, feedback on guesses, and an interactive prompt system for engaging gameplay between agents.

## Action Space
- **Format:** Actions are strings representing the player's choice. For example:
- **Example:**
    - Guessing the code 1 2 3 4: [1 2 3 4]
    - Guessing the code 4 2 5 1: [4 2 5 1]
- **Notes:** Players can have additional texts in their replies, as long as they provide their coordinates in the correct format.

## Observation Space
**Reset Observations**
On reset, each player receives a prompt containing their beginning game instructions. For example:
```plaintext
[GAME] You are Player 0. You are playing Mastermind (easy level).
Your goal is to guess the other player's secret code that is 4 digits long, where each digit ranges from 1 to 6, and the are no duplicate digits.
In your response, you can mention any code or previously submitted code in the format of 1 2 3 4. Only when you have decided to make your guess, then you must strictly enter the code in square brackets like [2 1 4 5]. This is to avoid submitting a wrong code to the game environment.
After each guess, you will receive feedback in the form of black and white pegs.
A black peg indicates a correct digit in the correct position, while a white peg indicates a correct digit in the wrong position.
You have only 10 turns to guess the code.
```

**Step Observations:**
After each step, the players receive the latest message from the game environment. For example, here's player 0 making their first move:
```plaintext
[Player 0] To start, I'll make an initial guess to gather some feedback. Since no digits repeat and the range is from 1 to 6, I'll begin with a simple sequence:

[1 2 3 4]
[GAME] You have submitted [1 2 3 4]. Feedback: 1 black peg(s), 2 white peg(s).
```

## Gameplay

- **Players**: 2
- **Turns**: Players alternate turns to guess the opponent's secret code. Each turn, a player submits a code guess in a specific format. After each guess, they receive feedback on their accuracy in the form of black and white pegs.
- **Code Structure**: Each player’s secret code is a sequence of numbers, with the code length and range determined by the difficulty level.
- **Objective**: Deduce the opponent's secret code by analyzing feedback and making strategic guesses.
- **Difficulty Levels**:
  - **Easy**: Code length of 4, numbers range from 1 to 6, no duplicate numbers, maximum of 10 turns.
  - **Medium**: Code length of 5, numbers range from 1 to 8, no duplicate numbers, maximum of 12 turns.
  - **Hard**: Code length of 6, numbers range from 1 to 10, duplicates allowed, maximum of 15 turns.
- **Feedback Mechanism**:
  - **Black Pegs**: Indicate digits that are correct in both value and position.
  - **White Pegs**: Indicate digits that are correct in value but incorrect in position.
- **Winning Condition**: The game is won when a player successfully guesses the opponent’s full secret code with the correct sequence within the allowed number of turns.

## Key Rules

1. **Guessing**:
   - Players take turns submitting a guess to deduce the opponent's secret code. Each guess is submitted as a space-separated list of numbers within square brackets (e.g., "[1 3 5 2]").
   - After each guess, the player receives feedback based on the correctness of the guess.

2. **Valid Moves**:
   - Guesses must match the code length for the current difficulty level (e.g., 4 numbers for "easy" level).
   - The numbers in each guess must be within the allowed range for the difficulty level (e.g., 1 to 6 for "easy").
   - Guesses are invalid if they contain incorrect formatting or out-of-range numbers, and the player will receive an error message without feedback.

3. **Feedback (Pegs)**:
   - **Black Pegs**: Each black peg indicates a digit that is correct in both value and position.
   - **White Pegs**: Each white peg represents a correct digit that is in the wrong position.
   - Players can use this feedback to refine their guesses in subsequent turns.

4. **Winning Conditions**:
   - **Win**: The game is won when a player correctly guesses the opponent's full code with all digits in the correct order.
   - **Loss**: A player loses if their opponent guesses their code first.

5. **Game Termination**:
   - The game ends as soon as one player correctly guesses the opponent’s code or if both players reach the maximum turn limit without a successful guess.
   - **Draw**: If both players fail to guess each other's code within the allotted turns, the game will be declared a draw.


## Rewards

| Outcome          | Reward for Player | Reward for Opponent |
|------------------|:-----------------:|:-------------------:|
| **Win**          | `+1`              | `-1`                |
| **Lose**         | `-1`              | `+1`                |
| **Draw**         | `0`               | `0`                 |
| **Invalid**      | `-1`              | `0`                 |


## Parameters

- `difficulty` (`str`):
    - **Description**: Sets the difficulty level, adjusting the code length, range of numbers, and maximum turns.
    - **Options**:
        - `"easy"`: Code length of 4, numbers range from 1 to 6, with no duplicate numbers allowed, and a maximum of 10 turns.
        - `"medium"`: Code length of 5, numbers range from 1 to 8, with no duplicate numbers allowed, and a maximum of 12 turns.
        - `"hard"`: Code length of 6, numbers range from 1 to 10, with duplicate numbers allowed, and a maximum of 15 turns.
    - **Impact**:
        - Higher difficulty levels increase the game’s complexity by expanding the code length, number range, and allowing duplicate numbers (for "hard"), requiring players to apply more complex deduction strategies to solve the code within a limited number of turns.

## Variants

| Env-id                  | difficulty |
|-------------------------|:----------:|
| `Mastermind-v0-easy`    | `easy`     |
| `Mastermind-v0-medium`  | `medium`   |
| `Mastermind-v0-hard`    | `hard`     |

## Example Usage
```python
import textarena as ta

# Initialize the environment
env = ta.make(env_id="Mastermind-v0-easy")

# Wrap the environment for easier observation handling
env = ta.wrappers.LLMObservationWrapper(env=env)

# Wrap the environment for pretty rendering
env = ta.wrappers.PrettyRenderWrapper(env=env)

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

- **Repeatedly mentioning other trivial code in square brackets**:
    - **Issue**: The game environment wrongly detects a trivial code sequence as the model's code submission for the turn. This causes the model to wrongly capture its decided code.
    - **Solution**: Refine the prompt to explicitly highlight how mentioned code sequences can be in the format 1 2 3 4 or 4 2 5 1. And only when submitting its move, to wrap in square brackets.

- **Invalid Move Format**:
    - **Issue**: A player keeps submitting its code sequence without the square brackets.
    - **Solution**: Update the prompt with examples of good and bad code sequence submissions.

## Version History
- **v0**
  - Initial release 


### Contact
If you have questions or face issues with this specific environment, please reach out directly to bobby_cheng@i2r.a-star.edu.sg