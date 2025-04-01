# System Patterns

## System Architecture
The game will be built using a modular approach, with separate modules for:
-   Paddle logic
-   Ball logic
-   Scoring
-   Game loop
-   Rendering

## Key Technical Decisions
-   Using HTML5 Canvas for rendering.
-   Using JavaScript for game logic.
-   Implementing a simple game loop for updating and rendering the game state.

## Design Patterns
-   Object-oriented programming: Each game element (paddle, ball) will be represented as an object with its own properties and methods.
-   Module pattern: Separate modules for different parts of the game logic.

## Component Relationships
-   The game loop will update the state of the paddles and the ball.
-   The ball will interact with the paddles and the walls.
-   The scoring module will keep track of the score based on the ball's position.
