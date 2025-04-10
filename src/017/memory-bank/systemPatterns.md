# System Patterns: Bombing Game

## System Architecture
The game follows a simple client-side architecture. The game logic, rendering, and user interaction are all handled within the browser using HTML, CSS, and JavaScript.

## Key Technical Decisions
- Use of HTML5 canvas for rendering the game elements.
- Use of JavaScript classes to represent game objects (Player, Enemy, Bomb).
- Use of `requestAnimationFrame` for the game loop.
- Use of mo.js library for explosion effects.

## Design Patterns in Use
- **Module Pattern:** The game logic is encapsulated within JavaScript modules to maintain separation of concerns.
- **Factory Pattern:** The `Enemy` class can be extended to create different types of enemies.

## Component Relationships
- **Player:** Represents the player-controlled plane.
- **Enemy:** Represents the enemies that the player must bomb.
- **Bomb:** Represents the bombs dropped by the player.
- **GameArea:** The main container for the game elements.
- **ScoreDisplay:** Displays the player's current score.
- **Controls:** Contains the start button and instructions.
