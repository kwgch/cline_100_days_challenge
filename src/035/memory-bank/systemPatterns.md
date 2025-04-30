# System Patterns

## System Architecture
The system consists of a p5.js sketch that renders a 3D generative art piece. User interaction is implemented using p5.js functions like `orbitControl()`.

## Key Technical Decisions
- Using `orbitControl()` for handling user interactions.
- Optimizing the code for performance on smartphones.

## Design Patterns in Use
- Using a `for` loop to draw multiple boxes.
- Using the `angle` variable to animate the shapes, colors, and scales of the boxes.

## Component Relationships
The p5.js sketch interacts with the user through mouse and touch events. The sketch also uses p5.js functions for rendering and animation.
