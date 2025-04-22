# Rolling Ball Maze Game

## Overview
This is a 3D rolling ball maze puzzle game where the player tilts the maze to roll a ball to the goal within a time limit. The game uses Babylon.js for 3D rendering and physics simulation.

## Features
- 3D maze environment with walls, floor, and a rolling ball.
- Touch, mouse drag, and keyboard controls to tilt the maze.
- Physics-based ball rolling using dynamic gravity vector adjustment.
- Multiple levels with maze generation.
- UI overlay for stage clear messages.

## Controls
- On touch devices: drag on the screen to tilt the maze.
- On PC: use mouse drag or arrow/WASD keys to tilt the maze.

## Technical Details
- Uses Babylon.js with Cannon.js or Oimo.js physics engine.
- Maze is static; ball rolls according to gravity vector changes.
- Gravity vector is dynamically updated based on user input tilt.
- Ball physics parameters tuned for smooth and responsive rolling.

## Development
- Written in JavaScript with modular structure.
- Uses ES modules and modern browser APIs.
- Designed for mobile-first but supports PC browsers.

## How to Run
- Open `index.html` in a modern web browser.
- No server required; runs locally.

## Next Steps
- Fine-tune physics and controls.
- Implement level progression and UI elements.
- Test on various devices.

## Project Structure
- `src/` - Source code modules.
- `memory-bank/` - Project documentation and context.
- `index.html` - Main HTML file.
- `style.css` - Stylesheet.
- `README.md` - This file.

## Author
Developed by cline AI coding assistant.
