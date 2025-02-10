# Spite and Malice Environment Documentation

## Overview
**Spite and Malice** is a two-player competitive card game where players race to be the first to empty their “payoff” pile by playing cards onto shared center piles in sequential order. Each player has a hand, a payoff pile, and four personal discard piles, allowing for strategic play. Kings act as wild cards and can substitute any rank in the sequence. Players take turns drawing, playing, or discarding cards until one player wins by emptying their payoff pile. This environment includes clear rules for sequential play on center piles, support for using Kings as wild cards, and tracking of cards across hand, payoff, and discard piles, providing a robust environment for agent-based gameplay.

## Action Space
- **Format:** Actions are strings representing the player's choice. For example:
- **Example:**
    - Draw cards from the replenishment pile: [draw]
    - Move "A♦" to the first pile of the Center Piles: [play A♦ 0]
    - Discard "Q♣" to the third pile of the Discard Piles: [discard Q♣ 2]
- **Notes:** The players are free to have additional texts and multiple moves in their replies, so long they provide their actions in the correct format of [action card index]. For draw, the positions `card` and `index` are ignored.

## Observation Space
**Reset Obsevations**
On reset, each player receives a prompt containing their beginning game instructions. For example:
```plaintext
[GAME] You are Player 0 in a two-player game of Spite and Malice. Your goal is to be the first to empty your payoff pile.

### Game Overview:
- The objective is to clear your payoff pile by playing cards to the center piles.
- You can play cards from three sources:
  1. Your **hand** (you start each turn with up to 5 cards in hand).
  2. The **top card of your payoff pile**.
  3. The **top card of any of your discard piles**.

### Playing Rules:
- You may play a card to a center pile if it is **one rank higher** than the top card on that pile (center piles start with Ace and go up to Queen; Kings are wild - they can be played on any card but do not change the rank sequence. This means if a King is used after 4, then that King is ranked 5 and the next card must be a 6).
- If you can't play any more cards, you must **discard a card** to one of your discard piles to end your turn.
- If a center pile reaches Queen, it will be cleared automatically.
- The rank order is: A=1, 2=2, ..., 9=9, J=10, Q=11, K as wild.

### Actions:
1. **Draw**: At the start of your turn, draw cards to fill your hand up to 5 cards. Enter **[draw]** to begin.
2. **Play a Card**: To play a card, specify the card and the center pile like this: **[play A♠ 0]** (where 'A♠' is the card and '0' is the center pile index).
3. **Discard**: If you can’t play any more cards, discard a card from your hand to a discard pile to end your turn. Enter **[discard A♠ 1]** (where 'A♠' is the card and '1' is the discard pile index).

Here is the current game state:
--- Center Piles ---
Pile 0: []
Pile 1: []
Pile 2: []
Pile 3: []

--- Player 0's View ---
Payoff Pile (Top Card): K♠, Payoff Pile Length: 20
Hand: ['Q♣', '9♦', '7♣', '8♠', 'K♠']
Discard Piles: [[], [], [], []]


Player 0, you will start first. Please enter your action in the format [action card center_index].
```

**Step Observation:**
After each step, the players receive the latest message from the game environment. For example, here's player 0 making its first move and the environment responds back:
```plaintext
[Player 0] Since all center piles are empty, you can start by playing an Ace to any of them. However, you don't currently have an Ace in your hand or on top of your payoff pile. Fortunately, Kings are wild and can be played as any card. Let's use the King from your hand to start a pile.

Let's play the King from your hand to center pile 0 to set up for further plays:

\```
[play K♠ 0]
\```

After this, you can continue playing cards. Let me know if you want to make another move or if you need further assistance!
[GAME] You played K♠ on center pile 0. Your updated view:
--- Center Piles ---
Pile 0: ['K♠']
Pile 1: []
Pile 2: []
Pile 3: []

--- Player 0's View ---
Payoff Pile (Top Card): 6♠, Payoff Pile Length: 19
Hand: ['Q♣', '9♦', '7♣', '8♠', 'K♠']
Discard Piles: [[], [], [], []]
```

## Gameplay

- **Players**: 2
- **Turns**: Players take turns attempting to play cards onto the center piles from one of three sources: their hand, the top card of their payoff pile, or the top card of any of their four personal discard piles. Unlike other turn-based games, this game only switches turns when the player has made the action of "discarding" a card. As such, readers will notice a slight difference in the example usage as compared to other games examples.
- **Draw Phase**: At the beginning of each turn, a player draws enough cards to restore their hand to 5 cards, provided there are cards left in the deck.
- **Playing Cards**: Players can play cards in sequential order onto one of the shared center piles, starting each sequence with an Ace and progressing up to Queen. Kings act as wild cards and can substitute for any rank within a sequence.
  - **Center Piles**: Up to four center piles are available for play. Once a pile reaches Queen, it is cleared, allowing for a new sequence to begin.
  - **Source of Cards**:
    - **Hand**: A player may play any card from their hand.
    - **Payoff Pile**: The top card of the payoff pile can be played if it fits the center pile sequence.
    - **Discard Piles**: The top card of any discard pile can also be played if it is sequentially valid.
- **Discarding**: If a player has no playable cards, they must discard one card from their hand to one of their four discard piles, which ends their turn.
- **Objective**: The goal of the game is to be the first player to completely empty their payoff pile by legally playing cards onto the center piles.
- **Wild Card (King) Usage**: Kings can be played as wild cards to represent any needed rank. When a King is played, it assumes the rank required for the sequence at that point. For example, if a pile shows `1 2 3 K`, the King represents `4`, meaning the next playable card on that pile would need to be a `5` (or another King acting as `5`).
- **Winning Condition**: The game is won by the first player to successfully play all the cards from their payoff pile.


## Key Rules

1. **Playing Cards**:
   - On their turn, players attempt to play cards onto the center piles from one of three sources: 
     - **Hand**: Players can play any card from their hand.
     - **Payoff Pile**: The top card of the payoff pile, which is the primary goal to clear.
     - **Discard Piles**: The top card of any of the four personal discard piles.
   - Cards must be played in ascending order on the center piles, starting with Ace and continuing up to Queen.
   - **Kings** are wild cards and can be used to represent any rank in the sequence. When a King is played, it takes on the next required rank in the sequence. For example, if a pile shows `1 2 3 K`, the King represents `4`, meaning the next card played on that pile should be a `5` (or another King acting as `5`).

2. **Draw Phase**:
   - At the beginning of each turn, the player draws cards to restore their hand to 5 cards, provided there are cards left in the deck.
   - Players cannot draw additional cards during their turn; drawing occurs only at the start of each turn.

3. **Discarding**:
   - If a player cannot play any more cards, they must discard one card from their hand to one of their four discard piles, ending their turn.
   - Players may choose which discard pile to place the card in, allowing for strategic setup of future turns.

4. **Center Pile Clearing**:
   - There are up to four center piles in play. Once a center pile reaches a Queen, it is cleared from the board, making room for a new sequence to begin with an Ace (or a King acting as an Ace).

5. **Winning Condition**:
   - **Win**: The game is won by the first player to empty their payoff pile by legally playing all of its cards onto the center piles.
   - **Loss**: The other player loses when their opponent successfully clears their payoff pile first.

   **Note:** In Spite and Malice, there are no draws. The game always continues until one player completes their payoff pile and wins.


## Rewards

| Outcome          | Reward for Player | Reward for Opponent |
|------------------|:-----------------:|:-------------------:|
| **Win**          | `+1`              | `-1`                |
| **Lose**         | `-1`              | `+1`                |
| **Invalid**      | `-1`              | `0`                 |


## Variants

| Env-id                  |
|-------------------------|
| `SpiteAndMalice-v0`     |


## Example Usage
```python
import textarena as ta

# Initialize the environment
env = ta.make(env_id="SpiteAndMalice-v0")

# Wrap the environment for easier observation handling
env = ta.wrappers.LLMObservationWrapper(env=env)

# Wrap the environment for pretty rendering
env = ta.wrappers.PrettyRenderWrapper(env=env)

# initalize agents
agents = {
    0: ta.basic_agents.OpenRouter(model_name="gpt-4o"),
    1: ta.basic_agents.OpenRouter(model_name="gpt-4o")
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

- **Repeatedly making moves that defy the sequence order of the center piles**:
    - **Issue**: The player repeats the mistake of adding cards to a new or existing center pile that are not incremental ranks above the top card of the selected pile, or begin as Aces.
    - **Solution**: Refine the prompt to explicitly show how the incremental ranks should be like.


## Version History
- **v0**
  - Initial release 


### Contact
If you have questions or face issues with this specific environment, please reach out directly to bobby_cheng@i2r.a-star.edu.sg