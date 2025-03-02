# Sudoku Environment Documentation

## Overview

Sudoku is a single-player puzzle game where the player fills a 9x9 grid with numbers from 1 to 9. The goal is to ensure that each number appears only once in each row, column, and 3x3 subgrid. This environment supports varying difficulty levels and allows for hint-enabled or hint-disabled gameplay.

## Action Space
- **Format**: Actions are strings in the format [row col num], where row and col are grid indices (1-9) and num is the number (1-9) the player wants to place.
- **Examples**: [5 3 7], I would like to place 7 in row 5, column 3: [5 3 7]
- **Notes**: Additional text can accompany the action, but it must include the correct format [row col num] for the action to be processed correctly.

## Observation Space

**Reset Observation:**
On reset, the observation provides the initial prompt and the state of the Sudoku grid. For example:
```plaintext
[GAME] You are Player 0. You are playing Sudoku (easy).
Here is the current state of the Sudoku grid. Each row is numbered from 1 to 9, and each column is also numbered from 1 to 9.
Empty cells are represented by '.', and pre-filled cells contain digits from 1 to 9.

Current Sudoku Grid:
   C1 C2 C3   C4 C5 C6   C7 C8 C9  
R1  .  8  9 |  1  .  . |  .  3  7
R2  2  7  1 |  9  4  3 |  6  .  8
R3  .  6  5 |  .  2  7 |  4  9  .
   - - - - - - - - - - - - - - - - 
R4  .  .  . |  7  8  . |  9  2  3
R5  .  9  2 |  .  5  6 |  .  .  4
R6  7  3  8 |  .  .  2 |  1  .  .
   - - - - - - - - - - - - - - - - 
R7  8  4  . |  .  .  9 |  5  .  .
R8  5  .  . |  6  .  8 |  3  4  9
R9  9  .  6 |  5  3  4 |  8  7  2

Your objective is to fill the empty cells in the 9x9 grid with digits from 1 to 9 such that:
1. Each row contains all digits from 1 to 9 without repetition.
2. Each column contains all digits from 1 to 9 without repetition.
3. Each of the nine 3x3 subgrids contains all digits from 1 to 9 without repetition.

Rules and Instructions:
1. Do not overwrite the initial numbers provided in the grid.
2. Only fill empty cells represented by '.'.
3. You may respond in any manner you prefer, but ensure that your response includes the format of '[row column number]'.
4. Ensure that your move does not violate Sudoku rules. Invalid moves will result in penalties.
Examples:
- Valid Move:
  - Grid Snippet Before Move:
  
  - Move: [5 3 7]
  - Explanation: Placing 7 at row 5, column 3 does not violate any Sudoku rules.

- Invalid Move (Overwriting a pre-filled cell):
  - Grid Snippet Before Move:
  
  - Move: [1 1 9]
  - Explanation: Cell (1,1) is already filled with 5. You cannot overwrite it.

- Invalid Move (Violating Sudoku rules):
  - Grid Snippet Before Move:
  
  - Move: [1 3 5]
  - Explanation: Placing 5 in row 1, column 3 violates the rule since 5 already exists in row 1.

The history of your moves and thoughts will be appended as you play more rounds. Use the history of your move to improve your decision making by avoiding the moves you have tried. Good luck!

```
**Step Observation:**
After each step, the environment returns the action and the updated Sudoku grid as the observation. For example:
```plaintext
[Player 0] Let's analyze the given Sudoku grid and identify the possible moves:

Current Sudoku Grid:
   C1 C2 C3   C4 C5 C6   C7 C8 C9  
R1  .  8  9 |  1  .  . |  .  3  7
R2  2  7  1 |  9  4  3 |  6  .  8
R3  .  6  5 |  .  2  7 |  4  9  .
   - - - - - - - - - - - - - - - - 
R4  .  .  . |  7  8  . |  9  2  3
R5  .  9  2 |  .  5  6 |  .  .  4
R6  7  3  8 |  .  .  2 |  1  .  .
   - - - - - - - - - - - - - - - - 
R7  8  4  . |  .  .  9 |  5  .  .
R8  5  .  . |  6  .  8 |  3  4  9
R9  9  .  6 |  5  3  4 |  8  7  2

Step-by-Step Analysis

1. Row Analysis:
   - Row 1: Missing values are 2, 4, 5, 6, 8.
   - Row 2: Missing value is 5.
   - Row 3: Missing values are 1, 3, 8.
   - Row 4: Missing values are 1, 4, 5, 6.
   - Row 5: Missing values are 1, 3, 7, 8, 9.
   - Row 6: Missing values are 4, 5, 6, 9.
   - Row 7: Missing values are 1, 2, 3, 6, 7.
   - Row 8: Missing values are 1, 2, 7.
   - Row 9: Missing value is 1.

2. Column Analysis:
   - Column 1: Missing values are 1, 3, 4, 5, 6.
   - Column 2: Missing values are 1, 2, 3, 5.
   - Column 3: Missing values are 2, 3, 4.
   - Column 4: Missing values are 2, 3, 4, 5.
   - Column 5: Missing values are 1, 3, 6, 7.
   - Column 6: Missing values are 1, 4, 5, 7, 8.
   - Column 7: Missing values are 2, 3, 6, 7, 8.
   - Column 8: Missing values are 1, 2, 4, 6.
   - Column 9: Missing values are 1.

3. Subgrid Analysis:
   - Subgrid 1 (R1-R3, C1-C3): Missing values are 1, 3, 4, 5, 6.
   - Subgrid 2 (R1-R3, C4-C6): Missing values are 2, 3, 4, 5, 6.
   - Subgrid 3 (R1-R3, C7-C9): Missing values are 1, 2, 3, 5, 6.
   - Subgrid 4 (R4-R6, C1-C3): Missing values are 1, 3, 4, 5, 6.
   - Subgrid 5 (R4-R6, C4-C6): Missing values are 1, 2, 3, 4, 5, 6.
   - Subgrid 6 (R4-R6, C7-C9): Missing values are 1, 3, 5, 6, 7, 8.
   - Subgrid 7 (R7-R9, C1-C3): Missing values are 1, 2, 3, 6, 7.
   - Subgrid 8 (R7-R9, C4-C6): Missing values are 1, 2, 3, 6, 7.
   - Subgrid 9 (R7-R9, C7-C9): Missing values are 1, 2, 3.

First Move
Now, let's make a move:
- Looking at Row 5, I notice that the missing values are 1, 3, 7, 8, 9. 
- Column 1 has values 2, 7, 8, 9, so the only possible value in Row 5, Column 1 is 1.

Valid Move: 
- Move: [5 1 1] (Placing 1 at Row 5, Column 1)

After this move, the grid will be updated. 

Updated Grid after Move
   C1 C2 C3   C4 C5 C6   C7 C8 C9  
R1  .  8  9 |  1  .  . |  .  3  7
R2  2  7  1 |  9  4  3 |  6  .  8
R3  .  6  5 |  .  2  7 |  4  9  .
   - - - - - - - - - - - - - - - - 
R4  .  .  . |  7  8  . |  9  2  3
R5  1  9  2 |  .  5  6 |  .  .  4
R6  7  3  8 |  .  .  2 |  1  .  .
   - - - - - - - - - - - - - - - - 
R7  8  4  . |  .  .  9 |  5  .  .
R8  5  .  . |  6  .  8 |  3  4  9
R9  9  .  6 |  5  3  4 |  8  7  2

Next Move
Now, I will analyze the grid again and continue making moves based on valid placements. 

Please let me know if you want me to continue with the next move!
[GAME] Board state: 
   C1 C2 C3   C4 C5 C6   C7 C8 C9  
R1  .  8  9 |  1  .  . |  .  3  7
R2  2  7  1 |  9  4  3 |  6  .  8
R3  .  6  5 |  .  2  7 |  4  9  .
   - - - - - - - - - - - - - - - - 
R4  .  .  . |  7  8  . |  9  2  3
R5  1  9  2 |  .  5  6 |  .  .  4
R6  7  3  8 |  .  .  2 |  1  .  .
   - - - - - - - - - - - - - - - - 
R7  8  4  . |  .  .  9 |  5  .  .
R8  5  .  . |  6  .  8 |  3  4  9
R9  9  .  6 |  5  3  4 |  8  7  2
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
where each step can product zero, one or many message tuples.

## Gameplay
- **Grid Size**: Fixed at 9x9.
- **Turns**: The player fills empty cells with numbers from 1 to 9.
- **Number Placement**: A number can only be placed in an empty cell, ensuring it doesn’t violate Sudoku rules (no repetition in rows, columns, or 3x3 subgrids).
- **Winning Condition**: The game is won when all cells are filled correctly according to Sudoku rules.
- **Restart Condition**: The player can restart if they make an error and wish to try again.

## Key Rules
- **Valid Moves**:

    - The player must enter a valid row, column, and number (1-9) in the [row col num] format.
    - The move must not overwrite a pre-filled cell or violate Sudoku rules.

- **Invalid Moves**:
 
    - Entering an invalid row, column, or number (outside the 1-9 range).
    - Overwriting a pre-filled cell or placing a number that violates - Sudoku rules (duplicates in the same row, column, or 3x3 subgrid) will result in a penalty.


## Rewards
| Outcome          | Reward for Player  |
|------------------|:------------------:|
| **Win**          |       `+1`         |
| **Lose**         |       `0`         |
| **Invalid Move** |       `-1`         |

## Parameters

- `difficulty` (`str`):
    - **Description:** Determines how many clues the player has to begin with.
    - **Impact:**
        - **Easy:** Player is provided with 50 pre-filled positions. It has to only guess 31 values.
        - **Medium**: Player is provided with 40 pre-filled positions. It has to only guess 41 values.
        - **Hard**: Player is provided with 30 pre-filled positions. It has to only guess 51 values.

- `max_turns` (`int`):
    - **Description:** Determines how many turns the player has to make its decisions.
    - **Impact:** This affects the number of tries it can make to complete the game. 


## Variants

| Env-id              | difficulty | max_turns |
|---------------------|:----------:|:---------:|
| `Sudoku-v0-easy`    |   `easy`   | `31`      |
| `Sudoku-v0-medium`  |   `medium` | `41`      |
| `Sudoku-v0-hard`    |   `hard`   | `51`      |

## Example Usage

```python
import textarena as ta

## initalize agents
agents = {
    0: ta.agents.OpenRouterAgent(model_name="gpt-4o-mini")
}

## initializa the environment
env = ta.make("Sudoku-v0-easy")

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

**Invalid Move Format**

- **Issue**: The player enters a move in an incorrect format (e.g., without using [row col num]).
- **Solution**: Remind the player to follow the correct format [row col num] for each move. For example, placing 5 in row 2, column 8 should be entered as [2 8 5].

**Overwriting Pre-Filled Cells**

- **Issue**: The player attempts to overwrite a cell that already contains a number.
- **Solution**: Notify the player that pre-filled cells cannot be modified. Prompt them to select an empty cell represented by . on the grid.


## Version History
- **v0**
  - Initial release 


### Contact
If you have questions or face issues with this specific environment, please reach out directly to bobby_cheng@i2r.a-star.edu.sg