class Game {
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

// Level data (example)
const levelSettings = [
    { width: 11, height: 11, startPos: { x: 1, y: 0.5, z: 1 }, goalPos: { x: 9, y: 0.5, z: 9 } },
    { width: 15, height: 15, startPos: { x: 1, y: 0.5, z: 1 }, goalPos: { x: 13, y: 0.5, z: 13 } },
];

const GRAVITY = -9.81;

class SceneManager {
    constructor(scene) {
        this.scene = scene;
        this.camera = null;
        this.lights = [];
        this.ball = null;
        this.mazeContainer = null;
        this.levelMeshes = [];
        this.floor = null;
    }

    createCamera() {
        this.camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        this.camera.attachControl(this.scene.getEngine().getRenderingCanvas(), true);
    }

    createLights() {
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        this.lights.push(light);
    }

    createBall(startPosition) {
        this.ball = BABYLON.MeshBuilder.CreateSphere("ball", { diameter: 0.5, segments: 32 }, this.scene);
        this.ball.position = new BABYLON.Vector3(startPosition.x, startPosition.y, startPosition.z);
        this.ball.physicsImpostor = new BABYLON.PhysicsImpostor(this.ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.2, friction: 0.8 }, this.scene);
        this.ball.material = new BABYLON.StandardMaterial("ballMat", this.scene);
        this.ball.diffuseColor = new BABYLON.Color3(0.4, 0.2, 0);
    }

    clearLevelMeshes() {
        if (this.mazeContainer) {
            this.mazeContainer.dispose(true, true);
        }
        if (this.floor) {
            this.floor.dispose();
        }

        this.levelMeshes.forEach(mesh => {
            mesh.dispose();
        });
        this.levelMeshes = [];
        this.ball = null;
        this.mazeContainer = null;
        this.floor = null;
    }

    attachCameraControl(canvas) {
        // code to attach camera control
    }

    createMazeFromData(gridData, width, height) {
        this.clearLevelMeshes();

        // Calculate cell size, wall height, and wall thickness
        const CELL_SIZE = 2;
        const WALL_HEIGHT = 1.5;
        const WALL_THICKNESS = 0.2;
        const MAZE_WIDTH_WORLD = width * CELL_SIZE;
        const MAZE_HEIGHT_WORLD = height * CELL_SIZE;

        // Calculate offsets to center the maze at (0, 0, 0)
        const offsetX = -MAZE_WIDTH_WORLD / 2 + CELL_SIZE / 2;
        const offsetZ = -MAZE_HEIGHT_WORLD / 2 + CELL_SIZE / 2;

        // Create Floor
        this.floor = BABYLON.MeshBuilder.CreateBox("floor", {
            width: MAZE_WIDTH_WORLD,
            height: 0.1,
            depth: MAZE_HEIGHT_WORLD
        }, this.scene);
        this.floor.position.y = -0.05; // Slightly below walls
        this.floor.physicsImpostor = new BABYLON.PhysicsImpostor(this.floor, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.2 }, this.scene);
        this.levelMeshes.push(this.floor);

        // Create the maze container
        this.mazeContainer = new BABYLON.TransformNode("mazeContainer", this.scene);

        // Create Walls based on gridData
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cell = gridData[y][x];

                if (cell.walls[0]) { // Top
                    const wall = BABYLON.MeshBuilder.CreateBox("wall", { width: CELL_SIZE, height: WALL_HEIGHT, depth: WALL_THICKNESS }, this.scene);
                    wall.position = new BABYLON.Vector3(offsetX + x * CELL_SIZE, WALL_HEIGHT / 2, offsetZ + y * CELL_SIZE - CELL_SIZE / 2);
                    wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, this.scene);
                    wall.parent = this.mazeContainer;
                    this.levelMeshes.push(wall);
                }

                if (cell.walls[1]) { // Right
                    const wall = BABYLON.MeshBuilder.CreateBox("wall", { width: WALL_THICKNESS, height: WALL_HEIGHT, depth: CELL_SIZE }, this.scene);
                    wall.position = new BABYLON.Vector3(offsetX + x * CELL_SIZE + CELL_SIZE / 2, WALL_HEIGHT / 2, offsetZ + y * CELL_SIZE);
                    wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, this.scene);
                    wall.parent = this.mazeContainer;
                    this.levelMeshes.push(wall);
                }

                if (cell.walls[2]) { // Bottom
                    const wall = BABYLON.MeshBuilder.CreateBox("wall", { width: CELL_SIZE, height: WALL_HEIGHT, depth: WALL_THICKNESS }, this.scene);
                    wall.position = new BABYLON.Vector3(offsetX + x * CELL_SIZE, WALL_HEIGHT / 2, offsetZ + y * CELL_SIZE + CELL_SIZE / 2);
                    wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, this.scene);
                    wall.parent = this.mazeContainer;
                    this.levelMeshes.push(wall);
                }

                if (cell.walls[3]) { // Left
                    const wall = BABYLON.MeshBuilder.CreateBox("wall", { width: WALL_THICKNESS, height: WALL_HEIGHT, depth: CELL_SIZE }, this.scene);
                    wall.position = new BABYLON.Vector3(offsetX + x * CELL_SIZE - CELL_SIZE / 2, WALL_HEIGHT / 2, offsetZ + y * CELL_SIZE);
                    wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, this.scene);
                    wall.parent = this.mazeContainer;
                    this.levelMeshes.push(wall);
                }
            }
        }
         // Set the maze container's position to be at the center of the floor
         this.mazeContainer.position = new BABYLON.Vector3(0, 0, 0);
    }

    tiltMaze(x, z) {
        if (this.mazeContainer) {
            this.mazeContainer.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Right(), x).multiply(BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Forward(), z));
        }
    }
}

class PhysicsManager {
    constructor() {
    }

    enablePhysics(scene, gravity) {
        scene.enablePhysics(gravity, new BABYLON.CannonJSPlugin());
    }
}

class InputManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.tilt = { x: 0, z: 0 };
        this.sensitivity = 0.02;
        this.maxTilt = Math.PI / 6;

        this.initTouch();
        this.initMouse();
    }

    initTouch() {
        let startX, startY;

        this.canvas.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, false);

        this.canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            const x = e.touches[0].clientX;
            const y = e.touches[0].clientY;

            let deltaX = (x - startX) * this.sensitivity;
            let deltaY = (y - startY) * this.sensitivity;

            this.tilt.x = Math.max(-this.maxTilt, Math.min(this.maxTilt, this.tilt.x + deltaY));
            this.tilt.z = Math.max(-this.maxTilt, Math.min(this.maxTilt, this.tilt.z + deltaX));

            startX = x;
            startY = y;
        }, false);

        this.canvas.addEventListener("touchend", () => {
            //this.resetTilt();
        }, false);
    }

    initMouse() {
        let startX, startY, isDragging = false;

        this.canvas.addEventListener("mousedown", (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
        }, false);

        this.canvas.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const x = e.clientX;
            const y = e.clientY;

            let deltaX = (x - startX) * this.sensitivity;
            let deltaY = (y - startY) * this.sensitivity;

            this.tilt.x = Math.max(-this.maxTilt, Math.min(this.maxTilt, this.tilt.x + deltaY));
            this.tilt.z = Math.max(-this.maxTilt, Math.min(this.maxTilt, this.tilt.z + deltaX));

            startX = x;
            startY = y;
        }, false);

        this.canvas.addEventListener("mouseup", () => {
            isDragging = false;
            //this.resetTilt();
        }, false);

        this.canvas.addEventListener("mouseleave", () => {
            isDragging = false;
            //this.resetTilt();
        }, false);
    }

    getTargetTilt() {
        return this.tilt;
    }

    resetTilt() {
        this.tilt.x = 0;
        this.tilt.z = 0;
    }
}

class LevelManager {
    constructor(settings) {
        this.settings = settings;
    }

    getLevelSettings(index) {
        return this.settings[index];
    }

    getTotalLevels() {
        return this.settings.length;
    }

    checkGoal(ball) {
        // code to check goal
    }
}

class UIManager {
    constructor() {
    }

    updateLevel(level, totalLevels) {
        // code to update level
    }

    updateTimers(levelTime, totalTime) {
        // code to update timers
    }
}

class Timer {
    constructor() {
    }

    reset() {
        // code to reset timer
    }
}

class MazeGenerator {
    constructor() {
        this.grid = [];
        this.cols = 0;
        this.rows = rows;
        this.stack = [];
    }

    // Helper to get index in 1D array representation if needed, or use 2D directly
    index(x, y) {
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) {
            return -1; // Out of bounds
        }
        return y * this.cols + x; // or simply access grid[y][x]
    }

    // Initialize the grid with cells, all walls intact
    setupGrid(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.grid = [];
        this.stack = [];
        for (let y = 0; y < rows; y++) {
            this.grid[y] = [];
            for (let x = 0; x < cols; x++) {
                this.grid[y][x] = new Cell(x, y);
            }
        }
    }

    // Check for valid and unvisited neighbors
    checkNeighbors(cell) {
        const x = cell.x;
        const y = cell.y;
        const neighbors = [];

        const top = (y > 0) ? this.grid[y - 1][x] : undefined;
        const right = (x < this.cols - 1) ? this.grid[y][x + 1] : undefined;
        const bottom = (y < this.rows - 1) ? this.grid[y + 1][x] : undefined;
        const left = (x > 0) ? this.grid[y][x - 1] : undefined;

        if (top && !top.visited) neighbors.push(top);
        if (right && !right.visited) neighbors.push(right);
        if (bottom && !bottom.visited) neighbors.push(bottom);
        if (left && !left.visited) neighbors.push(left);

        if (neighbors.length > 0) {
            // Choose one random neighbor
            const r = Math.floor(Math.random() * neighbors.length);
            return neighbors[r];
        } else {
            return undefined; // No unvisited neighbors
        }
    }

    // Remove the wall between two adjacent cells
    removeWall(current, next) {
        const dx = current.x - next.x; // -1 (next is right), 1 (next is left), 0
        const dy = current.y - next.y; // -1 (next is bottom), 1 (next is top), 0

        if (dx === 1) { // Next is to the left of current
            current.walls[3] = false; // Remove current's left wall
            next.walls[1] = false;    // Remove next's right wall
        } else if (dx === -1) { // Next is to the right of current
            current.walls[1] = false; // Remove current's right wall
            next.walls[3] = false;    // Remove next's left wall
        }

        if (dy === 1) { // Next is above current
            current.walls[0] = false; // Remove current's top wall
            next.walls[2] = false;    // Remove next's bottom wall
        } else if (dy === -1) { // Next is below current
            current.walls[2] = false; // Remove current's bottom wall
            next.walls[0] = false;    // Remove next's top wall
        }
    }

    // Main generation function using Recursive Backtracking
    generate(cols, rows) {
        this.setupGrid(cols, rows);

        // Start at a random cell (or fixed e.g., 0,0)
        let current = this.grid[0][0];
        current.visited = true;
        this.stack.push(current);
        let visitedCount = 1;
        const totalCells = cols * rows;

        while (visitedCount < totalCells) {
            let next = this.checkNeighbors(current);
            if (next) {
                next.visited = true;
                visitedCount++;

                // Remove the wall between current and next
                this.removeWall(current, next);

                // Push current to the stack
                this.stack.push(current);

                // Current becomes next
                current = next;
            } else if (this.stack.length > 0) {
                // No unvisited neighbors, backtrack
                current = this.stack.pop();
            } else {
                // Should not happen if algorithm is correct and starts connected
                console.warn("Maze generation ended unexpectedly.");
                break;
            }
        }
        console.log("Maze generation complete.");
        return this.grid; // Return the grid data with wall information
    }
}

class Cell {
    constructor(x, y) {
        this.x = x; // Grid column index
        this.y = y; // Grid row index
        this.walls = [true, true, true, true]; // [top, right, bottom, left] - true means wall exists
        this.visited = false; // For generation algorithm
    }
    // Helper methods like index, checkNeighbors can be added [3]
}

// --- Main Execution ---
window.addEventListener("DOMContentLoaded", () => {
    window.game = new Game("renderCanvas");
    window.game.init().catch(error => {
        console.error("Game initialization failed:", error);
        alert("Failed to initialize the game. Check console for details.");
    });
});
