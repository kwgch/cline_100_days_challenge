# System Patterns

## System Architecture
The game will follow a simple Model-View-Controller (MVC) pattern.

-   **Model**: Represents the game state (score, lives, ball position, brick positions).
-   **View**: Renders the game scene using Babylon.js.
-   **Controller**: Handles user input and updates the game state.

## Key Technical Decisions
-   Using Babylon.js for 3D rendering.
-   Implementing manual collision detection for simplicity.
-   Using HTML, CSS, and JavaScript for cross-platform compatibility.

## Design Patterns in Use
-   MVC pattern for separating concerns.
-   Singleton pattern for managing game state.

## Component Relationships
-   `GameManager` manages the overall game flow and interacts with `SceneManager`, `InputManager`, `PaddleController`, `BallController`, and `BlockController`.
-   `SceneManager` creates and manages the Babylon.js scene.
-   `InputManager` handles user input and passes it to `PaddleController`.
-   `PaddleController` controls the paddle's movement.
-   `BallController` manages the ball's movement and collision detection.
-   `BlockController` creates and manages the blocks.
