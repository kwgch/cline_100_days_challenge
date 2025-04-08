# System Patterns

## System Architecture
The system follows a simple Model-View-Controller (MVC) architecture.

## Key Technical Decisions
- Using HTML5 Canvas for rendering.
- Using JavaScript for game logic and event handling.
- Using CSS for styling.

## Design Patterns in Use
- Singleton pattern for the game instance.
- Observer pattern for event handling.

## Component Relationships
- The `game.js` component is the main controller that manages the game loop and coordinates the other components.
- The `cannon.js` component is responsible for controlling the cannon's angle and power.
- The `projectile.js` component is responsible for calculating the projectile's trajectory and drawing it on the canvas.
- The `target.js` component is responsible for drawing the target on the canvas and detecting collisions with the projectile.
- The `utils.js` component provides utility functions for math and random number generation.
