# Space Invaders Game

## Overview

This is a space invaders game created using HTML, JavaScript, and CSS. The game is playable in a web browser without any external dependencies.

## How to Play

- Use the left and right arrow keys to move the player's spaceship.
- Use the spacebar to fire bullets.
- Destroy the waves of descending alien invaders.
- The game tracks the player's score and remaining lives.

## Technologies Used

- HTML: For structuring the game elements.
- CSS: For styling the game elements.
- JavaScript: For implementing the game logic and event handling.

## Design Patterns

- Singleton: For managing the game instance.
- Factory: For creating game entities (player, invaders, bullets).
- Observer: For handling game events (collisions, score updates).
- State: For managing the game state (playing, paused, game over).
- Command: For handling user input.

## Architecture

The game is structured using a modular architecture with separate modules for game logic, rendering, input handling, and audio.

## Development Setup

- VS Code as the code editor.
- A web browser for testing the game.

## Current Status

The core game mechanics have been implemented, including player movement, shooting, enemy movement, collisions, and scoring.

## Next Steps

- Implement more advanced game features, such as power-ups, different types of invaders, and multiple levels.
- Improve the game's visual and audio presentation.
- Add a start screen and a game over screen.
