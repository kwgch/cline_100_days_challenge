# Simple Image Editor

A simple image editor that runs in the browser using HTML, JavaScript, and CSS.

## Features

- Image upload
- Transparency processing
- Clipping
- Scaling
- Mobile responsiveness

## Technologies Used

- HTML
- CSS
- JavaScript
- Canvas API

## Usage

1. Open `index.html` in your browser.
2. Upload an image.
3. Use the tools in the toolbar to edit the image.
4. Download the edited image.

## File Structure

```
/
├── index.html        # Main HTML file
├── css/
│   └── style.css     # Stylesheet
└── js/
    ├── app.js        # Main application logic
    ├── core/
    │   ├── Editor.js       # Editor class
    │   └── Canvas.js       # Canvas class
    ├── tools/
    │   ├── ToolManager.js  # Tool manager class
    │   └── *.js          # Tool classes
    ├── commands/
    │   └── *.js          # Command classes
    └── utils/
        └── *.js          # Utility classes
```