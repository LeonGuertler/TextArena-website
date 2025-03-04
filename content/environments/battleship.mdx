# Battleship Environment Documentation

## Overview
**Battleship Game** is a two-player turn-based strategy game where players aim to locate and sink their opponent's fleet of ships hidden on a grid. Each player has a fleet of ships positioned on their grid, and they take turns guessing coordinates on the opponent’s grid to target and sink their ships. The game continues until one player successfully sinks all of the opponent's ships, thereby winning the game. This environment includes features such as grid visualization for hits and misses, side-by-side display of both players' grids, and tracking views to enhance the strategic gameplay experience for agents.

## Action Space

- **Format:** Actions are strings representing the player's choice. For example:
- **Example:**
    - Hit the coordinate at row A column 2: [A2]
    - Hit the coordinate at row J column 4: [J4]
- **Notes:** Players can have additional texts in their replies, as long as they provide their coordinates in the correct format.

## Observation Space
**Reset Observations**
On reset, each player receives a prompt containing their beginning game instructions. For example:
```plaintext
[GAME] You are Player 0. You are playing the Battleship game (easy level).
Your goal is to sink all of your opponent's ships before they sink yours.
On your turn, consider the observations made by your opponent, but do not repeat them exactly.
Focus on new insights or strategies based on your understanding of the opponent's moves and the current state of the game.
You may mention coordinates in the format B3 or C8. Only when you have decided to fire a missile to a specified coordinate, then you must enter the row and column values in square brackets like [A4]. This is to avoid submitting a wrong coordinate to the game environment.
If the missile hits a ship, it is marked with 'X'. If it misses, it is marked with 'O'. In either scenarios, the game environment will inform you of your hits. If you have sunk a boat, the game environment will tell you!
The game ends when all of one player's ships have been sunk.
Your initial board will show all of your ships placed and your opponent's hits on you, and your hits and misses on your opponent's board without showing your opponent's ships.
Here is the initial board:
                    
Player 0's View                   
             Your Ships                      Your Hits on Opponent     
    0  1  2  3  4  5  6  7  8  9          0  1  2  3  4  5  6  7  8  9
A   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~      A   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
B   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~      B   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
C   ~  ~  ~  ~  ~  ~  ~  P  ~  ~      C   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
D   ~  ~  ~  ~  ~  ~  ~  P  ~  ~      D   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
E   ~  ~  ~  ~  ~  ~  ~  A  ~  ~      E   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
F   ~  ~  ~  ~  ~  ~  D  A  ~  ~      F   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
G   ~  ~  ~  ~  ~  ~  D  A  ~  ~      G   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
H   ~  ~  ~  S  ~  ~  D  A  ~  ~      H   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
I   ~  ~  ~  S  ~  ~  ~  A  ~  ~      I   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
J   ~  ~  ~  S  ~  B  B  B  B  ~      J   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
```

**Step Observation:**
After each step, the players receive the latest message from the game environment. For example, here's player 1 making its move after player 0:
```plaintext
[GAME] Opponent missed your ship at F5! Your updated board:
                    
Player 1's View                   
             Your Ships                      Your Hits on Opponent     
    0  1  2  3  4  5  6  7  8  9          0  1  2  3  4  5  6  7  8  9
A   ~  A  A  A  A  A  ~  ~  ~  ~      A   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
B   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~      B   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
C   ~  ~  ~  ~  B  B  B  B  ~  ~      C   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
D   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~      D   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
E   ~  ~  ~  ~  P  ~  ~  ~  ~  ~      E   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
F   ~  ~  ~  ~  P  O  ~  ~  D  ~      F   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
G   ~  ~  ~  ~  S  S  S  ~  D  ~      G   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
H   ~  ~  ~  ~  ~  ~  ~  ~  D  ~      H   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
I   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~      I   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
J   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~      J   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
[Player 1] Given the recent miss at F5, I see that my opponent is targeting the area around my ships. However, I still need to focus on finding their ships. 

I notice that there are several potential clusters of hits on their board. The most promising areas to target appear to be around the center of their grid, especially considering that I haven't targeted many coordinates in that area yet.

I'll fire at G5, as it falls within a central region of their board where ships are likely to be located. 

I'll take my shot now: [G5].
[GAME] Miss! You missed the ship at G5! Your updated board:
                    
Player 1's View                   
             Your Ships                      Your Hits on Opponent     
    0  1  2  3  4  5  6  7  8  9          0  1  2  3  4  5  6  7  8  9
A   ~  A  A  A  A  A  ~  ~  ~  ~      A   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
B   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~      B   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
C   ~  ~  ~  ~  B  B  B  B  ~  ~      C   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
D   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~      D   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
E   ~  ~  ~  ~  P  ~  ~  ~  ~  ~      E   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
F   ~  ~  ~  ~  P  O  ~  ~  D  ~      F   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
G   ~  ~  ~  ~  S  S  S  ~  D  ~      G   ~  ~  ~  ~  ~  O  ~  ~  ~  ~ 
H   ~  ~  ~  ~  ~  ~  ~  ~  D  ~      H   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
I   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~      I   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
J   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~      J   ~  ~  ~  ~  ~  ~  ~  ~  ~  ~ 
```

## Gameplay

- **Players**: 2
- **Turns**: Players take turns selecting a coordinate on the opponent’s grid to target. Each turn, a player can either hit, miss, or sink one of the opponent's ships.
- **Board**: Each player is has their own grid for ship placement, and a separate tracking grid to record their hits and misses on the opponent.
- **Objective**: Locate and sink all ships on the opponent's grid by strategically guessing coordinates and remembering previous hits.
- **Ship Types and Lengths**:
  - **Aircraft Carrier**: 5 cells
  - **Battleship**: 4 cells
  - **Submarine**: 3 cells
  - **Destroyer**: 3 cells
  - **Patrol Boat**: 2 cells
- **Winning Condition**: The game is won by the first player to sink all of their opponent's ships.


## Key Rules

1. **Attacking**:
   - Players take turns selecting a coordinate on the opponent’s grid (e.g., "[A5]").
   - If the selected coordinate contains part of a ship, it is marked as a "hit" (shown as "X") on both the attacking player's tracking grid and the opponent's ship grid.
   - If the selected coordinate is empty, it is marked as a "miss" (shown as "O").

2. **Valid Moves**:
   - Players must choose a coordinate within the grid bounds (e.g., "A0" to "J9" on a 10x10 grid).
   - Moves are invalid if the chosen coordinate has already been attacked (i.e., previously marked as a hit or miss).

3. **Ship Sinking**:
   - Each ship has a specific length (e.g., Battleship is 4 cells). A ship is considered "sunk" once all of its cells have been hit.
   - The game announces when a player has sunk one of the opponent’s ships.

4. **Winning Conditions**:
   - **Win**: The first player to sink all ships on the opponent’s grid wins the game.
   - **Loss**: A player loses if all their ships are sunk before they can sink the opponent’s ships.
   
   **Note:** Draws are typically not possible in Battleship; however, if desired, a draw rule could be introduced if a maximum turn limit is set.

5. **Game Termination**:
   - The game concludes when one player has successfully sunk all ships on the opponent's grid.


## Rewards

| Outcome          | Reward for Player | Reward for Opponent |
|------------------|:-----------------:|:-------------------:|
| **Win**          | `+1`              | `-1`                |
| **Lose**         | `-1`              | `+1`                |
| **Invalid**      | `-1`              | `0`                 |


## Parameters

- `difficulty` (`str`):
    - **Description**: Sets the difficulty level, adjusting the grid size.
    - **Options**:
        - `"easy"`: Creates a 10x10 grid, ideal for simpler gameplay.
        - `"medium"`: Creates a 12x12 grid, offering moderate difficulty.
        - `"hard"`: Creates an 14x14 grid, challenging players’ strategy.
    - **Impact**:
        - Larger grids increase the game’s difficulty by adding more occurences of misses and rewarding the agent with the better strategy of spreading out.

## Variants

| Env-id                  | difficulty |
|-------------------------|:----------:|
| `Battelship-v0-easy`    | `easy`     |
| `Battelship-v0-medium`  | `medium`   |
| `Battelship-v0-hard`    | `hard`     |

## Example Usage

```python
import textarena as ta

# Initialize the environment
env = ta.make(env_id="Battleship-v0-easy")

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

- **Repeatedly mentioning other trivial coordinates in square brackets**:
    - **Issue**: The game environment wrongly detects a trivial coordinate as the model's decision to attack. This causes the model to wrongly penalize the model for repeating a move, when it was merely thinking aloud about its previous failed move.
    - **Solution**: Refine the prompt to explicitly highlight how mentioned coordinates can be in the format B3 or C8. And only when submitting its move, to wrap in square brackets.

- **Invalid Move Format**:
    - **Issue**: A player keeps repeating the same coordinate as what its opponent made.
    - **Solution**: Encourage the model to explore new insights and strategies different from its opponent.

## Version History
- **v0**
  - Initial release 


### Contact
If you have questions or face issues with this specific environment, please reach out directly to bobby_cheng@i2r.a-star.edu.sg