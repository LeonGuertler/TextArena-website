# Fifteen Puzzle Environment Documentation

## Overview
The 15-Puzzle Environment is a single-player tile-sliding puzzle game in which the player arranges numbered tiles in ascending order from 1 to 15, with an empty space located at the bottom-right corner. The player can slide tiles into the empty space to progress toward the solved state, aiming to complete the puzzle within a set number of moves. Each turn, the environment prompts the player for a move, validates the input, and updates the board layout accordingly. The player’s move history and the current board layout are displayed to help track progress and guide gameplay.

## Action Space
- **Format:** Actions are strings in the format [direction], where:
- **Examples:**
    - To move the bottom tile "up", and therein move the empty tile "down": [up]
- **Notes:** Additional text may accompany the action, but it must contain the correct format for the action to be processed. Incorrectly formatted actions will be marked as invalid.

## Observation Space
**Reset Observation:**
On reset, the observation provides the initial prompt and the initial puzzle grid. For example:
```plaintext
[GAME] You are Player 0. You are playing the 15-Puzzle game.
The objective of the game is to arrange the numbered tiles in ascending order from 1 to 15, with the empty space located in the bottom-right corner.
To make a move, you can slide a tile into the empty space (represented by a double underscore, e.g. __) by using one of the following commands:
- 'up': Move the tile below the empty space up.
- 'down': Move the tile above the empty space down.
- 'left': Move the tile to the right of the empty space left.
- 'right': Move the tile to the left of the empty space right.
To submit your move, type the direction (e.g., 'up', 'down', 'left', or 'right') in square brackets, e.g. [up].
The current board layout is shown below. Use the information to solve the puzzle.
 1  6  7  3
 4 13 11 14
 5 10  2 12
15  8  9 __
```

**Step Observations:**
After each step, the environment returns the action and the updated puzzle grid as the observation. For example:
```plaintext
[Player 0] To solve the 15-Puzzle, the goal is to rearrange the tiles into the correct order. Let's analyze the current board:

\```
 1  6  7  3
 4 13 11 14
 5 10  2 12
15  8  9 __
\```

The empty space (__) is currently at the bottom right corner. The goal is to arrange the tiles in ascending order, with the empty space at the bottom right.

The current configuration is:

- Row 0: 1, 6, 7, 3
- Row 1: 4, 13, 11, 14
- Row 2: 5, 10, 2, 12
- Row 3: 15, 8, 9, __

Let's consider our options. The tile above the empty space is 9, which can be moved down into the empty space.

Therefore, the first move I will make is to slide the tile 9 down into the empty space.

Let's execute this move:

[down]
[GAME] Game Board:
 1  6  7  3
 4 13 11 14
 5 10  2 __
15  8  9 12
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

## Gameplay
- **Board Configuration:** The game starts with a 4x4 grid of numbered tiles from 1 to 15, along with an empty space represented by a double underscore (__). The tiles are shuffled into a random order, which the player must rearrange to match the solved configuration with tiles in ascending order and the empty space in the bottom-right corner.

- **Turns:** The player makes moves by typing a direction in the format [direction], where direction can be up, down, left, or right, indicating the direction to slide a tile into the empty space. The game defaults to a maximum of 100 turns, but this number can be adjusted based on the player’s preference.

- **Objective:** To complete the game, the player must rearrange the tiles until they reach the solved configuration. The player can only move tiles that are adjacent to the empty space, str-ategically sliding tiles to solve the puzzle within the allowed turns.

- **Winning Condition:** The game is won when the tiles are arranged in ascending order from 1 to 15, with the empty space located at the bottom-right corner, and the player has achieved this within the set number of turns.

## Key Rules

- Valid Moves:

    - The player must enter a command in square brackets that specifies one of the four possible directions:
        - [up]: Moves the tile below the empty space, up.
        - [down]: Moves the tile above the empty space, down.
        - [left]: Moves the tile to the right of the empty space, left.
        - [right]: Moves the tile to the left of the empty space, right.
    - The selected tile moves only if it is adjacent to the empty space in the specified direction.

- Invalid Moves:

    - Entering a direction that does not align with a tile adjacent to the empty space.
    - Using an unsupported direction format or any input that does not follow the [direction] structure.

## Rewards
| Outcome          | Reward for Player  |
|------------------|:------------------:|
| **Win**          |       `+1`         |
| **Lose**         |       `0`          |
| **Invalid Move** |       `-1`         |

## Variants

| Env-id                    |
|---------------------------|
| `FifteenPuzzle-v0`        |

## Example Usage
```python
import textarena as ta

## initalize agents
agents = {
    0: ta.agents.OpenRouterAgent(model_name="gpt-4o-mini")
}

## initializa the environment
env = ta.make("FifteenPuzzle-v0")

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

**Invalid Move Format:**

  - **Issue**: The player submits a move in an incorrect format (e.g., missing square brackets).
  - **Solution**: Remind the player to submit moves in the format `[direction]`, where direction can be up, down, left, or right.

**Tile Cannot Be Moved:**

  - **Issue**: The player attempts to move a tile in a direction where it is blocked (e.g., trying to move a tile up at the top row).
  - **Solution**: Provide feedback that the move is invalid and encourage the player to check the board layout before selecting a direction.

**Rendering Display Issues:**

  - **Issue**: The board layout is not displayed correctly or shows misaligned elements.
  - **Solution**: Check the `_render_board` function for spacing issues and ensure each row is joined with consistent spacing for clarity.


## Version History
- **v0**
  - Initial release 


### Contact
If you have questions or face issues with this specific environment, please reach out directly to bobby_cheng@i2r.a-star.edu.sg