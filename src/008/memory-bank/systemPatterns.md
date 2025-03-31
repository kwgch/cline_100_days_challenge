# System Patterns: Space Invaders Game

**System architecture:**
The game will be structured using a modular architecture with separate modules for game logic, rendering, input handling, and audio.

**Key technical decisions:**
- Using the Canvas API for rendering the game.
- Using JavaScript for game logic and event handling.
- Using CSS for styling the game elements.

**Design patterns in use:**
- Singleton: For managing the game instance.
- Factory: For creating game entities (player, invaders, bullets).
- Observer: For handling game events (collisions, score updates).
- State: For managing the game state (playing, paused, game over).
- Command: For handling user input.

**Component relationships:**
- The Game component manages the overall game state and coordinates the other components.
- The Renderer component handles the rendering of the game elements.
- The InputHandler component handles user input.
- The AudioManager component handles audio playback.
- The EntityFactory component creates game entities.
- The CollisionDetector component detects collisions between game entities.
- The ScoreManager component manages the player's score.
