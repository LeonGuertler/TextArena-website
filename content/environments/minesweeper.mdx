# Minesweeper Environment Documentation

## Overview
The Minesweeper Environment is a single-player puzzle game where the player aims to reveal all safe cells on a grid while avoiding hidden mines. The board’s difficulty—easy, medium, or hard—determines its size and mine count. Each revealed cell shows the number of adjacent mines around it, helping the player identify safe cells through deduction. Players can flag cells they suspect contain mines, which they must avoid revealing. The game ensures a safe start by revealing an area around the first chosen cell, and it ends in failure if a mine is revealed. The player wins by successfully revealing all non-mine cells.

## Action Space
- **Format:** Actions are strings in the format [action row col], where:
- **Example:**
    - To reveal the grid at row 3 col 3: [reveal 3 3]
    - To place a flag at row 4 col 3 because of a suspected mine: [flag 4 3]
- **Notes:** Additional texts may accompany the action, but the agent can only make 1 action step at a time. Its actions cannot be an invalid action.

## Observation Space
**Reset Observation:**
On reset, the observation provides the initial prompt and the empty grid. For example:
```plaintext
[GAME] You are Player 0. You are playing the Minesweeper game.
The objective of the game is to reveal all cells that do not contain mines.
To make a move, you can either reveal a cell or place a flag on a suspected mine location using one of the following commands:
- 'reveal': Reveal the contents of a specific cell.
- 'flag': Place or remove a flag on a specific cell to mark it as a potential mine.
To submit your move, type the command followed by the row and column in square brackets.
For example:
- [reveal 3 2] to reveal the cell in Row 3, Column 2.
- [flag 5 6] to place or remove a flag on the cell in Row 5, Column 6.
On your first move, you will reveal an area around the cell you choose to ensure a safe start.
The current board layout is shown below. Cells that are unrevealed are represented by a dot ('.'), revealed numbers show the count of adjacent mines, and flagged cells are marked with an 'F'.
Use logic and deduction to avoid revealing cells with mines!
Be mindful not to choose revealed or flagged cells.
Here is the current board layout:
    0  1  2  3  4  5  6  7
 0  .  .  .  .  .  .  .  . 
 1  .  .  .  .  .  .  .  . 
 2  .  .  .  .  .  .  .  . 
 3  .  .  .  .  .  .  .  . 
 4  .  .  .  .  .  .  .  . 
 5  .  .  .  .  .  .  .  . 
 6  .  .  .  .  .  .  .  . 
 7  .  .  .  .  .  .  .  . 
```

**Step Observations:**
After each step, the environment returns the action and the updated grid as the observation. For example:
```plaintext
[Player 0] To start the game safely, I'll reveal a cell that is likely to uncover a larger area. A good choice would be to reveal the center of the board, as it tends to have more adjacent cells. 

I will reveal the cell at Row 3, Column 3.

Let's make the move: 

[reveal 3 3]
[GAME] Game Board:
    0  1  2  3  4  5  6  7
 0  .  .  .  .  .  .  .  . 
 1  .  .  .  .  .  .  .  . 
 2  .  .  1  1  1  1  1  . 
 3  .  3  1  0  0  0  1  1 
 4  .  2  0  0  0  0  0  0 
 5  1  1  0  1  2  2  2  1 
 6  0  0  1  2  .  .  .  . 
 7  0  0  1  .  .  .  .  . 
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
**Grid Configuration:** The board consists of a grid of cells, with dimensions and the number of hidden mines determined by the selected difficulty level. At the start, all cells are hidden, and the player’s objective is to reveal all cells that do not contain mines. The player can also flag cells suspected to contain mines to mark them as dangerous.

**Turns:** 
- **\[For the first move only\]**  The player may freely choose any cell to reveal. This initial move will always be safe, and it will clear an area of cells around the selected cell to provide a secure start. Any flags that may have been placed on these cells will be removed automatically to ensure clarity and prevent confusion in this safe zone.
- **\[After the first move\]** The player takes a turn by specifying an action and a cell location in the format [action row col], where action is either reveal (to uncover a cell) or flag (to mark a cell as a suspected mine). For example, entering [reveal 3 2] uncovers the cell at row 3, column 2, while [flag 5 6] places or removes a flag on the cell at row 5, column 6. The player must use logic and deduction to safely uncover cells without triggering mines.

**Objective:** The goal is to reveal all safe cells on the grid, indicated by numbers showing the count of adjacent mines. The game provides a safe first move by clearing an area around the chosen cell, allowing the player to start without hitting a mine.

**Winning Condition:** The game is won when all cells without mines are revealed. However, if the player accidentally reveals a cell containing a mine, the game is lost.

## Key Rules

**Valid Moves:**

- **Reveal:** [reveal row col] uncovers the specified cell. If it contains no adjacent mines, surrounding cells may also be revealed.
- **Flag:** [flag row col] places or removes a flag on the specified cell to indicate suspicion of a mine. Flags can only be placed on hidden cells.

**Invalid Moves:**

- Revealing or flagging a cell that has already been revealed or flagged.
- Selecting a cell outside the grid boundaries.
- Using a format that does not follow the [action row col] structure.

## Rewards

| Outcome          | Reward for Player  |
|------------------|:------------------:|
| **Win**          |       `+1`         |
| **Lose**         |       `0`          |
| **Invalid Move** |       `-1`         |

# Variants

| Env-id                    |
|---------------------------|
| `Minesweeper-v0-easy`     |
| `Minesweeper-v0-medium`   |
| `Minesweeper-v0-hard`     |

## Example Usage
```python
import textarena as ta

## initalize agents
agents = {
    0: ta.agents.OpenRouterAgent(model_name="gpt-4o-mini")
}

## initializa the environment
env = ta.make("Minesweeper-v0-easy")

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

  - **Issue**: The player submits a move in an incorrect format (e.g., missing square brackets or improper action keywords).
  - **Solution**: Ensure the player prompt clearly specifies that moves must follow the format [action row col], where action is either reveal or flag, and row and col represent valid coordinates within the grid.

**No Mines Indicated Around First Move:**

  - **Issue**: The player’s first move does not reveal the expected safe area or adjacent numbers.
  - **Solution**: Ensure the first move is correctly coded to clear all mines in the area surrounding the selected cell, revealing a safe zone for better gameplay clarity.


## Version History
- **v0**
  - Initial release 


### Contact
If you have questions or face issues with this specific environment, please reach out directly to bobby_cheng@i2r.a-star.edu.sg