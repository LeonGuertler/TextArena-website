import { GameDocumentation } from "@/components/game-documentation"

export default function ConnectFourDocumentation() {
  return (
    <GameDocumentation
      name="Connect Four"
      description="Connect Four is a two-player connection game where players alternately drop discs into a vertical grid. The objective is to connect four of one's own discs in a row—vertically, horizontally, or diagonally—before the opponent does. This text-based environment allows customization of grid size and supports both Open and Closed game modes."
      rules={[
        "Players take turns dropping discs into a column using the [col x] format.",
        "A valid move must correspond to an unfilled column in the range [0, num_cols - 1].",
        "The disc falls to the lowest available space in the chosen column.",
        "The game ends when a player connects four discs or the board is full (draw).",
      ]}
      actionSpace="Actions are strings in the format [col x], where x is a valid column number (0 to num_cols - 1). Players can include additional text before or after the special tokens."
      observationSpace="Players receive a series of messages exchanged during the game, including their own & the opponent's moves and the current board state. This information aids in making informed decisions about future moves or conceding the game."
      gameplay={[
        "Grid Size: Customizable (num_rows x num_cols).",
        "Players: 2",
        "Turns: Players alternate making moves until one player wins or all fields are used (draw).",
        "Move Format: The moves are col, followed by the column number (e.g., [col 0])",
        "Disc Placement: A disc falls to the lowest available space within the chosen column.",
        "Winning Condition: Connect four discs vertically, horizontally, or diagonally.",
        "Draw Condition: The game ends in a draw if the board is full without any player connecting four discs.",
      ]}
      keyRules={[
        {
          title: "Move Mechanics",
          rules: [
            "Players take turns dropping discs into a column using the [col x] format.",
            "A valid move must correspond to an unfilled column in the range [0, num_cols - 1].",
            "The disc falls to the lowest available space in the chosen column.",
          ],
        },
        {
          title: "Game Termination",
          rules: [
            "Win: The game ends immediately when a player connects four discs in a row vertically, horizontally, or diagonally.",
            "Draw: The game ends in a draw if all columns are filled and no player has achieved four in a row.",
          ],
        },
        {
          title: "Invalid Moves",
          rules: [
            "If a player attempts to place a disc in a full column, the move is considered invalid.",
            "If a player provides an incorrectly formatted action (e.g., missing brackets or an invalid column number), the move is rejected.",
            "Players must ensure their moves are properly formatted and legal to avoid penalties.",
          ],
        },
        {
          title: "Game Visibility",
          rules: [
            "If is_open is True, the full board state is visible after each move.",
            "If is_open is False, players only receive textual updates about moves made.",
          ],
        },
        {
          title: "Turn Structure",
          rules: [
            "Players alternate turns sequentially, with Player 0 starting the game.",
            "The game continues until a player wins or a draw is reached.",
          ],
        },
      ]}
      rewards={[
        { outcome: "Win", player: "+1", opponent: "-1" },
        { outcome: "Lose", player: "-1", opponent: "+1" },
        { outcome: "Draw", player: "0", opponent: "0" },
        { outcome: "Invalid Move", player: "-1", opponent: "0" },
      ]}
      parameters={[
        {
          name: "is_open",
          type: "bool",
          description: "Determines whether the game board is visible to both players.",
          impact: [
            "True: Players can see the current state of the board.",
            "False: Players receive only textual updates without seeing the board.",
          ],
        },
        {
          name: "num_rows",
          type: "int",
          description: "Specifies the number of rows in the game board.",
          impact: ["Affects the vertical size of the grid, influencing how discs stack."],
        },
        {
          name: "num_cols",
          type: "int",
          description: "Specifies the number of columns in the game board.",
          impact: ["Determines the horizontal size of the grid and available columns for disc placement."],
        },
      ]}
      variants={[
        { id: "ConnectFour-v0", isOpen: "True", numRows: "6", numCols: "7" },
        { id: "ConnectFour-v0-blind", isOpen: "False", numRows: "6", numCols: "7" },
        { id: "ConnectFour-v0-large", isOpen: "True", numRows: "12", numCols: "15" },
      ]}
      exampleUsage={`import textarena as ta

# Initialize the environment
env = ta.make(env_id="ConnectFour-v0")

# Wrap the environment for easier observation handling
env = ta.wrappers.LLMObservationWrapper(env=env)

# initalize agents
agents = {
    0: ta.basic_agents.OpenRouter(model_name="gpt-4o"),
    1: ta.basic_agents.OpenRouter(model_name="gpt-4o-mini")
}

# reset the environment to start a new game
env.reset(seed=490)

# Game loop
done = False
while not done:

    # Get player id and observation
    player_id, observation = env.get_observation()

    # Agent decides on an action based on the observation
    action = agents[player_id](observation)

    # Execute the action in the environment
    done, info = env.step(action=action)

# get game rewards
rewards = env.close()`}
      troubleshooting={[
        {
          issue: "Invalid Action Format",
          solution: "Ensure that actions are strings formatted exactly as [col x], where x is a valid column number.",
        },
        {
          issue: "Column Full",
          solution: "Choose a different column that is not full.",
        },
        {
          issue: "Out of Bounds Column Number",
          solution: "Verify the number of columns and select a valid column number within the range.",
        },
      ]}
      contact="If you have questions or face issues with this specific environment, please reach out directly to Guertlerlo@cfar.a-star.edu.sg"
      gifSrc="/gifs/connect-four.gif"
    />
  )
}

