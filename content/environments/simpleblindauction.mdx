# SimpleBlindAuction Environment Documentation

## Overview
**SimpleBlindAuction** is a streamlined 2-player auction game where players bid on items with different personal valuations. The game consists of two phases: a conversation phase where players freely communicate, followed by a bidding phase where each player submits blind bids for items. Players aim to maximize profit by strategically bidding on items worth more to them than what they pay. This simplified version removes the complexity of private messaging while maintaining the core auction mechanics.

## Action Space

- **Format:** Actions are strings that vary based on the current game phase:
  - **Conversation Phase:**
    - Simply type normal messages (no special formatting required)
    - All messages are automatically public
  - **Bidding Phase:**
    - **Bid:** `[Bid on Item X: amount]` where X is an item ID and amount is the bid in coins

- **Examples:**
  - During conversation: `I'm interested in the Ancient Vase. Which items are you looking at?`
  - During bidding: `[Bid on Item 0: 250] [Bid on Item 3: 175]`

- **Notes:** Players can include multiple bids in a single bidding action, allowing them to bid on multiple items simultaneously.

## Observation Space

**Reset Observations**
On reset, each player receives a prompt containing their starting capital, item information, and personal valuations. For example:

```plaintext
You are Player 0 in a 2-player Simple Blind Auction game.

You have 1000 coins to bid on 5 valuable items.

The auction has two phases:
1. Conversation Phase (3 rounds): Talk with the other player. All messages are public.
2. Bidding Phase (1 round): Submit blind bids on items. Highest bidder wins each item.

Available Items (with their value TO YOU):
- Item 0: Ancient Vase - Value to you: 420 coins
- Item 1: Diamond Necklace - Value to you: 385 coins
- Item 2: Antique Clock - Value to you: 175 coins
- Item 3: Signed Painting - Value to you: 290 coins
- Item 4: Gold Statue - Value to you: 510 coins

Note: Each player may value items differently, up to ±20% difference!

How to play:
- Conversation Phase: Just type your messages normally
- Bidding Phase: Use '[Bid on Item X: amount]' format to bid
  Example: '[Bid on Item 0: 250] [Bid on Item 3: 175]'

Your goal is to win items that are worth more to you than what you paid.
The player with the highest net worth at the end wins.
Net worth = remaining capital + value of won items.
```

**Step Observations**
During gameplay, players receive observations based on actions taken. For example:

```plaintext
[Player 1] I'm interested in the Antique Clock and Silver Chalice. What about you?
[Player 0] I'm more interested in the Gold Statue, but might bid on the Ancient Vase too.

[GAME] Conversation phase complete! Now entering the bidding phase.
Please submit your bids using the format: [Bid on Item X: amount]
You can submit multiple bids in one turn, for example:
[Bid on Item 0: 150] [Bid on Item 2: 200] [Bid on Item 4: 350]

[GAME] You submitted bids for Items: 0, 4.
[GAME] Player 1 has submitted bids.

[GAME] ==================== AUCTION RESULTS ====================

🏆 ITEM RESULTS:
- Item 0 (Ancient Vase): Won by Player 0 for 300 coins
  Value to Player 0: 420 coins (Profit: 120 coins)
- Item 1 (Diamond Necklace): No winner (tie or no bids)
...
```

## Gameplay

- **Players:** Exactly 2 players
- **Initial Setup:** Each player starts with an equal amount of capital (coins)
- **Item Valuation:** Each player has personal valuations for each item that vary up to ±20% from base values
- **Phases:**
  1. **Conversation Phase:** Players take turns sending public messages
  2. **Bidding Phase:** Players submit bids for items
- **Objective:** Maximize profit by winning items for less than their value to you
- **Game Structure:** Configurable number of conversation rounds followed by a single bidding round

## Key Rules

1. **Capital Management:**
   - Each player begins with the same starting capital
   - Players cannot bid more than their available capital
   - The total of all bids cannot exceed a player's remaining capital

2. **Communication:**
   - All messages during conversation phase are public
   - No special tokens or formatting required for conversation
   - Clean and simple interface for player interaction

3. **Bidding System:**
   - **Blind Bidding:** Players cannot see others' bids until results are revealed
   - **Multiple Bids:** Players can bid on as many items as they want in a single turn
   - **Highest Bid Wins:** For each item, the player with the highest bid wins
   - **Ties:** If players bid the same amount or no bids are made, no one wins the item

4. **Valid Moves:**
   - During conversation phase: any text message
   - During bidding phase: bid actions in the format `[Bid on Item X: amount]`
   - Bids must be positive integers and cannot exceed remaining capital

5. **Winning Conditions:**
   - The player with the highest net worth at the end of the game wins
   - Net worth = remaining capital + total value of won items
   - In case of a tie, both players are declared winners

6. **Game Termination:**
   - The game concludes after both players have submitted their bids
   - Final scores are calculated based on each player's net worth

## Parameters

- `starting_capital` (`int`, default: `1000`):
  - **Description:** Initial amount of coins for each player
  - **Impact:** Higher values allow for more aggressive bidding strategies

- `num_items` (`int`, default: `5`):
  - **Description:** Number of items available for auction
  - **Impact:** More items create more complex bidding decisions

- `conversation_rounds` (`int`, default: `3`):
  - **Description:** Number of conversation rounds before bidding
  - **Impact:** More rounds allow for better information gathering

- `base_item_values` (`Optional[List[int]]`, default: `None`):
  - **Description:** Preset base values for items (if None, random values are generated)
  - **Impact:** Can be used to create specific auction scenarios

## Variants

| Env-id                        | starting_capital | num_items | conversation_rounds |
|-------------------------------|:----------------:|:---------:|:-------------------:|
| `SimpleBlindAuction-v0`       | `1000`           | `5`       | `3`                 |
| `SimpleBlindAuction-v0-quick` | `750`            | `3`       | `1`                 |
| `SimpleBlindAuction-v0-rich`  | `2000`           | `5`       | `5`                 |

### Contact
If you have questions or face issues with this specific environment, please reach out directly to guertlerlo@cfar.a-star.edu.sg