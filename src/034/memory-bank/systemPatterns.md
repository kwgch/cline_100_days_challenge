# System Patterns

## System Architecture

The system will be structured as follows:

-   **Core Simulation**: p5.js sketch handling particle physics and rendering (WebGL).
-   **Input Handling**: Hammer.js for touch gestures and native events for mouse input.
-   **Display**: HTML canvas element styled with CSS for responsive layout (mobile-first).

## Key Technical Decisions

-   Using p5.js for rapid prototyping and ease of use.
-   Employing Hammer.js for robust touch gesture recognition.
-   Using CSS transforms for zoom control.
-   Implementing a vector field-based force application for fluid dynamics.
-   Using WebGL renderer for optimized performance.

## Design Patterns

-   **Module Pattern**: Encapsulating simulation logic within modules.
-   **Observer Pattern**: Handling events and interactions.

## Component Relationships

-   The `Particle` class manages individual particle properties and behavior, including applying external forces.
-   The main sketch integrates input events, applies forces to particles, and renders the simulation.
-   Hammer.js event handlers interact with the simulation to apply forces based on touch gestures.
