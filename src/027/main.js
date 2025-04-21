class InputManager {
    constructor(canvas) { // Pass canvas for attaching listeners
        this.canvas = canvas;
        this.keys = { left: false, right: false, up: false, down: false };
        this.targetTilt = { x: 0, z: 0 }; // Target tilt based on input (-1 to 1)

        // Pointer state for drag control
        this.isPointerDown = false;
        this.pointerStart = { x: 0, y: 0 };
        this.pointerCurrent = { x: 0, y: 0 };
        this.dragDelta = { x: 0, y: 0 }; // Difference from start position

        // Sensitivity for drag control (pixels dragged for max tilt)
        this.dragSensitivity = 100; // Adjust as needed

        this._setupEventListeners();
    }

    _setupEventListeners() {
        // Keyboard Input (PC)
        window.addEventListener("keydown", (e) => this._handleKeyDown(e.key));
        window.addEventListener("keyup", (e) => this._handleKeyUp(e.key));

        // Pointer Events (Touch & Mouse on the canvas)
        this.canvas.addEventListener("pointerdown", (e) => this._handlePointerDown(e));
        // Add listeners to window to catch moves/ups even if pointer leaves canvas
        window.addEventListener("pointermove", (e) => this._handlePointerMove(e));
        window.addEventListener("pointerup", (e) => this._handlePointerUp(e));
        window.addEventListener("pointercancel", (e) => this._handlePointerUp(e)); // Treat cancel as up

        // Prevent context menu on right-click if needed
        // this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    _handleKeyDown(key) {
        switch (key) {
            case "ArrowUp": case "w": this.keys.up = true; break;
            case "ArrowDown": case "s": this.keys.down = true; break;
            case "ArrowLeft": case "a": this.keys.left = true; break;
            case "ArrowRight": case "d": this.keys.right = true; break;
        }
        this._updateTargetTiltFromKeys();
    }

    _handleKeyUp(key) {
        switch (key) {
            case "ArrowUp": case "w": this.keys.up = false; break;
            case "ArrowDown": case "s": this.keys.down = false; break;
            case "ArrowLeft": case "a": this.keys.left = false; break;
            case "ArrowRight": case "d": this.keys.right = false; break;
        }
        // Only update from keys if no pointer interaction is happening
        if (!this.isPointerDown) {
            this._updateTargetTiltFromKeys();
        }
    }

    _updateTargetTiltFromKeys() {
        // Key input determines target tilt directly (overwrites previous key state)
        let newTiltX = 0;
        let newTiltZ = 0;
        if (this.keys.up) newTiltX = 1;
        else if (this.keys.down) newTiltX = -1;

        if (this.keys.left) newTiltZ = 1; // Tilt left = positive Z rotation
        else if (this.keys.right) newTiltZ = -1; // Tilt right = negative Z rotation

        this.targetTilt.x = newTiltX;
        this.targetTilt.z = newTiltZ;
    }

    _handlePointerDown(event) {
        // Ignore if not primary button (for mouse)
        if (event.pointerType === "mouse" && event.button !== 0) return;

        this.isPointerDown = true;
        // Capture pointer to ensure move/up events are received even if outside canvas
        this.canvas.setPointerCapture(event.pointerId);

        this.pointerStart.x = event.clientX;
        this.pointerStart.y = event.clientY;
        this.pointerCurrent.x = event.clientX;
        this.pointerCurrent.y = event.clientY;
        this.dragDelta = { x: 0, y: 0 };
        // Reset key tilt when pointer interaction starts
        this.targetTilt.x = 0;
        this.targetTilt.z = 0;

        // Prevent default browser actions (like text selection) during drag
        event.preventDefault();
    }

    _handlePointerMove(event) {
        if (!this.isPointerDown || !this.canvas.hasPointerCapture(event.pointerId)) return;

        this.pointerCurrent.x = event.clientX;
        this.pointerCurrent.y = event.clientY;

        // Calculate delta from the start position
        this.dragDelta.x = this.pointerCurrent.x - this.pointerStart.x;
        this.dragDelta.y = this.pointerCurrent.y - this.pointerStart.y;

        // Convert drag delta to target tilt (-1 to 1)
        // Vertical drag (dy) controls front/back tilt (X-axis rotation)
        let tiltX = this.dragDelta.y / this.dragSensitivity;
        let tiltZ = this.dragDelta.x / this.dragSensitivity;

        // Clamp values to the range [-1, 1]
        this.targetTilt.x = BABYLON.Scalar.Clamp(tiltX, -1, 1);
        // Flip Z if needed (positive X drag = right = negative Z tilt)
        this.targetTilt.z = BABYLON.Scalar.Clamp(tiltZ * -1, -1, 1);

        event.preventDefault(); // Prevent default actions during move
    }

    _handlePointerUp(event) {
        if (!this.isPointerDown || !this.canvas.hasPointerCapture(event.pointerId)) return;

        this.isPointerDown = false;
        this.canvas.releasePointerCapture(event.pointerId);

        // Reset drag state
        this.dragDelta.x = 0;
        this.dragDelta.y = 0;

        // Gradually reset tilt to 0 when pointer is released (optional, feels nicer)
        // Or simply set targetTilt to 0 if immediate stop is desired
        // this.targetTilt.x = 0;
        // this.targetTilt.z = 0;

        // If keys are still held, revert to key controls
        this._updateTargetTiltFromKeys();

        event.preventDefault();
    }

    // Method called by Game loop to get the current desired tilt
    getTargetTilt() {
        // If pointer is not down, the tilt should smoothly return to zero
        // unless keys are overriding it. We handle the smooth return in SceneManager.tiltMaze
        if (!this.isPointerDown && !this.keys.up && !this.keys.down && !this.keys.left && !this.keys.right) {
            // Signal that the input wants tilt to return to zero
            return { x: 0, z: 0 };
        }
        // Otherwise, return the current target (from keys or pointer drag)
        return this.targetTilt;
    }
}

class SceneManager {
    constructor(scene, inputManager) {
        this.scene = scene;
        this.inputManager = inputManager;
        this.camera = null;
        this.light = null;
        this.mazeContainer = null;
        this.ball = null;
        // this.createScene(); // createScene is called from Game.init after physics are enabled
    }

    createScene() {
        this.createCamera();
        this.createLights();
        this.createMaze();
        this.createBall();
    }

    createCamera() {
        this.camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        this.camera.attachControl(this.scene.getEngine().getRenderingCanvas(), true);
    }

    createLights() {
        this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
    }

    createMaze() {
        // Remove the mazeContainer and create walls instead
        // this.mazeContainer = BABYLON.MeshBuilder.CreateBox("mazeContainer", { height: 1, width: 5, depth: 5 }, this.scene);
        // this.mazeContainer.rotation.x = Math.PI / 4;
        // this.mazeContainer.physicsImpostor = new BABYLON.PhysicsImpostor(this.mazeContainer, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.1 }, this.scene);

        const wallHeight = 2;
        const wallThickness = 0.2;
        const mazeWidth = 5;
        const mazeDepth = 5;

        // Create walls for the maze
        const wall1 = BABYLON.MeshBuilder.CreateBox("wall1", { height: wallHeight, width: wallThickness, depth: mazeDepth }, this.scene);
        wall1.position.x = -mazeWidth / 2 + wallThickness / 2;
        wall1.position.y = wallHeight / 2;
        this.wall1 = wall1; // Store wall1
        wall1.physicsImpostor = new BABYLON.PhysicsImpostor(wall1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.1 }, this.scene);
        const wall1Material = new BABYLON.StandardMaterial("wall1Material", this.scene);
        wall1Material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.9); // Light blue
        wall1.material = wall1Material;

        const wall2 = BABYLON.MeshBuilder.CreateBox("wall2", { height: wallHeight, width: wallThickness, depth: mazeDepth }, this.scene);
        wall2.position.x = mazeWidth / 2 + wallThickness / 2;
        wall2.position.y = wallHeight / 2;
        this.wall2 = wall2; // Store wall2
        wall2.physicsImpostor = new BABYLON.PhysicsImpostor(wall2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.1 }, this.scene);
        const wall2Material = new BABYLON.StandardMaterial("wall2Material", this.scene);
        wall2Material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.9); // Light blue
        wall2.material = wall2Material;

        const wall3 = BABYLON.MeshBuilder.CreateBox("wall3", { height: wallHeight, width: mazeWidth, depth: wallThickness }, this.scene);
        wall3.position.z = -mazeDepth / 2 + wallThickness / 2;
        wall3.position.y = wallHeight / 2;
        this.wall3 = wall3; // Store wall3
        wall3.physicsImpostor = new BABYLON.PhysicsImpostor(wall3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.1 }, this.scene);
        const wall3Material = new BABYLON.StandardMaterial("wall3Material", this.scene);
        wall3Material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.9); // Light blue
        wall3.material = wall3Material;

        const wall4 = BABYLON.MeshBuilder.CreateBox("wall4", { height: wallHeight, width: mazeWidth, depth: wallThickness }, this.scene);
        wall4.position.z = mazeDepth / 2 + wallThickness / 2;
        wall4.position.y = wallHeight / 2;
        this.wall4 = wall4; // Store wall4
        wall4.physicsImpostor = new BABYLON.PhysicsImpostor(wall4, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.1 }, this.scene);
        const wall4Material = new BABYLON.StandardMaterial("wall4Material", this.scene);
        wall4Material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.9); // Light blue
        wall4.material = wall4Material;

        // Create a ground
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: mazeWidth, height: mazeDepth }, this.scene);
        this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.1 }, this.scene);
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.8, 0.8); // Light pink
        this.ground.material = groundMaterial;

        // Create a parent container for the walls and ground
        this.mazeContainer = BABYLON.Mesh.CreateBox("mazeContainer", 1, this.scene);
        this.mazeContainer.isVisible = false; // Make the parent container invisible

        // wall1.parent = this.mazeContainer;
        // wall2.parent = this.mazeContainer;
        // wall3.parent = this.mazeContainer;
        // wall4.parent = this.mazeContainer;
        // this.ground.parent = this.mazeContainer;
    }

    createBall() {
        this.ball = BABYLON.MeshBuilder.CreateSphere("ball", { diameter: 0.5 }, this.scene);
        this.ball.position.y = 1;
        this.ball.physicsImpostor = new BABYLON.PhysicsImpostor(this.ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.8 }, this.scene);
        const ballMaterial = new BABYLON.StandardMaterial("ballMaterial", this.scene);
        ballMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.9, 0.5); // Darker green
        this.ball.material = ballMaterial;
    }

    attachCameraControl(canvas) {
        // this.camera.attachControl(canvas, true); // Standard camera control
    }

    tiltMaze(targetTiltX, targetTiltZ) {
        // Apply rotation directly to the walls and ground
        const MAX_TILT_ANGLE = Math.PI / 12; // 15 degrees
        const LERP_FACTOR = 0.1; // Smoothness factor

        const finalRotationX = targetTiltX * MAX_TILT_ANGLE;
        const finalRotationZ = targetTiltZ * MAX_TILT_ANGLE;

        console.log("finalRotationX: ", finalRotationX, "finalRotationZ: ", finalRotationZ);

        // Apply impulse to the ball based on the tilt
        const impulseDirection = new BABYLON.Vector3(targetTiltZ, 0, -targetTiltX);
        const impulseMagnitude = 1;
        this.ball.physicsImpostor.applyImpulse(impulseDirection.scale(impulseMagnitude), this.ball.getAbsolutePosition());

        this.ground.rotation.x = BABYLON.Scalar.Lerp(
            this.ground.rotation.x,
            finalRotationX,
            LERP_FACTOR
        );
        this.ground.rotation.z = BABYLON.Scalar.Lerp(
            this.ground.rotation.z,
            finalRotationZ,
            LERP_FACTOR
        );

        this.wall1.rotation.x = BABYLON.Scalar.Lerp(
            this.wall1.rotation.x,
            finalRotationX,
            LERP_FACTOR
        );
        this.wall1.rotation.z = BABYLON.Scalar.Lerp(
            this.wall1.rotation.z,
            finalRotationZ,
            LERP_FACTOR
        );

        this.wall2.rotation.x = BABYLON.Scalar.Lerp(
            this.wall2.rotation.x,
            finalRotationX,
            LERP_FACTOR
        );
        this.wall2.rotation.z = BABYLON.Scalar.Lerp(
            this.wall2.rotation.z,
            finalRotationZ,
            LERP_FACTOR
        );

        this.wall3.rotation.x = BABYLON.Scalar.Lerp(
            this.wall3.rotation.x,
            finalRotationX,
            LERP_FACTOR
        );
        this.wall3.rotation.z = BABYLON.Scalar.Lerp(
            this.wall3.rotation.z,
            finalRotationZ,
            LERP_FACTOR
        );

        this.wall4.rotation.x = BABYLON.Scalar.Lerp(
            this.wall4.rotation.x,
            finalRotationX,
            LERP_FACTOR
        );
        this.wall4.rotation.z = BABYLON.Scalar.Lerp(
            this.wall4.rotation.z,
            finalRotationZ,
            LERP_FACTOR
        );
    }
}

class LevelManager {
    constructor(levels) {
        this.levels = levels;
        this.currentLevelIndex = 0;
    }

    loadLevel(levelIndex) {
        // Load level data and create maze
    }

    getTotalLevels() {
        return this.levels.length;
    }

    checkGoal(ball) {
        // Check if the ball has reached the goal
        return false;
    }
}



class UIManager {
    updateLevel(currentLevel, totalLevels) {
        document.getElementById("current-level").innerText = currentLevel;
        document.getElementById("total-levels").innerText = totalLevels;
    }

    updateTimers(levelTime, totalTime) {
        document.getElementById("level-timer").innerText = levelTime.toFixed(1);
        document.getElementById("total-timer").innerText = totalTime.toFixed(1);
    }
}

class Timer {
    constructor() {
        this.levelTime = 0;
        this.totalTime = 0;
    }

    update(deltaTime) {
        this.levelTime += deltaTime;
        this.totalTime += deltaTime;
    }

    getLevelTime() {
        return this.levelTime;
    }

    getTotalTime() {
        return this.totalTime;
    }
}

class PhysicsManager {
    enablePhysics(scene, gravity) {
        scene.enablePhysics(gravity, new BABYLON.CannonJSPlugin());
    }
}

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = null;
        this.levelManager = new LevelManager(levels);
        this.sceneManager = null;
        // Pass inputManager to SceneManager
        this.inputManager = new InputManager(this.canvas);
        this.uiManager = new UIManager();
        this.timer = new Timer();
        this.physicsManager = new PhysicsManager();

        this.isGameOver = false;
        this.currentLevelIndex = 0;

        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }

    async init() {
        this.scene = new BABYLON.Scene(this.engine);
        // Pass inputManager to SceneManager if needed (e.g., for camera control logic)
        this.physicsManager.enablePhysics(this.scene, new BABYLON.Vector3(0, -9.81, 0));
        this.sceneManager = new SceneManager(this.scene, this.inputManager);
        this.sceneManager.createScene();

        this.sceneManager.createCamera();
        this.sceneManager.createLights();
        this.sceneManager.attachCameraControl(this.canvas); // Attach non-conflicting camera controls

        // No permission check needed, start level directly
        await this.startLevel(this.currentLevelIndex);
        this.startGameLoop(); // Start loop after level is ready
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
                    this.timer.update(deltaTime);

                    // Update UI
                    this.uiManager.updateLevel(this.currentLevelIndex + 1, this.levelManager.getTotalLevels());
                    this.uiManager.updateTimers(this.timer.getLevelTime(), this.timer.getTotalTime());

                    // Check Goal
                    if (this.levelManager.checkGoal(this.sceneManager.ball)) {
                        this.levelComplete();
                    }

                    this.scene.render();
                }
            });
            console.log("Render loop started.");
        }
    }

    // startLevel, levelComplete, gameOver methods remain largely the same
    async startLevel(levelIndex) {
        // Load level data and create maze
    }
    levelComplete() {
        // Handle level completion
    }
    gameOver(message) {
        // Handle game over
    }
}

// --- Main Execution ---
const levels = []; // Empty level array for now

window.addEventListener("DOMContentLoaded", () => {
    window.game = new Game("renderCanvas");
    window.game.init().catch(error => {
        console.error("Game initialization failed:", error);
        alert("Failed to initialize the game. Check console for details.");
    });
});
