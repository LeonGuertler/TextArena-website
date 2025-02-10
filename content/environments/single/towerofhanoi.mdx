# Tower of Hanoi Environment Documentation

## Overview

The Tower of Hanoi Environment is a single-player puzzle game in which the player transfers a set number of disks from one tower (source) to another (target) using an auxiliary tower. The disks are arranged by size, with larger disks initially stacked below smaller ones on the source tower. The goal is to move all disks to the last tower while adhering to the game's rules: only one disk can be moved at a time, a larger disk cannot be placed on a smaller disk, and only the top disk of any tower can be moved. The player must complete the puzzle within a a given number of steps. 

## Action Space
- **Format:** Actions are strings in the format [source target], where:
- **Example:**
    - To move the top disc from tower A to Tower C: [A C]
- **Notes:** Additional texts may accompany the action, and the agent is free to provide any number of actions. So long it does not make an invalid action. 

## Observation Space
**Reset Observation:**
On reset, the observation provides the initial prompt and the initial view of the towers. For example:
```plaintext
[GAME] You are Player 0. You are playing Tower of Hanoi (easy).
You have to move the disks from tower A to tower C.
To move a disk, type the source tower and the target tower (e.g., '[A C]').
Note that you can only move the top disk of a tower, and that a bigger disk cannot be placed on a smaller disk.
As you play, the history of your moves will be displayed.
Here is the current state of the towers:
A: [3, 2, 1]
B: []
C: []
```

**Step Observations:**
After each step, the environment returns the action and the updated towers as the observation. For example:
```plaintext
[Player 0] To move the disks from tower A to tower C, I'll start by moving the top disk from A to C.

[A C]
[GAME] Player 0 moved disk from A to C. Here is the current state of the towers:
A: [3, 2]
B: []
C: [1]
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
**Board Configuration:** The game begins with three towers labeled 'A', 'B', and 'C'. The selected number of disks, based on the difficulty level (3 disks for easy, 4 for medium, and 5 for hard), are arranged on tower 'A' in descending order, with the largest disk at the bottom and the smallest at the top. Towers 'B' and 'C' are initially empty, and the player’s objective is to transfer all disks from tower 'A' to tower 'C' using tower 'B' as an auxiliary tower.

**Turns:** The player makes a move by specifying a source and target tower in the format [source target], where source and target are one of the towers 'A', 'B', or 'C'. For example, entering [A C] moves the top disk from tower 'A' to tower 'C', if allowed by the game rules. The game enforces a maximum of 100 moves, though this limit can be modified for extended gameplay.

**Objective:** The goal is to transfer all disks from tower 'A' to tower 'C' while following the Tower of Hanoi rules:

1. Only one disk can be moved at a time.
2. A larger disk cannot be placed on top of a smaller disk.
3. Disks can only be moved from the top of a tower.

**Winning Condition:** The game is won when all disks are successfully transferred to tower 'C' in descending order (largest at the bottom and smallest at the top) within the allowed number of moves.

## Key Rules:
**Valid Moves:**

- The player must enter a command in square brackets specifying the source and target towers to move a disk:
    - [A B]: Moves the top disk from tower 'A' to tower 'B', if allowed by the game rules.
    - [B C]: Moves the top disk from tower 'B' to tower 'C', and so on.
- The move is valid only if it meets the following conditions:
    - The source tower has at least one disk (i.e., it is not empty).
    - The top disk on the source tower can be placed on the target tower’s top disk, following the rule that a larger disk cannot be placed on a smaller disk.

**Invalid Moves:**

- Attempting to move a disk from an empty tower.
- Trying to place a larger disk on top of a smaller disk.
- Using an unsupported format or any input that does not follow the [source target] structure.

## Rewards
| Outcome          | Reward for Player  |
|------------------|:------------------:|
| **Win**          |       `+1`         |
| **Lose**         |       `0`          |
| **Invalid Move** |       `-1`         |

# Variants

| Env-id                    |
|---------------------------|
| `TowerOfHanoi-v0-easy`    |
| `TowerOfHanoi-v0-medium`  |
| `TowerOfHanoi-v0-hard`    |

## Example Usage
```python
import textarena as ta

## initalize agents
agents = {
    0: ta.agents.OpenRouterAgent(model_name="gpt-4o-mini")
}

## initializa the environment
env = ta.make("TowerOfHanoi-v0-easy")

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
  - **Solution**: Revise the player prompt to enter moves in the format [source target], where source and target are valid tower names ('A', 'B', or 'C').

**Disk Cannot Be Moved:**

  - **Issue**: The player repeatedly attempts to move a disk from an empty tower, or tries to place a larger disk on a smaller one
  - **Solution**: Revise the prompt to include examples of accaptable moves.


## Version History
- **v0**
  - Initial release 


### Contact
If you have questions or face issues with this specific environment, please reach out directly to bobby_cheng@i2r.a-star.edu.sg