# Secret Mafia Environment Documentation

## Overview
**Secret Mafia** is a social deduction game where players are secretly assigned roles as either Villagers or Mafia members. The game alternates between day and night phases. During the day, all players openly discuss and vote to eliminate a suspected Mafia member. During the night, Mafia members secretly choose a Villager to eliminate, while special roles like Doctor and Detective perform their unique actions. The Village team wins by eliminating all Mafia members, while the Mafia team wins by gaining equal or greater numbers than the Villagers.

## Action Space

- **Format:** Actions are strings that depend on the current game phase and player role:
  - **Day Discussion Phase (All Players):**
    - Everything said is automatically broadcasted to all players
  - **Day Voting Phase (All Players):**
    - **Vote:** `[Player X]` or `[X]` where X is a player ID
  - **Night Phase (Role-Specific):**
    - **Mafia:** `[Player X]` or `[X]` where X is a target player ID
    - **Doctor:** `[Player X]` or `[X]` where X is a player ID to protect
    - **Detective:** `[Player X]` or `[X]` where X is a player ID to investigate

- **Examples:**
  - Day Discussion: `I think Player 2 is suspicious because they were quiet yesterday`
  - Vote during voting phase: `[Player 2]` or `[2]`
  - Mafia targeting: `[Player 3]` or `[3]`
  - Doctor protection: `[Player 1]` or `[1]`
  - Detective investigation: `[Player 4]` or `[4]`

- **Notes:** The game automatically handles phase transitions and processes votes. In case of a tie during voting, no player is eliminated for that round.

## Observation Space

**Reset Observations**
On reset, each player receives a prompt containing their role, team, and available actions:

```plaintext
Welcome to Secret Mafia! You are Player 0.
Your role: Villager
Team: Village
Description: A regular villager. Your goal is to identify and eliminate all Mafia members through voting during the day.

Players: Player 0, Player 1, Player 2, Player 3, Player 4, Player 5, Player 6

The game progresses through Day and Night phases:
• During the Day phase, there are 3 rounds of discussion followed by voting
• During discussions, everything you say is automatically broadcasted to all players
• After discussions, all players must vote to eliminate one player
• During the Night phase, special roles perform their actions

The game ends when either all Mafia members are eliminated (Village wins) or
Mafia members equal or outnumber Villagers (Mafia wins)

Your abilities:
  During DAY phase:
    • Everything you say is automatically shared with all players
    • You'll vote to eliminate a player at the end of discussions

  During NIGHT phase:
    • You have no special actions during the night phase

Your goal is to help identify and eliminate all Mafia members.
```

**Step Observations**
During gameplay, players receive observations based on the current phase and actions:

```plaintext
# Day Discussion Phase
[Player 1] I think Player 3 is suspicious because they were quiet yesterday
[Player 2] I agree, Player 3 hasn't contributed much to the discussion

# Day Voting Phase
[GAME] The voting phase has began. On your turn, submit your vote for which player you want to vote out.
       Simply reply in the following format: '[Player X]' or '[X]'
       valid options: '[0]', '[1]', '[2]', '[3]', '[4]', '[5]'
[Player 0] [3]
[Player 1] [3]
[Player 2] [5]
[GAME] Player 3 has been eliminated. They were a Villager.

# Night Phase (Mafia)
[GAME] The Night phase has started, please vote who you would like to kill.
       Only votes in the format '[Player X]' or '[X]' are valid.
       Valid votes: '[0]', '[1]', '[2]', '[5]'
[Player 4] [1]

# Night Phase (Doctor)
[GAME] We are in the Night phase. Since you are the doctor, you can decide which player to save.
       Simply reply in the following format: '[Player X]' or '[X]'
       valid options: '[0]', '[1]', '[2]', '[4]', '[5]'
[Player 2] [1]

# Night Phase (Detective)
[GAME] We are in the Night phase. Since you are the detective, you can decide which player to investigate.
       Simply reply in the following format: '[Player X]' or '[X]'
       valid options: '[0]', '[1]', '[3]', '[4]', '[5]'
[Player 5] [4]
[GAME] Player 4 is part of the Mafia
```

## Gameplay

- **Players:** 5-15 players
- **Initial Setup:** Players are assigned roles as Villagers, Mafia, Doctor, and Detective
- **Game Progression:** Alternating day discussion, day voting, and night phases
- **Objective:** 
  - **Village Team:** Identify and eliminate all Mafia members
  - **Mafia Team:** Eliminate enough Villagers to gain majority

## Key Rules

1. **Roles:**
   - **Villager:** Regular team member with no special abilities
   - **Mafia:** Works secretly to eliminate Villagers
   - **Doctor:** Can protect one player from Mafia elimination each night
   - **Detective:** Can investigate one player each night to learn if they are Mafia

2. **Communication:**
   - **Day Phase:** All players can discuss openly
   - **Night Phase:** Only specific actions are allowed based on role

3. **Elimination:**
   - **Day Phase:** Players vote to eliminate one suspected Mafia member
   - **Night Phase:** Mafia members collectively choose one Villager to eliminate

4. **Protection:**
   - Doctor can protect one player from Mafia elimination each night
   - If Doctor protects the Mafia's target, no elimination occurs that night

5. **Investigation:**
   - Detective can investigate one player each night
   - Detective learns immediately if the investigated player is Mafia or not

6. **Ties:**
   - If there's a tie in voting, no player is eliminated

7. **Victory Conditions:**
   - **Village Team Wins:** All Mafia members are eliminated
   - **Mafia Team Wins:** Mafia members equal or outnumber Villagers

## Rewards

| Outcome         | Reward for Winners | Reward for Others |
|-----------------|:------------------:|:-----------------:|
| **Village Win** | `+1`               | `-1`              |
| **Mafia Win**   | `+1`               | `-1`              |
| **Invalid Move**| `-1`               | `0`               |

## Parameters

- `mafia_ratio` (`float`, default: `0.25`):
  - **Description:** Ratio of Mafia members to total players
  - **Impact:** Higher values increase difficulty for the Village team

- `include_special_roles` (`bool`, default: `True`):
  - **Description:** Whether to include Doctor and Detective roles
  - **Impact:** When True, adds more complex gameplay dynamics

## Game Phases

1. **Night-Mafia:** Mafia members vote for a target to eliminate
2. **Night-Doctor:** Doctor chooses a player to protect from elimination
3. **Night-Detective:** Detective investigates a player to learn if they are Mafia
4. **Day-Discussion:** All players discuss openly (multiple rounds)
5. **Day-Voting:** All players vote to eliminate a suspected Mafia member

## Implementation Notes

- The game uses a unique voting system where votes are collected and ties result in no elimination
- Day discussion is structured with a fixed number of discussion rounds
- Mafia members know each other's identities at the start of the game
- Special roles (Doctor, Detective) receive immediate feedback on their actions
- The game automatically handles phase transitions based on player actions

## Example Game Flow

1. Game starts with Night-Mafia phase (Mafia selects target)
2. Doctor protects a player (if Doctor is alive)
3. Detective investigates a player (if Detective is alive)
4. Day-Discussion begins with all players discussing
5. Day-Voting occurs with all players voting
6. A player may be eliminated based on votes
7. Game checks for win conditions
8. Cycle repeats until one team wins

## Variants

| Env-id                | mafia_ratio | discussion_rounds |
|-----------------------|:-----------:|:-----------------:|
| `SecretMafia-v0`      |    `0.25`   |        `3`        |


### Credit
Simone Romeo suggested to add this game to TextArena.

### Contact
If you have questions or face issues with this specific environment, please reach out directly to guertlerlo@cfar.a-star.edu.sg