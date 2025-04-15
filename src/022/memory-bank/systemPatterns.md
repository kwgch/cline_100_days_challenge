# System Patterns

## System Architecture
The game will follow a simple Model-View-Controller (MVC) pattern.

## Key Technical Decisions
- Using local storage for high score persistence.
- Using requestAnimationFrame for smooth animations.

## Design Patterns in Use
- MVC pattern for separating concerns.
- Singleton pattern for managing game state.

## Component Relationships
- GameManager: Manages the overall game state and coordinates the other components.
- Target: Represents the target that the user clicks.
- UIManager: Manages the user interface.
- StorageManager: Manages the local storage.
