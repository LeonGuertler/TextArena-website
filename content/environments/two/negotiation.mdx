# Negotiation Environment Documentation

## Overview

**Negotiation** is a strategic two-player game where each participant starts with a set of resources valued differently by each player. The objective is to negotiate trades that enhance the total value of your resources more than your opponent can. Players alternate turns to communicate and make trade offers, aiming to optimize their inventory's value while managing the opponent's resources.

## Action Space

- **Format:** Actions are strings representing the player's messages or trade actions.
- **Special Tokens:**
    - **[Offer]:** To make a trade offer.
        - **Format:** `[Offer: <your resources> -> <their resources>.`
        - **Example:** `[Offer: 2 Wheat, 1 Ore -> 3 Sheep]`
    - **[Accept]:** To accept an incoming trade offer.
    - **[Deny]:** To deny an incoming trade offer.
- **Examples:**
    - `"I think we should collaborate on gathering more resources."`
    - `"[Offer: 1 Wood -> 2 Wheat]"`
    - `"That is not worth it for me. [Deny]. But how about this: [Offer: 2 Wood -> 5 Wheat]"`
    - `"Fantastic. [Accept]"`
- **Notes:**    
    - Players can include additional text before or after the special tokens.
    - When responding to an offer, ensure your reply contains either `[Accept]` or `[Deny]` as appropriate.


## Observation Space

### Observations

Players receive a series of messages exchanged during the game, including their own resource allocations and values. This information aids in making informed trade decisions to maximize their inventory value.

**Reset Observation:**

On reset, each player receives a prompt detailing their initial resources, their values, and instructions on how to interact within the game. For example:
```plaintext
[GAME]: You are Player 0 in the Negotiation Game.
You have some resources, and your task is to trade such that the total value of your resources increases.
The resources and associated values you currently have are: 10 Wheat (Value of each: 5); 15 Wood (Value of each: 10); 20 Sheep (Value of each: 15); 5 Brick (Value of each: 25); 8 Ore (Value of each: 40).
At each turn, you can talk to your opponent or make an explicit trade offer.
Use the following special tokens for actions:
  - [Offer]: To make a trade offer.
    Format: [Offer] I give [your resources]; You give [their resources].
    Example: [Offer] I give 2 Wheat, 1 Ore; You give 3 Sheep.
  - [Accept]: To accept an incoming offer.
  - [Deny]: To deny an incoming offer.
You can include additional text before or after these tokens.
If responding to an offer, ensure your reply contains [Accept] or [Deny] as appropriate.
The game lasts for 10 turns in total.

```

**Step Observation:**
After each step, players receive updates about trade offers and actions taken. For example:
```plaintext
Player 1: [Offer] I give 3 Sheep; You give 2 Wheat.
```

## Gameplay
- **Players**: 2
- **Turns**: Players alternate sending messages or making trade offers.
- **Resources**: Each player starts with a random allocation of resources: Wheat, Wood, Sheep, Brick, Ore.
- **Resource Values**: Each resource has a value that varies per player (±20% of the base value), influencing the strategic value of trades.
- **Objective**: Maximize the total value of your resources by negotiating beneficial trades while minimizing the opponent's advantage.
- **Turn Limit**: The game can be configured with a maximum number of turns (default is 10), after which it ends and the player with the highest inventory value gain wins.

## Key Rules
1. Resources and Values:
    - Each player starts with a random quantity of resources.
    - The value of each resource is personalized for each player, affecting the trade dynamics.

2. Making Trade Offers:
    - Players can propose trades using the `[Offer]` token.
    - The offer must specify what the proposer is giving and what they are requesting in return.
    - **Format:** `[Offer: <your resources> -> <their resources>]`
    - **Example:** `[Offer: 2 Wheat, 1 Ore -> 3 Sheep]`

3. Responding to Offers:
    - When a player receives a trade offer, they must respond using `[Accept]` or `[Deny]`.
    - **[Accept]:** Agree to the trade, resulting in the exchange of specified resources.
    - **[Deny]:** Reject the trade, and the current offer is discarded.

4. Valid Moves:
    - All actions must strings. If the opponent has made an offer (`[Offer]`), the immediate next action needs to contain either `[Accept]` or `[Deny]`; as appropriate.
    - Offers must follow the correct format and involve available resources.

5. Winning Conditions:
    - **Win:** At the end of the game, the player with the highest increase in inventory value compared to their initial value wins.
    - **Draw:** If both players have the same increase in inventory value after the maximum number of turns.
    - **Loss:** If a player makes an invalid trade offer or accepts a trade without sufficient resources, they receive a penalty.

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

- `max_turns` (`int`):
    - **Description**: Specifies the maximum number of turns allowed before the game ends.
    - **Impact**: Limits the duration of the game, encouraging strategic and efficient trading.



## Variants

| Env-id                   | max_turns |
|--------------------------|:---------:|
| `Negotiation-v0`         |    `20`   |
| `Negotiation-v0-short`   |    `10`   |
| `Negotiation-v0-long`    |    `50`   |

## Example Usage

```python
import textarena as ta

# Initialize the environment
env = ta.make(env_id="Negotiation-v0")

# Wrap the environment for easier observation handling
env = ta.wrappers.LLMObservationWrapper(env=env)

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

- **Invalid Trade Offer Format:**
    - **Issue:** Player makes a trade offer that doesn't follow the `[Offer: ... -> ...]` format.
    - **Solution:** Ensure that all trade offers strictly adhere to the specified format, clearly listing resources and quantities.

- **Insufficient Resources for Trade:**
    - **Issue:** A player attempts to offer or accept a trade without having enough resources.
    - **Solution:** Verify resource quantities before making or accepting offers. The environment will penalize invalid moves.

## Version History
- **v0**
  - Initial release 



### Contact
If you have questions or face issues with this specific environment, please reach out directly to Guertlerlo@cfar.a-star.edu.sg