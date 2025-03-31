# System Patterns

## System Architecture
The game follows a modular architecture with separate modules for game logic, ball management, catcher management, item management, score management, and UI management.

## Key Technical Decisions
- Using vanilla JavaScript to avoid external dependencies.
- Implementing the game loop using `requestAnimationFrame` for smooth animation.
- Using HTML5 canvas for rendering the game elements.

## Design Patterns in Use
- **Module Pattern:** Each JavaScript file represents a module with its own scope and functionality.
- **Observer Pattern:** The `Game` class observes mouse movements to update the catcher position.

## Component Relationships
- `Game` class manages the overall game state and interacts with all other classes.
- `Ball` class manages individual balls and their properties.
- `Catcher` class manages the catcher and its interactions with the mouse.
- `Item` class manages special items and their effects.
- `ScoreManager` class manages the score and game difficulty.
- `UIManager` class manages the UI elements and their display.
