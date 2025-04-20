window.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);
    var scene;
    var player;
    var groundTiles = [];
    var groundSize = 20;
    var groundSpacing = groundSize; // No gap between tiles
    var lanePositions = [-3, 0, 3];
    var lane = 1;
    var isJumping = false;
    var gravity = -0.05; // Adjust gravity
    var jumpSpeed = 1.0; // Adjust jump speed
    var verticalSpeed = 0;
    var obstaclePool = [];
    var gameOver = false;
    var score = 0;
    var scoreText;
    var renderLoop = null;
    var initialTouchX;
    var isMouseDown = false; // Track mouse button state
    var mouseStartX   = null;
    var numGroundTiles = 5; // Increase number of ground tiles
    var obstaclePlacementInterval = 50; // Place obstacles every 50 frames
    var frameCount = 0;
    var numObstacles = 30;

    var placeObstacle = function() {
        var obstacle = obstaclePool.find(o => !o.isVisible);
        if (!obstacle) { return; }
    
        // 1) 最も奥にある groundTile を探す
        var farthestZ = groundTiles.reduce(function(prev, curr) {
            return (curr.position.z > prev.position.z) ? curr : prev;
        }).position.z;
    
        // 2) spawnOffset を決める（画面外〜徐々に見え始める距離）
        var spawnOffset = groundSpacing * 1.5; // 1.5 タイル分くらい奥に置く例
    
        // 3) 位置をセット
        obstacle.position.x = lanePositions[Math.floor(Math.random() * lanePositions.length)];
        obstacle.position.y = 1;
        obstacle.position.z = farthestZ + spawnOffset;
    
        obstacle.isVisible = true;
        obstacle.getChildMeshes().forEach(cm => cm.isVisible = true);   // 子メッシュも表示
    };
    
    var createScene = function() {
        scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.9, 0.9, 0.9); // Light gray background

        var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);

        // ← ここから追加
        // FOVを「横基準」にして、横方向の視界を常に一定にする
        camera.fovMode = BABYLON.Camera.FOVMODE_HORIZONTAL;
        // 必要であれば、横FOVの角度を調整
        camera.fov = 1.0;  // デフォルト0.8くらい。大きくするとさらに広く見える
        // ↑ ここまで

        camera.setTarget(BABYLON.Vector3.Zero());

        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        // Ground
        

        for (var i = 0; i < numGroundTiles; i++) {
            var ground = BABYLON.Mesh.CreateGround('ground' + i, groundSize, groundSize, 2, scene);
            ground.position.z = i * groundSpacing - (numGroundTiles * groundSpacing / 2); // Center the ground tiles
            groundTiles.push(ground);

            // Change ground color
            var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
            groundMaterial.diffuseColor = new BABYLON.Color3(0.7, 0.9, 0.7); // Light green
            ground.material = groundMaterial;
        }

        // Player

        // --- Player（自機）生成
        player = BABYLON.Mesh.CreateSphere("player", 16, 1, scene);

        // 移動範囲の中央ではなく、もっと手前（カメラ寄り）に配置
        player.position = new BABYLON.Vector3(0, 1, -5);

        // マテリアルを明るい単色に変更（DynamicTextureは不要ならコメントアウト）
        var playerMaterial = new BABYLON.StandardMaterial("playerMaterial", scene);
        //playerMaterial.diffuseTexture = playerTexture; // ←不要ならこちらをコメントアウト
        playerMaterial.diffuseColor   = new BABYLON.Color3(0.2, 0.6, 1);   // 水色
        playerMaterial.specularColor  = new BABYLON.Color3(1, 1, 1);      // 反射を少し強め
        player.material = playerMaterial;

        // Obstacles

        // --- Obstacles（敵機）生成ループ
        for (var i = 0; i < numObstacles; i++) {
            var obstacle = BABYLON.Mesh.CreateBox("obstacle" + i, 1, scene);
            obstacle.isVisible = false;
            obstaclePool.push(obstacle);

            // --- 明るいランダムカラーを割り当て
            var obstacleMaterial = new BABYLON.StandardMaterial("obstacleMat" + i, scene);
            obstacleMaterial.diffuseColor = new BABYLON.Color3(
                Math.random() * 0.8 + 0.2,
                Math.random() * 0.8 + 0.2,
                Math.random() * 0.8 + 0.2
            );
            obstacle.material = obstacleMaterial;

            // --- 同じループ内で、色付けのあとに追加
            // 白目マテリアル
            var eyeWhiteMat = new BABYLON.StandardMaterial("eyeWhiteMat", scene);
            eyeWhiteMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
            // 黒目マテリアル
            var pupilMat = new BABYLON.StandardMaterial("pupilMat", scene);
            pupilMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
            pupilMat.diffuseColor = new BABYLON.Color3(1, 1, 1);

            // 左目
            var eyeL = BABYLON.MeshBuilder.CreateSphere("eyeL" + i, { diameter: 0.2 }, scene);
            eyeL.material = eyeWhiteMat;
            eyeL.parent = obstacle;
            eyeL.position = new BABYLON.Vector3(-0.25, 0.3, -0.5);

            // 左瞳
            var pupilL = BABYLON.MeshBuilder.CreateSphere("pupilL" + i, { diameter: 0.1 }, scene);
            pupilL.material = pupilMat;
            pupilL.parent = eyeL;
            pupilL.position = new BABYLON.Vector3(0, 0, 0.1);

            // 右目
            var eyeR = eyeL.clone("eyeR" + i);
            eyeR.parent = obstacle;
            eyeR.position.x = 0.25;

            // 右瞳
            var pupilR = pupilL.clone("pupilR" + i);
            pupilR.parent = eyeR;

            eyeL.isVisible   = false;
            pupilL.isVisible = false;
            eyeR.isVisible   = false;
            pupilR.isVisible = false;
        }


         // Score
         
         scoreText = document.createElement('div');
         scoreText.id = 'scoreText';
         scoreText.style.position = 'absolute';
         scoreText.style.top = '20px';
         scoreText.style.left = '20px';
         scoreText.style.fontSize = '24px';
         scoreText.style.color = 'black';
         scoreText.textContent = 'Score: 0';
         document.body.appendChild(scoreText);

        // Initial obstacle placement
        
        return scene;
    };

    createScene();
    
    // Initial obstacle placement
    for (var i = 0; i < 3; i++) {
        placeObstacle();
    }

    // Game Over Screen
    var gameOverScreen = document.createElement('div');
    gameOverScreen.id = 'gameOverScreen';
    gameOverScreen.style.position = 'absolute';
    gameOverScreen.style.top = '0';
    gameOverScreen.style.left = '0';
    gameOverScreen.style.width = '100%';
    gameOverScreen.style.height = '100%';
    gameOverScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    gameOverScreen.style.display = 'none';
    gameOverScreen.style.justifyContent = 'center';
    gameOverScreen.style.alignItems = 'center';
    gameOverScreen.style.zIndex = '10';
    document.body.appendChild(gameOverScreen);

    var gameOverText = document.createElement('h1');
    gameOverText.textContent = 'Game Over';
    gameOverText.style.color = 'white';
    gameOverScreen.appendChild(gameOverText);

    var restartButton = document.createElement('button');
    restartButton.textContent = 'Restart';
    restartButton.style.padding = '20px 40px';
    restartButton.style.backgroundColor = '#4CAF50';
    restartButton.style.color = 'white';
    restartButton.style.fontSize = '24px';
    restartButton.style.cursor = 'pointer';
    gameOverScreen.appendChild(restartButton);

    restartButton.addEventListener('click', function() {
        gameOverScreen.style.display = 'none';
        gameOver = false;
        score = 0;
        scoreText.textContent = 'Score: 0';
        // Reset obstacle positions
        for (var i = 0; i < obstaclePool.length; i++) {
            obstaclePool[i].isVisible = false;
            obstaclePool[i].getChildMeshes().forEach(cm => cm.isVisible = false);
        }
        // Initial obstacle placement
        // for (var i = 0; i < 3; i++) {
        for (var i = 0; i < obstaclePool.length-2; i++) {
            placeObstacle();
        }
        player.position.x = 0;
        player.position.y = 1;
        lane = 1;
        engine.runRenderLoop(renderLoop);
    });

    renderLoop = function() {
        if (!gameOver) {
            // Move ground tiles
            for (var i = 0; i < groundTiles.length; i++) {
                groundTiles[i].position.z -= 0.1;
                if (groundTiles[i].position.z < -(numGroundTiles * groundSpacing / 2)) {
                    groundTiles[i].position.z += numGroundTiles * groundSpacing;
                }
            }

            // Player Movement
            player.position.x = BABYLON.Scalar.Lerp(player.position.x, lanePositions[lane], 0.1);

            if (isJumping) {
                player.position.y += verticalSpeed;
                verticalSpeed += gravity;
                if (player.position.y <= 1) {
                    player.position.y = 1;
                    isJumping = false;
                    verticalSpeed = 0;
                }
            }

            // Move obstacles
            for (var i = 0; i < obstaclePool.length; i++) {
                if (obstaclePool[i].isVisible) {
                    // obstaclePool[i].position.z -= 0.1;
                    obstaclePool[i].position.z -= 0.2;
                    if (obstaclePool[i].position.z < -10) {
                        obstaclePool[i].isVisible = false;
                    }

                    // Collision Detection
                    if (Math.abs(player.position.x - obstaclePool[i].position.x) < 1 &&
                        Math.abs(player.position.z - obstaclePool[i].position.z) < 1 &&
                        player.position.y < 2) {
                        gameOver = true;
                        gameOverScreen.style.display = 'flex';
                    }
                }
            }

            // Place new obstacles
            frameCount++;
            if (frameCount % obstaclePlacementInterval === 0) {
                placeObstacle();
            }

            // Update Score
            score += 1;
            scoreText.textContent = 'Score: ' + score;
        }

        scene.render();
    };

    window.addEventListener('resize', function() {
        engine.resize();
    });

    // Input
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            lane = Math.max(0, lane - 1);
        } else if (event.key === 'ArrowRight') {
            lane = Math.min(2, lane + 1);
        } else if (event.key === 'ArrowUp' && !isJumping) {
            isJumping = true;
            verticalSpeed = jumpSpeed;
        }
    });

    // Touch Input
    canvas.addEventListener('touchstart', function(event) {
        initialTouchX = event.touches[0].clientX;
    });

    canvas.addEventListener('touchmove', function(event) {
        if (!initialTouchX) return; // Prevent errors if touch starts off canvas

        var touchX = event.touches[0].clientX;
        var deltaX = touchX - initialTouchX;

        if (deltaX > 50) {
            lane = Math.min(2, lane + 1);
            initialTouchX = touchX;
        } else if (deltaX < -50) {
            lane = Math.max(0, lane - 1);
            initialTouchX = touchX;
        }
    });

    canvas.addEventListener('touchend', function() {
        initialTouchX = null;
    });

    canvas.addEventListener('mouseleave', function() {
        isMouseDown = false;
        initialTouchX = null;
    });

    // createScene() の最後、またはグローバルな入力設定箇所に追加
    canvas.addEventListener('pointerdown', function() {
        if (!isJumping) {
            isJumping = true;
            verticalSpeed = jumpSpeed;
        }
    });


    // 既存の mousedown/mousemove/mouseup は不要になるので、まとめて削除 or コメントアウト
    // --- 代わりにこれを追加 ---

    canvas.addEventListener('pointermove', function(event) {
        // canvas の左端からの相対 X を計算
        var rect   = canvas.getBoundingClientRect();
        var mouseX = event.clientX - rect.left;
        var w      = rect.width;
        var third  = w / 3;

        // 画面幅を 3 分割してレーン番号を直接セット
        if (mouseX < third) {
            lane = 0;
        } else if (mouseX < third * 2) {
            lane = 1;
        } else {
            lane = 2;
        }
    });

    // Start Screen
    var startScreen = document.getElementById('startScreen');
    var startButton = document.getElementById('startButton');

    startButton.addEventListener('click', function() {
        startScreen.style.display = 'none';
        engine.runRenderLoop(renderLoop);
    });
});
