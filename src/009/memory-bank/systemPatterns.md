# System Patterns

This file describes the system architecture, key technical decisions, design patterns in use, and component relationships.

## Architecture

The application uses a Model-View-Controller (MVC) architecture.

## Key Technical Decisions

- Using HTML, JavaScript, and CSS for the front-end
- Implementing image editing functionality on the client-side
- Using the Canvas API for image manipulation

## Design Patterns

- Singleton: The `Editor` class is a singleton.
- Command: Each editing operation is a command.
- Strategy: Different image processing algorithms are implemented as strategies.
- Observer: The `EventBus` class implements the observer pattern.

## Component Relationships

- The `Editor` class manages the application state and coordinates the other components.
- The `Canvas` class handles the rendering of the image.
- The `Toolbar` class provides the user interface for selecting tools.
- The `Controller` class handles user input and updates the model.
- The `Model` class stores the image data.
