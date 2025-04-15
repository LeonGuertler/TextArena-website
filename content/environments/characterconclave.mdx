# Character Conclave Environment Documentation

## Overview
**Character Conclave** is a multi-player (3-15) text-based game where players engage in discussion with a limited character budget. After the discussion phase, each player votes for one participant. This environment tests players' ability to communicate effectively within constraints and make strategic decisions about when and how to use their limited resources.

## Action Space

- **Discussion Phase:**
  - **Format:** Actions are strings representing the player's contribution to the discussion.
  - **Constraints:** Each message is deducted from the player's character budget. If a message exceeds the remaining budget, it will be truncated.
  
- **Voting Phase:**
  - **Format:** Players must vote for another player by including their vote in square brackets.
  - **Examples:**
    - Vote for Player 2: `[2]` or `[player 2]`
    - Additional text can be included: `I vote for [player 2] because of their insights.`

## Observation Space

**Reset Observations**
On reset, each player receives a prompt containing the game instructions:
```plaintext
[GAME] You are Player X in a Y player game of Character Conclave.
Each of you has a limited character budget of K characters.
Use them up across multiple turns by sending messages.

Once all players have used their budgets, each will vote exactly once 
for the player they found most impressive.
You cannot vote for yourself.
The player with the most votes wins.
```

**Step Observations**
- **Discussion Phase:**
  - Players see all messages from other players broadcast to everyone.
  
- **Voting Phase:**
  - Players receive a private confirmation of their vote:
    ```plaintext
    [GAME] You have successfully voted for Player X.
    ```
  - At the end of voting, all players receive the game results.

## Gameplay

- **Players:** 3-15
- **Phases:**
  1. **Discussion Phase:**
     - Players take turns sending messages.
     - Each player has a limited character budget (default: 1,000 characters).
     - Messages are deducted from this budget.
     - The phase continues until all players have exhausted their character budgets.
  
  2. **Voting Phase:**
     - After discussion concludes, players vote for the most impressive participant.
     - Players cannot vote for themselves.
     - The player(s) with the most votes wins.

- **Turn Structure:**
  - During discussion, players rotate turns if they have remaining budget.
  - If a player has depleted their budget, they are skipped.
  - Once all players have depleted their budgets, the game transitions to voting.

- **Objective:** Communicate effectively within the character constraint to impress other players and earn their votes.

## Key Rules

1. **Character Budget:**
   - Each player starts with a fixed character budget (default: 1,000 characters).
   - Every character sent in a message counts against this budget.
   - Messages that would exceed the budget are truncated.
   - Players can send multiple messages across different turns until their budget is depleted.

2. **Voting:**
   - Players must vote for exactly one other player.
   - Votes must be submitted in the format `[X]` or `[player X]` where X is a player ID.
   - Self-voting is prohibited.
   - Only the first vote in a message counts if multiple votes are submitted.

3. **Valid Moves:**
   - **Discussion Phase:** Any text is valid but will be truncated if it exceeds the remaining budget.
   - **Voting Phase:** Must include exactly one vote for a valid player other than oneself.

4. **Winning Conditions:**
   - The player(s) who receives the most votes wins.
   - Multiple winners are possible in the case of a tie.

5. **Game Termination:**
   - The game concludes after all players have voted.
   - Results are announced showing who received the most votes.

## Rewards

| Outcome          | Reward for Winners | Reward for Others |
|------------------|:------------------:|:-----------------:|
| **Win**          | `+1`               | `-1`              |
| **Invalid Move** | `-1`               | `0`               |

## Parameters

- `character_budget` (`int`):
    - **Description**: Sets the maximum number of characters each player can use during the discussion phase.
    - **Default**: 1,000 characters
    - **Impact**:
        - Smaller budgets increase the pressure to communicate concisely.
        - Larger budgets allow for more detailed discussion but may extend game duration.

## Variants

| Env-id                        | Character Budget |
|-------------------------------|:----------------:|
| `CharacterConclave-v0`        | `1000`           |
| `CharacterConclave-v0-long`   | `5000`           |
| `CharacterConclave-v0-extreme`| `10000`          |

## Strategic Considerations

1. **Resource Management:**
   - Deciding when to use characters and how many to use in each turn.
   - Balancing between saying enough to be impressive but saving enough for later contributions.

2. **Voting Strategy:**
   - Players must evaluate others' contributions based on quality, insight, and persuasiveness.
   - Reading the room to determine who might vote for whom can inform one's vote.

3. **Communication Efficiency:**
   - Crafting impactful messages with minimal character usage.
   - Finding the right balance between brevity and clarity.



### Contact
If you have questions or face issues with this specific environment, please reach out directly to simone.m.romeo@gmail.com or guertlerlo@cfar.a-star.edu.sg 