// Get the canvas element from our HTML above
const canvas = document.getElementById("renderCanvas");

// Load the BABYLON 3D engine
const engine = new BABYLON.Engine(canvas, true);

// Create scene function
const createScene = () => {

    // Create a scene object
    const scene = new BABYLON.Scene(engine);

    // Camera adjustments
    const frameHeight = 7;
    const frameDepth = 0.3;
    const camera = new BABYLON.ArcRotateCamera("myCamera", Math.PI / 3, Math.PI / 6, 10, new BABYLON.Vector3(0, (frameHeight - 2) / 2, 0), scene);
    camera.alpha = -Math.PI / 2; // Rotate camera to look from the side
    camera.beta = Math.PI / 2.5; // Angle from the bottom
    camera.radius = 15; // Distance from the target
    camera.fov = 0.8; // Adjust field of view
    //camera.attachControl(canvas, true);
    camera.inputs.remove(camera.inputs.attached.mousewheel); // Disable zoom

    // Create a basic light, aiming 0,1,0 - meaning, to the sky
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Ground adjustments
    //const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 8, height: 8, subdivisions: 2}, scene);
    //ground.isVisible = false;

    //Create lines for the frame
    const lines = BABYLON.MeshBuilder.CreateLineSystem("lines", {
        lines: [
            [new BABYLON.Vector3(-4, 0, -frameDepth), new BABYLON.Vector3(4, 0, -frameDepth)], // Front
            [new BABYLON.Vector3(4, 0, -frameDepth), new BABYLON.Vector3(4, 0, frameDepth)],   // Right
            [new BABYLON.Vector3(4, 0, frameDepth), new BABYLON.Vector3(-4, 0, frameDepth)],   // Back
            [new BABYLON.Vector3(-4, 0, frameDepth), new BABYLON.Vector3(-4, 0, -frameDepth)],  // Left
            [new BABYLON.Vector3(-4, 0, -frameDepth), new BABYLON.Vector3(-4, frameHeight, -frameDepth)],  // Left Up
            [new BABYLON.Vector3(4, 0, -frameDepth), new BABYLON.Vector3(4, frameHeight, -frameDepth)],  // Right Up
            [new BABYLON.Vector3(4, 0, frameDepth), new BABYLON.Vector3(4, frameHeight, frameDepth)],  // Right Up
            [new BABYLON.Vector3(-4, 0, frameDepth), new BABYLON.Vector3(-4, frameHeight, frameDepth)],  // Left Up
            [new BABYLON.Vector3(-4, frameHeight, -frameDepth), new BABYLON.Vector3(4, frameHeight, -frameDepth)], // Front
            [new BABYLON.Vector3(4, frameHeight, -frameDepth), new BABYLON.Vector3(4, frameHeight, frameDepth)],   // Right
            [new BABYLON.Vector3(4, frameHeight, frameDepth), new BABYLON.Vector3(-4, frameHeight, frameDepth)],   // Back
            [new BABYLON.Vector3(-4, frameHeight, frameDepth), new BABYLON.Vector3(-4, frameHeight, -frameDepth)],  // Left
        ]
    }, scene);

    // Create a paddle
    const paddle = BABYLON.MeshBuilder.CreateBox("paddle", {width: 1, height: 0.2, depth: 1.2}, scene);
    paddle.position.y = 0.5;
    paddle.position.z = -0.8;

    // Create a sphere
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.5, segments: 32}, scene);
    sphere.position.y = 0.7; // Adjust initial position
    sphere.position.z = -0.5;
    sphere.position.x = paddle.position.x;

    // Ball velocity
    let ballVelocity = new BABYLON.Vector3(0.05, 0.3, 0.05);
    let gameStarted = false;
    const minVelocityY = 0.2;

    // Touch/Mouse input
    let pointerX = 0;

    // Mouse input
    canvas.addEventListener("mousemove", (e) => {
        pointerX = (e.clientX - canvas.offsetLeft) / canvas.width * 8 - 4; // Scale mouse position to world units
    });

    // Touch input
    canvas.addEventListener("touchstart", (e) => {
        pointerX = (e.touches[0].clientX - canvas.offsetLeft) / canvas.width * 8 - 4;
    }, false);
    canvas.addEventListener("touchmove", (e) => {
        pointerX = (e.touches[0].clientX - canvas.offsetLeft) / canvas.width * 8 - 4;
        e.preventDefault();
    }, false);

    canvas.addEventListener("click", () => {
        if (!gameStarted) {
            gameStarted = true;
            // ballVelocity = new BABYLON.Vector3(0.05, 0.7, 0.05);
            ballVelocity = new BABYLON.Vector3(0.01, 0.1, 0.01);
        }
    });

    canvas.addEventListener("touchstart", () => {
        if (!gameStarted) {
            gameStarted = true;
            // ballVelocity = new BABYLON.Vector3(0.05, 0.7, 0.05);
            ballVelocity = new BABYLON.Vector3(0.01, 0.1, 0.01);
        }
    });

    // GUI
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    let score = 0;

    const scoreText = new BABYLON.GUI.TextBlock();
    scoreText.text = "Score: " + score;
    scoreText.color = "white";
    scoreText.fontSize = 24;
    scoreText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    scoreText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    scoreText.paddingLeft = "10px";
    scoreText.paddingTop = "400px";
    advancedTexture.addControl(scoreText);

    const gameOverText = new BABYLON.GUI.TextBlock();
    gameOverText.text = "Game Over!";
    gameOverText.color = "red";
    gameOverText.fontSize = 48;
    gameOverText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    gameOverText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    gameOverText.isVisible = false;
    advancedTexture.addControl(gameOverText);

    const debugText = new BABYLON.GUI.TextBlock();
    debugText.text = "Debug: ";
    debugText.color = "yellow";
    debugText.fontSize = 24;
    debugText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    debugText.verticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    debugText.paddingTop = "-400px";
    advancedTexture.addControl(debugText);

    // Update paddle position
    scene.registerBeforeRender(() => {
        
        let debugStr = ""
        debugStr += "x: " + Math.floor(sphere.position.x*100) / 100;
        debugStr += " y: " + Math.floor(sphere.position.y*100) / 100;
        debugStr += " z: " + Math.floor(sphere.position.z*100) / 100;
        debugText.text = "" + debugStr;

        // Update paddle position
        paddle.position.x = pointerX;

        // Keep paddle within bounds
        paddle.position.x = Math.max(Math.min(paddle.position.x, 3.5), -3.5);

        // Update ball position
        if (gameStarted) {
            sphere.position.addInPlace(ballVelocity);
        } else {
            sphere.position.x = paddle.position.x;
        }

        // Ball collision with walls
        if (sphere.position.x > 4 || sphere.position.x < -4) {
            ballVelocity.x *= -1;
        }
        if (sphere.position.z > frameDepth || sphere.position.z < -frameDepth) {
            ballVelocity.z *= -1;
        }
        if (sphere.position.y < 0) {
            // ballVelocity.y = Math.abs(ballVelocity.y) + minVelocityY;
        }
        if (sphere.position.y > frameHeight) {
            ballVelocity.y *= -1;
        }

        // Ball collision with paddle
        if (sphere.intersectsMesh(paddle, false)) {
            if (ballVelocity.y < 0) {
                ballVelocity.y *= -1;
            }
        }

        //Game Over
        const gameOverY = -2;
        // const gameOverY = -0.7;
        if (sphere.position.y < gameOverY) {
            console.log("Game Over!");
            gameOverText.isVisible = true;
            engine.stopRenderLoop();
        }
    });

    // Create bricks
    const bricks = [];
    const brickRows = 7;
    const brickCols = 5;

    for (let row = 0; row < brickRows; row++) {
        bricks[row] = [];
        for (let col = 0; col < brickCols; col++) {
            const brick = BABYLON.MeshBuilder.CreateBox("brick", {width: 0.8, height: 0.3, depth: 1.2}, scene);
            brick.position.x = -3 + col * 1.2;
            brick.position.y = (frameHeight - 1) - row * 0.4;
            brick.position.z = 0;
            bricks[row][col] = brick;
        }
    }

    // Ball collision with bricks
    let collisionEnabled = false;
    setTimeout(() => {
        collisionEnabled = true;
    }, 1000); // Delay collision detection for 1 second

    scene.registerBeforeRender(() => {
        if (collisionEnabled) {
            for (let row = 0; row < brickRows; row++) {
                for (let col = 0; col < brickCols; col++) {
                    const brick = bricks[row][col];
                    if (brick && sphere.intersectsMesh(brick, false)) {
                        brick.dispose();
                        bricks[row][col] = null;
                        ballVelocity.y *= -1;
                        score += 10;
                        scoreText.text = "Score: " + score;
                    }
                }
            }
        }
    });

    return scene;
};

// call the createScene function
const scene = createScene();

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});
