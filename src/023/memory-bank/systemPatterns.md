# System Patterns

## System Architecture
The system follows a modular architecture, with separate modules for grid management, rule engine, UI control, pattern library, and local storage. The application controller (app.js) orchestrates the interaction between these modules.

## Key Technical Decisions
- Use HTML, JavaScript, and CSS for the implementation.
- Implement the grid using a 2D array or TypedArray.
- Use requestAnimationFrame for animation.
- Use local storage for saving settings and patterns.

## Design Patterns in Use
- Module pattern: Each module is implemented as a separate JavaScript file with a well-defined interface.
- Observer pattern: The UI controller observes the grid and updates the UI accordingly.
- Strategy pattern: The rule engine uses different strategies for applying different rule sets.

## Component Relationships
- The grid module is responsible for managing the grid data and rendering the grid.
- The rule engine module is responsible for applying the rules of the game to the grid.
- The UI controller module is responsible for handling user input and updating the UI.
- The pattern library module is responsible for loading and saving patterns.
- The local storage module is responsible for saving settings and patterns to local storage.
