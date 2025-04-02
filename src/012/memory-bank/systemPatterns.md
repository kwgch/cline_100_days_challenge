# System Patterns

## System Architecture
The application follows a Model-View-Controller (MVC) architecture.

## Key Technical Decisions
- Using HTML, CSS, and JavaScript for broad compatibility.
- Implementing the Sudoku solving algorithm directly in JavaScript.
- Using local storage to save game state.

## Design Patterns in Use
- MVC Pattern: Separates data, UI, and logic.
- Module Pattern: Organizes code into reusable modules.

## Component Relationships
- GameController orchestrates the interaction between the Model, View, and Utility components.
- InputController handles user input and updates the Model.
- BoardView renders the Sudoku grid based on the Model data.
