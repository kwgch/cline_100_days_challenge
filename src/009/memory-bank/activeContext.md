# Active Context

This file tracks the current work focus, recent changes, and next steps for the project.

## Current Work Focus

- Improving mobile support and fixing issues.

## Recent Changes

- Added a viewport meta tag to the `index.html` file to properly scale the content for mobile devices and disable user scaling.
- Modified the CSS to ensure the toolbar buttons wrap to the next line on smaller screens and are centered.
- Increased the padding and font size of the buttons for a better touch experience.
- Reset default body margins and ensured full viewport height.
- Added touch event listeners to the canvas to enable clipping on mobile devices.
- Prevented scrolling while clipping on touch devices.
- Limited the image size to the screen width when uploaded on a mobile device.

## Next Steps

- Implement image download
- Implement drag and drop image upload
- Implement undo/redo functionality
- Implement file saving functionality
