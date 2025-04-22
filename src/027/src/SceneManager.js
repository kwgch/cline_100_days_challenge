export class SceneManager {
    constructor(scene) {
        this.scene = scene;
        this.camera = null;
        this.lights = [];
        this.ball = null;
        this.mazeContainer = null;
        this.levelMeshes = [];
        this.floor = null;
        this.goal = null;
    }

    createCamera() {
        this.camera = new BABYLON.ArcRotateCamera("camera", 
            -Math.PI / 2, 
            Math.PI / 2.5, 
            10, 
            new BABYLON.Vector3(0, 0, 0), 
            this.scene);

        this.camera.attachControl(this.scene.getEngine().getRenderingCanvas(), true);
    }

    createLights() {
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        this.lights.push(light);
    }

    createBall(startPosition) {
        this.ball = BABYLON.MeshBuilder.CreateSphere("ball", { diameter: 0.5, segments: 32 }, this.scene);
        this.ball.position = new BABYLON.Vector3(startPosition.x, startPosition.y, startPosition.z);
        this.ball.physicsImpostor = new BABYLON.PhysicsImpostor(this.ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.2, friction: 0.2 }, this.scene);
        this.ball.material = new BABYLON.StandardMaterial("ballMat", this.scene);
        this.ball.diffuseColor = new BABYLON.Color3(0.4, 0.2, 0);
    }

    createGoal(goalPosition) {
        this.goal = BABYLON.MeshBuilder.CreateCylinder("goal", { height: 0.5, diameter: 1, tessellation: 24 }, this.scene);
        this.goal.position = new BABYLON.Vector3(goalPosition.x, goalPosition.y, goalPosition.z);
        this.goal.isPickable = false;
        this.goal.material = new BABYLON.StandardMaterial("goalMat", this.scene);
        this.goal.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
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
        if (this.goal) {
            this.goal.dispose();
            this.goal = null;
        }
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
        const floorMaterial = new BABYLON.StandardMaterial("floorMat", this.scene);
        floorMaterial.alpha = 0.5;
        floorMaterial.backFaceCulling = false;
        this.floor.material = floorMaterial;
        this.floor.physicsImpostor = new BABYLON.PhysicsImpostor(this.floor, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.2 }, this.scene);
        this.levelMeshes.push(this.floor);

        // Create the maze container
        this.mazeContainer = new BABYLON.TransformNode("mazeContainer", this.scene);

        // Create Walls based on gridData
        let physicsImpostor;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cell = gridData[y][x];

                if (cell.walls[0]) { // Top
                    const wall = BABYLON.MeshBuilder.CreateBox("wall", { width: CELL_SIZE, height: WALL_HEIGHT, depth: WALL_THICKNESS }, this.scene);
                    wall.position = new BABYLON.Vector3(offsetX + x * CELL_SIZE, WALL_HEIGHT / 2, offsetZ + y * CELL_SIZE - CELL_SIZE / 2);
                    physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, this.scene);
                    wall.physicsImpostor = physicsImpostor;
                    this.levelMeshes.push(wall);
                }

                if (cell.walls[1]) { // Right
                    const wall = BABYLON.MeshBuilder.CreateBox("wall", { width: WALL_THICKNESS, height: WALL_HEIGHT, depth: CELL_SIZE }, this.scene);
                    wall.position = new BABYLON.Vector3(offsetX + x * CELL_SIZE + CELL_SIZE / 2, WALL_HEIGHT / 2, offsetZ + y * CELL_SIZE);
                    physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, this.scene);
                    wall.physicsImpostor = physicsImpostor;
                    this.levelMeshes.push(wall);
                }

                if (cell.walls[2]) { // Bottom
                    const wall = BABYLON.MeshBuilder.CreateBox("wall", { width: CELL_SIZE, height: WALL_HEIGHT, depth: WALL_THICKNESS }, this.scene);
                    wall.position = new BABYLON.Vector3(offsetX + x * CELL_SIZE, WALL_HEIGHT / 2, offsetZ + y * CELL_SIZE + CELL_SIZE / 2);
                    physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, this.scene);
                    wall.physicsImpostor = physicsImpostor;
                    this.levelMeshes.push(wall);
                }

                if (cell.walls[3]) { // Left
                    const wall = BABYLON.MeshBuilder.CreateBox("wall", { width: WALL_THICKNESS, height: WALL_HEIGHT, depth: CELL_SIZE }, this.scene);
                    wall.position = new BABYLON.Vector3(offsetX + x * CELL_SIZE - CELL_SIZE / 2, WALL_HEIGHT / 2, offsetZ + y * CELL_SIZE);
                    physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, this.scene);
                    wall.physicsImpostor = physicsImpostor;
                    this.levelMeshes.push(wall);
                }
            }
        }
        // Set the maze container's position to be at the center of the floor
        this.mazeContainer.position = new BABYLON.Vector3(0, 0, 0);
    }

    // tiltMazeは不要になったので空実装にする
    tiltMaze(x, z) {
        // 何もしない
    }
}
