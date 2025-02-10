# Word Search Environment Documentation

## Overview

Word Search is a single-player puzzle game where the player finds the placement of words in a grid of random letters, where the words are given at the beginning. The player's objective is to correctly find all the words in the grid given, ensuring that the start and end position of the found word align correctly with the words in the grid. The environment supports a standard and a hardcore mode, influencing the difficulty of the words provided. 

## Action Space
- **Format**: Actions are strings in the format [start_row start_col end_row end_col], where:
    - (start_row, start_col) are the beginning positions of the word, and (end_row, end_col) are the ending positions of the word.
- **Examples**:
    - To say that the word 'observation' starts at (8, 2) and ends at (8, 12): [8 2 8 12]
- **Notes**: Players can provide multiple guesses at once in the format of [start_row start_col end_row end_col]. Additional text may accompany the action, but it must contain the correct format for the action to be processed. Incorrectly formatted actions or wrong actions will be marked as invalid.

## Observation Space
**Reset Observation:**
On reset, the observation provides the initial prompt and the state of the WordSearch grid. For example:

```plaintext
[GAME] You are Player 0, and you are participating in a Word Search challenge modeled as Basic. The objective is to find and highlight hidden words on the grid below. The rows and columns are numbered for your reference.

Here is the current state of the Word Search board:
----------------------------------------
Words you have already found are marked in square brackets [ ]. Each row and column is numbered for clarity.
Current Word Search Board:
   C00 C01 C02 C03 C04 C05 C06 C07 C08 C09 C10 C11 C12 C13 C14 C15
R00  T   C   U   M   I   N   Y   L   V   R   M   J   X   J   Z   B  
R01  G   L   I   H   V   R   N   G   W   R   J   V   K   V   O   K  
R02  X   W   H   G   C   D   N   W   G   C   N   R   D   B   G   M  
R03  X   Q   Y   K   T   K   J   A   X   P   U   H   C   O   S   U  
R04  H   C   W   K   J   A   B   I   I   R   W   V   A   L   W   G  
R05  M   Z   J   D   K   A   Z   K   V   O   K   U   I   S   L   Q  
R06  Y   W   Q   Y   P   E   J   T   A   F   R   T   L   S   R   Q  
R07  J   Z   N   W   P   O   F   N   K   I   G   I   L   F   J   E  
R08  I   L   O   B   S   E   R   V   A   T   I   O   N   F   W   Y  
R09  X   U   S   M   E   T   C   H   P   H   A   F   N   S   A   R  
R10  Y   V   W   E   X   K   U   L   P   O   E   M   C   P   I   H  
R11  E   R   S   L   U   U   E   H   B   U   V   Y   P   N   V   Y  
R12  J   F   D   R   P   V   M   R   A   G   Z   N   X   J   P   M  
R13  T   E   H   Z   J   E   F   N   Q   H   T   W   T   X   N   F  
R14  K   C   Q   N   O   P   Q   U   I   T   E   X   W   O   J   V  
R15  R   Y   A   M   J   H   P   T   K   Q   J   G   F   Z   P   S  

Your task is to find the following words on the board:
----------------------------------------
1. OBSERVATION
2. THOUGHT
3. PROFIT
4. QUITE
5. NUT

To locate a word, specify the row and column of its start and end letters. Note that words are either across or down.
You may type your response and thoughts in any manner. But for your submissions, use the format '[start_row start_col end_row end_col]'.
For instance, if you want to find the word 'HELLO' starting at row 1, column 1 and ending at row 1, column 5, enter '[1 1 1 5]'.

Guidelines:
- Each guess must be unique; you cannot repeat the same guess.
- You have a total of 20 incorrect attempts remaining.
- The history of your attempts will be recorded below.

Make your guesses carefully and strategically. Good luck, Player {player_id}! Let's see how many words you can find!
```

**Step Observation:**
After each step, the environment returns the action and the updated WordSearch grid as the observation. For example:
```plaintext
[Player 0] Let's start by finding the words on the board. Here's my attempt to locate each word:

1. OBSERVATION: Found in row 8, starting from column 2 to column 12.
   - Guess: [8 2 8 12]

2. THOUGHT: Let's look for this word.
   - The word THOUGHT can be found in column 10, starting from row 3 to row 9.
   - Guess: [3 10 9 10]

3. PROFIT: Let's locate this word.
   - The word PROFIT can be found in row 14, starting from column 5 to column 10.
   - Guess: [14 5 14 10]

4. QUITE: I'll try to find this one next.
   - The word QUITE can be found in row 14, starting from column 8 to column 12.
   - Guess: [14 8 14 12]

5. NUT: Finally, let's find this word.
   - The word NUT can be found in column 5, starting from row 0 to row 2.
   - Guess: [0 5 2 5]

Let's enter these guesses and see if they're all correct!

[GAME] You have found a word. Updated Board state:
   C00 C01 C02 C03 C04 C05 C06 C07 C08 C09 C10 C11 C12 C13 C14 C15
R00  T   C   U   M   I   N   Y   L   V   R   M   J   X   J   Z   B  
R01  G   L   I   H   V   R   N   G   W   R   J   V   K   V   O   K  
R02  X   W   H   G   C   D   N   W   G   C   N   R   D   B   G   M  
R03  X   Q   Y   K   T   K   J   A   X   P   U   H   C   O   S   U  
R04  H   C   W   K   J   A   B   I   I   R   W   V   A   L   W   G  
R05  M   Z   J   D   K   A   Z   K   V   O   K   U   I   S   L   Q  
R06  Y   W   Q   Y   P   E   J   T   A   F   R   T   L   S   R   Q  
R07  J   Z   N   W   P   O   F   N   K   I   G   I   L   F   J   E  
R08  I   L  [O] [B] [S] [E] [R] [V] [A] [T] [I] [O] [N]  F   W   Y  
R09  X   U   S   M   E   T   C   H   P   H   A   F   N   S   A   R  
R10  Y   V   W   E   X   K   U   L   P   O   E   M   C   P   I   H  
R11  E   R   S   L   U   U   E   H   B   U   V   Y   P   N   V   Y  
R12  J   F   D   R   P   V   M   R   A   G   Z   N   X   J   P   M  
R13  T   E   H   Z   J   E   F   N   Q   H   T   W   T   X   N   F  
R14  K   C   Q   N   O   P   Q   U   I   T   E   X   W   O   J   V  
R15  R   Y   A   M   J   H   P   T   K   Q   J   G   F   Z   P   S  
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
- **Grid Size**: The grid size is determined dynamically based on the length of the longest word and the total number of words to ensure adequate space for placement.
- **Turns**: The player identifies words hidden within the grid by specifying the coordinates of the starting and ending positions. Incorrect guesses reduce the remaining attempts.
- **Word Placement**: Words are placed either horizontally ("across") or vertically ("down") and may overlap with other words. The player must correctly locate the start and end coordinates to highlight them.
- **Winning Condition**: The game is won when all the words listed have been correctly found and highlighted on the grid.

## Key Rules
- **Valid Moves**:
    - The player must enter a valid start_row, start_col, end_row, end_col in the [start_row start_col end_row end_col] format.

- **Invalid Moves**:
    - Entering a start_row, start_col, end_row, end_col that is outside the grid bounds.
    - Repeating a guess

## Rewards
| Outcome          | Reward for Player  |
|------------------|:------------------:|
| **Win**          |       `+1`         |
| **Lose**         |       `0`          |
| **Invalid Move** |       `-1`         |

## Parameters

- `hardcore` (`bool`):
    - **Description:** Determines the type of words to spot
    - **Impact:**
        - **False:** Hidden words follow basic english.
        - **True**: Hidden words would be uncommon and challenging words.


## Variants

| Env-id                    | hardcore |
|---------------------------|:--------:|
| `WordSearch-v0`           | `False`  |
| `WordSearch-v0-hardcore`  | `True`   |

## Example Usage
```python
import textarena as ta

## initalize agents
agents = {
    0: ta.agents.OpenRouterAgent(model_name="gpt-4o")
}

## initializa the environment
env = ta.make("WordSearch-v0")

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
    print("Observation:", observation)
    action = agents[player_id](observation)
    done, info = env.step(action=action)

rewards = env.close()
```

## Troubleshooting

**Incorrect Word Highlighting**

- **Issue**: A word is marked as found even though the coordinates or letters do not match the actual word placement.
- **Solution**: Verify that the starting and ending coordinates match the word’s correct location in the grid. Ensure the format [start_row start_col end_row end_col] is followed precisely.

**Repeated Guesses**

- **Issue**: The same guess is made multiple times, reducing the remaining attempts unnecessarily.
- **Solution**: Check the history of previous guesses before submitting a new one to avoid repeats. Use unique starting and ending coordinates for each guess.

I**nsufficient Grid Size**

- **Issue**: Some words cannot be placed because the grid is too small.
- **Solution**: Adjust the word list or increase the grid size in the settings to ensure adequate space for all words.


## Version History
- **v0**
  - Initial release 


### Contact
If you have questions or face issues with this specific environment, please reach out directly to bobby_cheng@i2r.a-star.edu.sg