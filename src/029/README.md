# 3D Metaball Interactive Visualizer

## Overview

This project is an interactive 3D metaball visualizer built with WebGL, Three.js, and GSAP. It runs on both smartphones and PCs, allowing users to intuitively manipulate metaballs in a 3D space with smooth, organic movement and responsive design.

## Features

- **3D Metaball Rendering:** Multiple metaballs rendered in 3D, smoothly merging and forming organic shapes.
- **Fluffy Movement:** Metaballs move randomly and smoothly within the 3D space, with adjustable speed and range.
- **Interactive Controls:** 
  - Swipe/drag to move the view (touch for smartphones, mouse for PC).
  - Tap/click on metaballs for visual feedback (color change).
- **Responsive Design:** Adapts to both portrait mobile and desktop browsers, adjusting size and layout.
- **Performance Optimized:** Designed to run smoothly on mobile devices.

## Technologies

- HTML, CSS, JavaScript
- [Three.js](https://threejs.org/) (3D graphics)
- [GSAP](https://greensock.com/gsap/) (animation)
- WebGL (via Three.js)

## Usage

1. Clone or download this repository.
2. Open `index.html` in your web browser (Chrome, Safari, etc.).
3. Interact with the metaballs using touch or mouse controls.

## Development

- Edit `index.html`, `style.css`, and `script.js` for structure, styling, and logic.
- Three.js and GSAP are loaded via CDN in `index.html`.
- For best results, use a modern browser.

## Project Structure

- `index.html` - Main HTML file, includes canvas and script/style references.
- `style.css` - Styles for layout, background, and responsive design.
- `script.js` - Three.js scene setup, metaball logic, animation, and interaction.
- `memory-bank/` - Project documentation and context files.
- `.clinerules` - Project-specific rules and requirements.

## Design

- **Background:** Dark tone for contrast.
- **Metaballs:** Bright, visually appealing colors that change on interaction.
- **Font:** System default for clarity.
- **UI:** Minimal, intuitive, and mobile-friendly.

## Notes

- The number of metaballs is tuned for mobile performance.
- Touch interactions are designed to prevent unwanted scrolling on smartphones.
- If files become large, consider splitting logic into modules.

## License

MIT License
