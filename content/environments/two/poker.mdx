# Poker Environment Documentation

## Overview

**Poker** is a strategic two-player Texas Hold'em game where players compete by betting chips based on their hole cards and community cards. Each player aims to win chips by either having the best hand at showdown or making their opponent fold. The game follows standard Texas Hold'em rules with a fixed number of rounds and betting structures.

## Action Space

- **Format:** Actions are strings representing the player's poker actions or messages.
- **Special Tokens:**
    - **[Check]:** When there's no bet to call.
    - **[Call]:** Match the current bet.
    - **[Fold]:** Give up the current hand.
    - **[Bet <amount>]:** Make a new bet (e.g., `[Bet 100]`).
    - **[Raise <amount>]:** Increase an existing bet (e.g., `[Raise 200]`)
- **Examples:**
    - `"The pot odds aren't good enough. [Fold]"`
    - `"I'll match that. [Call]"`
    - `"[Bet 150] Let's see how you respond to aggression"`
    - `"Nothing to call. [Check]"`
    - `"Too small. [Raise 300]"`
- **Notes:**    
    - Players can include additional text before or after the action tokens
    - Bet and raise amounts must be integers
    - Players must have sufficient chips for their actions


## Observation Space

### Observations

Players receive continuous updates about the game state, including their hole cards, visible community cards, pot size, and betting actions.

**Reset Observation:**

On reset, each player receives a prompt detailing the game rules and their initial stack size:
```plaintext
Welcome to Texas Hold'em Poker! You are Player {player_id}.

Game Information:
- This is a {num_rounds}-round game
- Each player starts with {starting_chips} chips
- Small blind is {small_blind} chips
- Big blind is {big_blind} chips

Game Flow:
1. Each player receives 2 hole cards
2. Betting rounds: Pre-flop → Flop (3 cards) → Turn (1 card) → River (1 card)
3. Players must call the current bet to stay in the hand

Available Actions:
  [Check] - When there's no bet to call
  [Call] - Match the current bet
  [Fold] - Give up your hand
  [Bet <amount>] - Make a new bet, e.g. [Bet 100]
  [Raise <amount>] - Increase the current bet, e.g. [Raise 200]

Winning:
- Best poker hand wins the pot
- Game ends when rounds are complete or a player runs out of chips
- Player with the most chips at the end wins
```

**Step Observation:**
During the game, players receive updates about:
- Their hole cards
- Visible community cards
- Current pot size
- Player chip stacks
- Betting actions
- Hand results
<!-- ```plaintext
Player 1: [Offer] I give 3 Sheep; You give 2 Wheat.
``` -->

## Gameplay
- **Players**: 2
- **Rounds**: Configurable number of hands to play.
- **Starting Stack**: Each player begins with a set amount of chips.
- **Blinds**: Fixed small and big blind amounts
- **Betting Rounds**: Pre-flop, Flop, Turn, and River.
- **Objective**: Win the most chips by either showing down the best hand or making opponents fold.

## Key Rules
1. Hand Structure:
    - Each player receives 2 private hole cards.
    - 5 community cards are dealt face-up in stages (3-1-1).
    - Best 5-card hand wins using any combination of hole and community cards.

2. Betting Rounds:
    - Pre-flop: After hole cards are dealt
    - Flop: After first 3 community cards
    - Turn: After 4th community card
    - River: After 5th community card

3. Hand Rankings (Highest to Lowest):
    - Straight Flush
    - Four of a Kind
    - Full House
    - Flush
    - Straight
    - Three of a Kind
    - Two Pair
    - One Pair
    - High Card

4. Valid Actions:
    - Check (when no bet to call)
    - Call (match current bet)
    - Bet (make a new bet)
    - Raise (increase existing bet)
    - Fold (surrender hand)

5. Winning Conditions:
    - **Win:** At the end of the game, the player with the most chips wins.
    - **Draw:** If both players have the same number of chips at the end of the game.
    - **Loss:** If a player makes an invalid move or finish the game with fewer chips than the opponent, they lose.

6. Game Termination:
    - The game ends when the maximum number of turns is reached.
    - The winner is determined based on the change in inventory values.
    - In cases of invalid moves, the game will terminate early with penalties applied.


## Rewards

| Outcome          | Reward for Player | Reward for Opponent |
|------------------|:-----------------:|:-------------------:|
| **Win**          | `+1`              | `-1`                |
| **Lose**         | `-1`              | `+1`                |
| **Draw**         |  `0`              |  `0`                |
| **Invalid Move** | `-1`              |  `0`                |


## Parameters

- `num_rounds` (`int`):
    - Number of hands to play
    - Determines game length and strategic depth

- `starting_chips` (`int`):
    - Initial chip stack for each player
    - Influences betting decisions and game duration

- `small_blind` (`int`):
    - Mandatory small blind bet
    - Sets minimum betting scale

- `big_blind` (`int`):
    - Mandatory big blind bet
    - Double the small blind



## Variants

| Env-id                   | num_rounds | starting_chips | small_blind | big_blind |
|--------------------------|:----------:|:--------------:|:-----------:|:---------:|
| `Poker-v0`               |     `5`    |    `1,000`     |    `10`     |    `20`   | 
| `Poker-v0-long`          |    `15`    |    `5,000`     |    `20`     |    `40`   |
| `Poker-v0-super-long`    |    `50`    |   `10,000`     |    `40`     |    `80`   |

## Example Usage

```python
import textarena as ta

# Initialize the environment
env = ta.make("Poker-v0")

# Wrap for consistent observation handling
env = ta.wrappers.LLMObservationWrapper(env)

# Initialize agents
agents = {
    0: ta.basic_agents.OpenRouter(model_name="gpt-4"),
    1: ta.basic_agents.OpenRouter(model_name="gpt-4o")
}

# Start a new game
observations = env.reset(seed=42)

# Game loop
truncated, terminated = False, False
while not (truncated or terminated):
    # Get current player
    current_player = env.get_current_player_id()
    
    # Get player's observation
    observation = observations[current_player]
    
    # Get action from agent
    action = agents[current_player](observation)
    
    # Execute action
    observations, rewards, truncated, terminated, info = env.step(current_player, action)
    
# Print final results
for player_id, agent in agents.items():
    print(f"{agent.model_name}: {rewards[player_id]}")
print(f"Reason: {info['reason']}")
```

## Troubleshooting

- **Invalid Bet Amount:**
    - **Issue:** Player attempts to bet or raise more chips than they have.
    - **Solution:** Ensure bet amount is less than or equal to player's remaining chips.

- **Invalid Action Sequence:**
    - **Issue:** Player tries to check when there's a bet to call.
    - **Solution:** Player must either call, raise, or fold when facing a bet.

- **Missing Action Token:**
    - **Issue:** Action string doesn't contain a valid action token.
    - **Solution:** Include one of `[Check]`, `[Call]`, `[Fold]`, `[Bet <amount>]`, or `[Raise <amount>]`.

## Version History
- **v0**
  - Initial release 



### Contact
If you have questions or face issues with this specific environment, please reach out directly to Guertlerlo@cfar.a-star.edu.sg