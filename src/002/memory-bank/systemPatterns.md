## System Patterns

**System Architecture:**

The game uses a state-based architecture to manage the game flow. The core components are:

*   **GameContext:** Manages the game state and transitions.
*   **States:** Define the behavior for each stage of the game (Initial, CardExchange, Result).
*   **Models:** Represent the game entities (Deck, Card, Player, NPC).
*   **UI Manager:** Handles the UI updates and interactions.
*   **Strategies:** Define the NPC's card exchange logic.

**Key Technical Decisions:**

*   Using modules to organize the JavaScript code.
*   Implementing a state pattern for game flow management.
*   Employing a basic strategy pattern for the NPC.

**Design Patterns in Use:**

*   State Pattern
*   Strategy Pattern

**Component Relationships:**

*   GameContext holds instances of states, player, NPC, and deck.
*   States interact with the UI Manager to update the UI.
*   NPC uses a strategy to decide which cards to exchange.
