# System Patterns

**System Architecture:**

The application follows a simple front-end architecture with HTML, CSS, and JavaScript. It utilizes the Google Translate API for translation functionality.

**Key Technical Decisions:**

*   Using client-side JavaScript for all processing to ensure privacy and security.
*   Using the Google Translate API for translation.
*   Implementing a responsive design for cross-device compatibility.

**Design Patterns in Use:**

*   Module pattern: The application is divided into modules for file handling, translation, and main application logic.
*   Asynchronous programming: Asynchronous functions are used to handle file reading and translation.

**Component Relationships:**

```
index.html  -- Main HTML file
│
├── css/
│   └── styles.css  -- Style definitions
│
├── js/
│   ├── main.js     -- Main application logic
│   ├── fileHandler.js  -- File reading and saving
│   └── translator.js  -- Translation logic
