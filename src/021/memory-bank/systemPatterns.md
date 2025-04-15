# System Patterns: Fireworks Game

## System Architecture
The game follows a simple architecture with three main components:

-   **Game Engine (game.js):** Manages the game loop, firework creation, user input, and scoring.
-   **Firework Class (firework.js):** Represents individual fireworks with properties like position, velocity, and color.
-   **Particle Class (particle.js):** Represents individual particles for the explosion effect.

## Key Technical Decisions
-   Using HTML5 Canvas for rendering.
-   Using JavaScript for game logic and physics.
-   Using requestAnimationFrame for smooth animations.

## Design Patterns in Use
-   **Object-Oriented Programming:** The game utilizes classes (Game, Firework, Particle) to structure the code and manage game elements.
-   **Game Loop:** The gameLoop function in game.js implements the game loop pattern, updating and rendering the game state at regular intervals.

## Component Relationships
-   The Game Engine creates and manages Firework objects.
-   The Firework objects create Particle objects when they explode.
-   The Game Engine updates and renders both Firework and Particle objects.
