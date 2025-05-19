# System Patterns

## System Architecture
The application follows a layered architecture with clear separation of concerns:

```
[UI Layer (HTML/CSS)]
       |
[Logic Layer (JavaScript)]
       |
[Data Layer (In-memory entity management)]
```

## Component Structure
The application is organized into the following key components:

| Component Name         | Responsibility                                     |
|------------------------|---------------------------------------------------|
| UI (Tinder-like Card)  | Image display, swipe/button operations, save button |
| ImageGenerator         | Generate Canvas images from genes                  |
| GeneticAlgorithmManager| Entity generation, genetic operations, queue management |
| StorageManager         | Image saving (local storage, download link generation) |
| EventHandler           | User input (swipe/click) management                |

## Design Patterns

### Model-View-Controller (MVC)
- **Model**: GeneticAlgorithmManager (manages the state and evolution of images)
- **View**: UI components (display images and handle user interface)
- **Controller**: EventHandler (processes user input and updates the model)

### Factory Pattern
- Used in ImageGenerator to create different types of shapes based on genetic parameters

### Observer Pattern
- Used for event handling and UI updates when the image queue changes

### Command Pattern
- Used to encapsulate user actions (like, dislike, save) as objects

## Key Implementation Paths

### Image Generation Flow
1. Generate random genes for shapes and their properties
2. Convert genes to visual representation using Canvas API
3. Render the image on the UI

### Genetic Algorithm Flow
1. Initialize population with random individuals
2. Present individuals to user for evaluation
3. Select individuals based on user preference
4. Generate offspring with mutations
5. Repeat from step 2

### User Interaction Flow
1. Display current image from queue
2. Capture user input (swipe or button click)
3. Process decision (like or dislike)
4. Update queue based on decision
5. Display next image from queue

## Data Flow
1. **Initialization**: GeneticAlgorithmManager generates initial entities and stores them in queue
2. **Display**: Queue provides one image at a time, ImageGenerator renders it to UI
3. **User Input**: EventHandler captures swipe/button input
4. **Decision Processing**:
   - "Like" → Generate two offspring and add to queue
   - "Dislike" → Remove from queue
5. **Image Saving**: StorageManager converts Canvas image to downloadable format
6. **Continuation**: Process repeats until queue is empty or user ends session
