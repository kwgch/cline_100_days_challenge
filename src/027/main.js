import { Game } from "./src/Game.js";
import { SceneManager } from "./src/SceneManager.js";
import { PhysicsManager } from "./src/PhysicsManager.js";
import { InputManager } from "./src/InputManager.js";
import { LevelManager } from "./src/LevelManager.js";
import { UIManager } from "./src/UIManager.js";
import { Timer } from "./src/Timer.js";
import { MazeGenerator } from "./src/MazeGenerator.js";

// --- Main Execution ---
window.addEventListener("DOMContentLoaded", () => {
    window.game = new Game("renderCanvas");
    window.game.init().catch(error => {
        console.error("Game initialization failed:", error);
        alert("Failed to initialize the game. Check console for details.");
    });
});
