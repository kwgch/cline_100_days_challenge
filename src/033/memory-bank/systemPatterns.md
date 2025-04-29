# System Patterns: Life Game

## System Architecture
The system will use a main loop to update the game state. The world controller will manage organisms, energy, and collisions. A gene processor will handle DNA execution in a sandboxed environment.

## Key Technical Decisions
- Use JavaScript for the game logic and UI.
- Use Canvas for rendering.
- Implement a spatial hash grid for collision detection.
- Use Web Workers for DNA execution.

## Design Patterns
- Observer pattern for organism interactions.
- Factory pattern for organism creation.

## Component Relationships
- Main Loop -> World Controller
- World Controller -> Gene Processor, Energy Manager, Collision Detector
- Gene Processor -> Sandboxed VM
