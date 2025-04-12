# System Patterns: 2-Back Memory Game

## System Architecture

The game follows a simple Model-View-Controller (MVC) pattern:

*   **Model:** The `Game` object in `game.js` manages the game state, logic, and data.
*   **View:** The HTML structure and CSS styles define the user interface. The `UI` object in `ui.js` handles updating the UI based on the game state.
*   **Controller:** Event listeners in `game.js` handle user input and trigger updates to the game state and UI.

## Key Technical Decisions

*   **Local Storage:** Using local storage to persist the high score.
*   **Responsive Design:** Using CSS media queries to adapt the UI to different screen sizes.
*   **Modular JavaScript:** Separating the game logic, UI manipulation, and storage operations into separate modules.

## Design Patterns in Use

*   **Module Pattern:** Used in `storage.js`, `ui.js`, and `game.js` to encapsulate functionality and avoid polluting the global namespace.
*   **Observer Pattern:** (Implicit) The UI updates in response to changes in the game state.

## Component Relationships

*   `index.html` defines the structure of the UI and includes the CSS and JavaScript files.
*   `css/styles.css` styles the UI elements.
*   `js/game.js` contains the core game logic and interacts with `ui.js` and `storage.js`.
*   `js/ui.js` handles UI updates and interacts with the DOM.
*   `js/storage.js` handles local storage operations.
