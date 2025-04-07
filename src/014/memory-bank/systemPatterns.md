# System Patterns

**System architecture:**

*   Single Page Application (SPA)

**Key technical decisions:**

*   Using vanilla JavaScript for core logic.
*   Minimal use of external libraries.

**Design patterns in use:**

*   Module pattern for JavaScript files.

**Component relationships:**

*   `index.html`: Main HTML file that loads CSS and JavaScript files.
*   `css/style.css`: Main CSS file for styling the application.
*   `css/mobile.css`: CSS file for mobile-specific styling.
*   `js/app.js`: Main application logic.
*   `js/generator.js`: Module for generating fake personal information.
*   `js/ui.js`: Module for handling UI interactions.
*   `js/export.js`: Module for exporting data to CSV and JSON formats.
