# System Patterns

## Architecture
The game will follow a simple Model-View-Controller (MVC) architecture.

*   **Model:** Represents the game data and logic (e.g., Player, Enemy, Weapon).
*   **View:** Responsible for rendering the game elements on the screen (e.g., drawing the spaceship, enemies, and laser beams).
*   **Controller:** Handles user input and updates the model accordingly (e.g., moving the spaceship, shooting laser beams).

## Class Design

### Game Class
*   Manages the game loop.
*   Initializes and updates game objects.
*   Controls screen rendering.
*   Manages game state (start, running, end).

### Player Class
*   Manages the player's spaceship.
*   Handles movement.
*   Handles shooting.
*   Manages life.

### Enemy Class
*   Manages enemy creation and behavior.
*   Defines movement patterns.
*   Manages enemy state.

### Weapon Class
*   Manages weapon creation and behavior.
*   Calculates projectile trajectory.
*   Handles collision detection.

### CollisionManager Class
*   Manages collision detection between game objects.

### UIManager Class
*   Manages the user interface elements.
*   Displays score.
*   Displays life.
*   Displays game state.

## Design Patterns
*   **Singleton:** The UIManager class will be implemented as a singleton to ensure that there is only one instance of the class.
*   **Factory:** The Enemy class will use a factory pattern to create different types of enemies.
