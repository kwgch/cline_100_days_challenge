# System Patterns

## System Architecture
The application follows a component-based architecture, with distinct modules for UI, model loading, preprocessing, inference, postprocessing, and visualization. The architecture is described in the architecture design document provided by the user.

## Key Technical Decisions
- **TensorFlow.js:** Using TensorFlow.js for running the DistilBERT model in the browser.
- **@xenova/transformers:** Utilizing the `@xenova/transformers` library for tokenization.
- **D3.js:** Employing D3.js for creating the attention visualization.
- **Vanilla JS (Tentative):** Initially considering Vanilla JS for the UI to minimize dependencies.

## Design Patterns
- **Component-Based Architecture:** The system is divided into loosely coupled components with well-defined responsibilities.
- **Data Flow:** Data flows unidirectionally from the UI through the preprocessing, inference, postprocessing, and visualization components.

## Component Relationships
- **UI:** Interacts with the user and orchestrates the other components.
- **Model Loader:** Loads the TensorFlow.js model.
- **Preprocessor:** Tokenizes the input text.
- **Inference Engine:** Runs the model and extracts attention weights.
- **Postprocessor:** Formats the model output for visualization.
- **Visualization Engine:** Renders the attention visualization.
