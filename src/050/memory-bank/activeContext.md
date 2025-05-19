# Active Context

## Current Work Focus
- Performing a fifth iteration of refinement on the image generation style, specifically increasing the total number of shapes (`numShapes`) even further, based on positive user feedback and request.
- Updating `GeneticAlgorithmManager.js` with the new `numShapes` range.
- Updating Memory Bank documentation.

## Recent Changes
- Created the Memory Bank with core documentation files.
- Analyzed the project specifications from docs/spec.md.
- Modified `js/GeneticAlgorithmManager.js` to generate shapes based on a grid system (initial version).
- Iteration 2: Increased density (`numShapes` 180-280, larger relative sizes, higher min opacity).
- Iteration 3: Further increased density to "fill the canvas" (`numShapes` 250-400, wider random size ranges).
- Iteration 4: Increased *minimum* sizes for all shape types to ensure more substantial shapes.
- **Further modified `js/GeneticAlgorithmManager.js` (Iteration 5) based on user feedback by:**
    - Increasing `numShapes` to a range of 350-550.

## Next Steps
1. Test the *latest (Iteration 5)* image generation style, focusing on visual appeal and performance with the increased shape count.
2. Create the basic HTML structure for the application.
3. Further develop the `ImageGenerator.js` if needed to refine drawing based on the new gene structures.
4. Develop the genetic algorithm manager (further than current shape generation).
5. Build the Tinder-like UI with swipe functionality.
6. Implement the image saving feature.
7. Ensure responsive design for both mobile and desktop.

## Active Decisions and Considerations

### UI Implementation
- Considering using CSS transforms for card animations
- Need to ensure swipe gestures don't interfere with page scrolling
- Planning to implement both button controls and swipe gestures for maximum accessibility

### Genetic Algorithm Design
- Gene structure supports grid-based placement and sizing.
- Shape generation parameters now include a very high `numShapes` count (350-550), along with previously established larger minimum sizes and broad size variation.
- Mutation rates and strategies for these parameters will need review during testing.

### Image Generation
- `GeneticAlgorithmManager.js` now generates an even higher number of shapes (350-550) to maximize canvas fill.
- `ImageGenerator.js` renders these genes using Canvas API.
- Performance with this very high number of shapes and extreme overlaps is a critical concern to monitor.
- Caching strategies might be important if rendering becomes slow.

### Mobile Considerations
- Need to ensure touch events work properly on various devices
- Consider viewport settings to prevent zooming/scaling issues
- Ensure buttons are large enough for comfortable tapping on mobile

## Important Patterns and Preferences

### Code Organization
- Planning to use ES6 modules for better code organization
- Will separate concerns into distinct components as outlined in systemPatterns.md
- Will use event-driven architecture for UI updates

### Naming Conventions
- camelCase for variables and functions
- PascalCase for classes
- Descriptive names that reflect purpose

### UI Design
- Clean, minimalist interface
- Focus on the image being evaluated
- Simple, intuitive controls
- Visual feedback for swipe actions

## Learnings and Project Insights
- Genetic algorithms can be computationally intensive, so optimization will be important
- The balance between mutation rate and selection pressure will affect how quickly images evolve
- User engagement may decrease if evolution is too slow or too random
- The initial population diversity will impact the exploration of the design space
- The new grid-based generation aims for a specific aesthetic; user feedback will be key to confirm it meets expectations.
