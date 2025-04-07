# System Patterns

**System Architecture:**

The 15 puzzle game follows the Model-View-Controller (MVC) architectural pattern.

*   **Model:** The `Game.js`, `Board.js`, and `Tile.js` files represent the data and logic of the game.
*   **View:** The `BoardView.js` and `UIView.js` files handle the presentation of the game to the user.
*   **Controller:** The `GameController.js` file acts as an intermediary between the model and the view, handling user input and updating the game state.

**Key Technical Decisions:**

*   Using HTML, CSS, and JavaScript for cross-platform compatibility.
*   Implementing the core game logic in JavaScript classes.
*   Using CSS Grid for the board layout.
*   Using local storage to save high scores (to be implemented).

**Design Patterns in Use:**

*   **MVC (Model-View-Controller):** Separates the data, presentation, and control logic of the application.
*   **Module Pattern:** Encapsulates the code within each file, preventing naming conflicts and improving maintainability.

**Component Relationships:**

*   `GameController` orchestrates the game flow by interacting with `Game`, `BoardView`, and `UIView`.
*   `Game` manages the game state and uses `Board` to represent the puzzle board.
*   `Board` manages the tiles and their positions, using `Tile` to represent individual tiles.
*   `BoardView` renders the board based on the data in `Board`.
*   `UIView` manages the UI elements, such as the move counter, timer, and reset button.
