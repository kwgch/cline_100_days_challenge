# Technical Context

## Technologies Used

### Frontend
- **HTML5**: Structure of the web application
- **CSS3**: Styling and animations, with focus on responsive design
- **JavaScript (ES6+)**: Core application logic and interactivity
- **Canvas API**: For generating and rendering images

### Development Tools
- **Git**: Version control
- **Modern Web Browser**: For testing and development (Chrome, Firefox, Safari)
- **VSCode**: Code editor

## Technical Constraints

### Client-Side Only
- The application runs entirely in the browser without server dependencies
- All data is stored in memory during the session
- Images can be saved locally but no persistent storage between sessions

### Browser Compatibility
- Target modern browsers with good Canvas API support
- Ensure touch events work properly on mobile devices
- Ensure mouse events work properly on desktop devices

### Performance Considerations
- Image generation should be optimized for speed
- UI animations should be smooth and responsive
- Memory usage should be monitored, especially for long sessions

## Dependencies
- No external libraries required, using vanilla JavaScript
- Potential optional dependencies:
  - Hammer.js (for advanced touch gestures if needed)
  - FileSaver.js (for easier file saving if needed)

## Development Setup
- Local development using a simple web server
- No build process required (vanilla JS)
- Testing across multiple devices and browsers

## Technical Decisions

### Why Canvas for Image Generation
- Direct pixel manipulation
- Good performance for dynamic image generation
- Native browser support without external dependencies

### Why Client-Side Only
- Simplicity of deployment
- No server costs or maintenance
- Privacy (all user preferences stay local)

### Why Vanilla JavaScript
- Reduced overhead
- No dependency management
- Better learning experience for developers
- Sufficient for the application's needs

## Tool Usage Patterns

### Canvas API Usage
- Create canvas element
- Get 2D context
- Draw shapes based on genetic parameters
- Convert to data URL for saving

### Touch/Mouse Event Handling
- Use pointer events where possible for unified interface
- Fall back to separate touch/mouse events where needed
- Implement drag threshold for accidental swipes
- Ensure events don't interfere with scrolling

### Genetic Algorithm Implementation
- Random generation of initial population
- Mutation operations on genes
- Selection based on user input
- No crossover in initial implementation (potential future enhancement)
