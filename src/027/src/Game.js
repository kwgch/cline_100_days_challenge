import { SceneManager } from "./SceneManager.js";
import { PhysicsManager } from "./PhysicsManager.js";
import { InputManager } from "./InputManager.js";
import { LevelManager } from "./LevelManager.js";
import { UIManager } from "./UIManager.js";
import { Timer } from "./Timer.js";
import { MazeGenerator } from "./MazeGenerator.js";
import { levelSettings } from "./levelSettings.js";
import { GRAVITY } from "./constants.js";

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = null;
        this.levelManager = new LevelManager(levelSettings);
        this.sceneManager = null;
        this.inputManager = new InputManager(this.canvas);
        this.uiManager = null;
        this.timer = new Timer();
        this.physicsManager = null;
        this.mazeGenerator = new MazeGenerator();

        this.isGameOver = false;
        this.currentLevelIndex = 0;

        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }

    async init() {
        this.scene = new BABYLON.Scene(this.engine);
        this.sceneManager = new SceneManager(this.scene);
        this.physicsManager = new PhysicsManager();
        this.physicsManager.enablePhysics(this.scene, new BABYLON.Vector3(0, GRAVITY, 0));

        this.sceneManager.createCamera();
        this.sceneManager.createLights();
        this.sceneManager.attachCameraControl(this.canvas);

        await this.startLevel(this.currentLevelIndex);
        this.startGameLoop();
    }

    startGameLoop() {
        if (this.engine.activeRenderLoops.length === 0) {
            this.engine.runRenderLoop(() => {
                if (!this.isGameOver && this.scene && this.scene.isReady()) {
                    const deltaTime = this.engine.getDeltaTime() / 1000.0;

                    // Get target tilt from input manager
                    const targetTilt = this.inputManager.getTargetTilt();

                    // Apply tilt smoothly in SceneManager
                    this.sceneManager.tiltMaze(targetTilt.x, targetTilt.z);

                    // Update Timer
                    //this.timer.update(deltaTime);

                    // Update UI
                    //this.uiManager.updateLevel(this.currentLevelIndex + 1, this.levelManager.getTotalLevels());
                    //this.uiManager.updateTimers(this.timer.getLevelTime(), this.timer.getTotalTime());

                    // Check Goal
                    //if (this.levelManager.checkGoal(this.sceneManager.ball)) {
                    //    this.levelComplete();
                    //}

                    this.scene.render();
                }
            });
            console.log("Render loop started.");
        }
    }

    async startLevel(levelIndex) {
        this.isGameOver = false;
        this.sceneManager.clearLevelMeshes(); // Clear previous level

        // Load level data (maze layout, start position, etc.)
        const levelSettings = this.levelManager.getLevelSettings(levelIndex);
        if (!levelSettings) {
            this.gameOver("Congratulations! You completed all levels!");
            return;
        }

        // Generate maze data
        const mazeData = this.mazeGenerator.generate(levelSettings.width, levelSettings.height);

        // Create maze and ball
        //this.sceneManager.createMaze(levelData.maze);
        this.sceneManager.createMazeFromData(mazeData, levelSettings.width, levelSettings.height);
        this.sceneManager.createBall(levelSettings.startPos);

        // Reset timer
        this.timer.reset();
    }

    levelComplete() {
        this.currentLevelIndex++;
        if (this.currentLevelIndex >= this.levelManager.getTotalLevels()) {
            this.gameOver("Congratulations! You completed all levels!");
        } else {
            this.startLevel(this.currentLevelIndex);
        }
    }

    gameOver(message) {
        this.isGameOver = true;
        alert(message);
    }
}
