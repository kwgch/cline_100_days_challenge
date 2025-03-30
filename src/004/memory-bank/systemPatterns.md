# System Patterns

**Architecture:**

The game follows a component-based architecture with clear separation of concerns.

**Key Technical Decisions:**

*   Using JavaScript classes to represent game entities (Board, Piece, Player, etc.).
*   Employing the State pattern to manage the game's state transitions.
*   Using Strategy pattern to define piece movement rules.

**Design Patterns in Use:**

*   **State Pattern:** Manages the game's state (e.g., Player 1 Turn, Player 2 Turn, Game Over).
*   **Factory Pattern:** Creates Piece objects.
*   **Observer Pattern:** Enables communication between game components (e.g., BoardView updates when the board changes, displays check/game over messages).
*   **Strategy Pattern:** Encapsulates piece movement rules.
*   **Singleton Pattern:** GameManager ensures only one instance of the game manager exists.

**Component Relationships:**

*   `GameManager` orchestrates the game flow and manages game state.
*   `Board` represents the Shogi board and manages piece placement.
*   `Piece` is the base class for all Shogi pieces.
*   `BoardView` renders the game board and handles user interactions, and displays game status messages.
*   `MoveStrategy` defines the movement rules for each piece type.
