# System Patterns: Real-time ASCII Art Drop

**System architecture:**

The application follows a simple client-side architecture, with HTML for structure, CSS for styling, and JavaScript for logic.

**Key technical decisions:**

*   Using the `getUserMedia` API for camera access.
*   Employing a canvas element for video frame processing.
*   Converting video frames to ASCII art based on luminance values.
*   Animating ASCII characters using JavaScript and CSS.

**Design patterns in use:**

*   Module pattern for organizing JavaScript code.
*   Observer pattern for handling events.

**Component relationships:**

*   The `video` element provides the camera input.
*   The `canvas` element is used for frame processing.
*   The `ascii-container` element displays the ASCII art.
