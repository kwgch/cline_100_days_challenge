class ExtraordinaryBreakout {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameRunning = false;
        this.gamePaused = false;
        
        // モバイル判定
        this.isMobile = 'ontouchstart' in window && window.innerWidth <= 768;
        
        // モバイルの場合はキャンバスサイズを調整
        if (this.isMobile) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.specialEffect = 'なし';
        
        this.paddle = {
            x: this.canvas.width / 2 - 50,
            y: this.canvas.height - 30,
            width: 100,
            height: 10,
            speed: 8,
            color: '#ff6b6b'
        };
        
        this.balls = [];
        this.blocks = [];
        this.powerUps = [];
        this.particles = [];
        this.lasers = [];
        this.blockProjectiles = [];
        this.emojiRain = [];
        this.invaders = [];
        this.tetrisBlocks = [];
        this.speechBubbles = [];
        
        this.gravityDirection = 1;
        this.rainbowMode = false;
        this.laserMode = false;
        this.blockPattern = 0;
        this.isFlipped = false;
        this.chaosMode = false;
        this.chaosLevel = 0; // 0-100のカオスレベル
        
        this.keys = {};
        this.mouse = { x: 0, y: 0, isActive: false };
        this.touch = { 
            startX: 0, 
            startY: 0, 
            currentX: 0, 
            currentY: 0, 
            isActive: false,
            swipeThreshold: 50
        };
        
        this.setupEvents();
        this.createInitialBall();
        this.createBlocks();
        this.gameLoop();
    }
    
    setupEvents() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ') {
                e.preventDefault();
                this.togglePause();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // マウスイベント
        this.canvas.addEventListener('mouseenter', () => {
            this.mouse.isActive = true;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.isActive = false;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.mouse.isActive) return;
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('click', (e) => {
            if (this.laserMode && this.gameRunning && !this.gamePaused) {
                this.fireLaser();
            }
        });
        
        // タッチイベント
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.touch.startX = touch.clientX - rect.left;
            this.touch.startY = touch.clientY - rect.top;
            this.touch.currentX = this.touch.startX;
            this.touch.currentY = this.touch.startY;
            this.touch.isActive = true;
            
            // モバイルでゲーム開始画面の場合、タップでスタート
            if (!this.gameRunning && this.isMobile) {
                this.startGame();
            }
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!this.touch.isActive) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.touch.currentX = touch.clientX - rect.left;
            this.touch.currentY = touch.clientY - rect.top;
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (!this.touch.isActive) return;
            
            const deltaX = this.touch.currentX - this.touch.startX;
            const deltaY = this.touch.currentY - this.touch.startY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // タップ判定
            if (distance < 20) {
                if (this.laserMode && this.gameRunning && !this.gamePaused) {
                    this.fireLaser();
                }
            }
            // スワイプ判定
            else if (distance > this.touch.swipeThreshold) {
                this.handleSwipe(deltaX, deltaY);
            }
            
            this.touch.isActive = false;
        });
        
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        
        document.querySelectorAll('.power-up-item').forEach(item => {
            item.addEventListener('click', () => {
                if (this.score >= 100) {
                    this.activatePowerUp(item.dataset.type);
                    this.score -= 100;
                    this.updateUI();
                }
            });
        });
        
        // リサイズ対応
        window.addEventListener('resize', () => {
            if (this.isMobile) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                // パドル位置を調整
                this.paddle.y = this.canvas.height - 30;
                this.paddle.x = Math.min(this.paddle.x, this.canvas.width - this.paddle.width);
            }
        });
        
        // 画面向き変更対応
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (this.isMobile) {
                    this.canvas.width = window.innerWidth;
                    this.canvas.height = window.innerHeight;
                    this.paddle.y = this.canvas.height - 30;
                    this.paddle.x = Math.min(this.paddle.x, this.canvas.width - this.paddle.width);
                }
            }, 100);
        });
    }
    
    createInitialBall() {
        this.balls = [{
            x: this.canvas.width / 2,
            y: this.canvas.height - 80,
            dx: (Math.random() - 0.5) * 4,
            dy: -8 - Math.random() * 2,
            radius: 8,
            color: '#4ecdc4',
            trail: [],
            maxSpeed: 12,
            minSpeed: 6
        }];
    }
    
    createBlocks() {
        this.blocks = [];
        const rows = 6 + this.level;
        const cols = 10 + Math.floor(this.level / 2);
        const blockWidth = this.canvas.width / cols;
        const blockHeight = 20;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (this.shouldCreateBlock(row, col)) {
                    const block = {
                        x: col * blockWidth,
                        y: 50 + row * (blockHeight + 2),
                        width: blockWidth - 2,
                        height: blockHeight,
                        color: this.getBlockColor(row, col),
                        type: this.getBlockType(row, col),
                        hits: this.getBlockHits(row, col),
                        maxHits: this.getBlockHits(row, col),
                        rotation: 0,
                        scale: 1,
                        hasEyes: Math.random() > (0.9 - this.chaosLevel * 0.01),
                        eyeState: 'open',
                        lastBlink: Date.now(),
                        isMoving: Math.random() > (0.95 - this.chaosLevel * 0.01),
                        moveDirection: { x: (Math.random() - 0.5) * 0.3, y: (Math.random() - 0.5) * 0.3 },
                        lastSpeech: 0,
                        personality: ['😠', '😎', '😱', '🤔', '😴'][Math.floor(Math.random() * 5)]
                    };
                    this.blocks.push(block);
                }
            }
        }
    }
    
    shouldCreateBlock(row, col) {
        const patterns = [
            () => true,
            () => (row + col) % 2 === 0,
            () => Math.sin(col * 0.5) * Math.cos(row * 0.3) > 0,
            () => Math.random() > 0.3,
            () => Math.abs(col - 5) + Math.abs(row - 3) < 8
        ];
        return patterns[this.blockPattern % patterns.length]();
    }
    
    getBlockColor(row, col) {
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
            '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'
        ];
        return colors[(row + col) % colors.length];
    }
    
    getBlockType(row, col) {
        const rand = Math.random();
        if (rand < 0.1) return 'explosive';
        if (rand < 0.2) return 'teleport';
        if (rand < 0.3) return 'multiplier';
        return 'normal';
    }
    
    getBlockHits(row, col) {
        return Math.floor(Math.random() * 3) + 1;
    }
    
    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        
        // モバイルでゲーム開始時にUIを薄くする
        if (this.isMobile) {
            document.body.classList.add('game-running');
        }
    }
    
    togglePause() {
        if (this.gameRunning) {
            this.gamePaused = !this.gamePaused;
        }
    }
    
    resetGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.specialEffect = 'なし';
        this.gravityDirection = 1;
        this.rainbowMode = false;
        this.laserMode = false;
        this.blockPattern = 0;
        this.chaosLevel = 0;
        this.blockProjectiles = [];
        this.emojiRain = [];
        this.invaders = [];
        this.tetrisBlocks = [];
        this.speechBubbles = [];
        this.powerUps = [];
        this.particles = [];
        this.lasers = [];
        this.createInitialBall();
        this.createBlocks();
        this.updateUI();
        document.getElementById('game-over').style.display = 'none';
        
        // モバイルでUIを元に戻す
        if (this.isMobile) {
            document.body.classList.remove('game-running');
        }
    }
    
    activatePowerUp(type) {
        switch (type) {
            case 'multi-ball':
                this.createMultiBall();
                this.specialEffect = 'マルチボール';
                break;
            case 'laser':
                this.laserMode = true;
                this.specialEffect = 'レーザーモード';
                setTimeout(() => {
                    this.laserMode = false;
                    this.specialEffect = 'なし';
                }, 10000);
                break;
            case 'big-paddle':
                this.paddle.width = 150;
                this.specialEffect = '大きなパドル';
                setTimeout(() => {
                    this.paddle.width = 100;
                    this.specialEffect = 'なし';
                }, 15000);
                break;
            case 'gravity':
                this.gravityDirection *= -1;
                this.specialEffect = '重力反転';
                setTimeout(() => {
                    this.gravityDirection *= -1;
                    this.specialEffect = 'なし';
                }, 12000);
                break;
            case 'rainbow':
                this.rainbowMode = true;
                this.specialEffect = 'レインボーモード';
                setTimeout(() => {
                    this.rainbowMode = false;
                    this.specialEffect = 'なし';
                }, 8000);
                break;
        }
        this.updateUI();
    }
    
    createMultiBall() {
        const currentBalls = [...this.balls];
        currentBalls.forEach(ball => {
            for (let i = 0; i < 2; i++) {
                this.balls.push({
                    x: ball.x + (Math.random() - 0.5) * 20,
                    y: ball.y + (Math.random() - 0.5) * 20,
                    dx: (Math.random() - 0.5) * 8,
                    dy: (Math.random() - 0.5) * 8,
                    radius: 6,
                    color: '#ff6b6b',
                    trail: [],
                    maxSpeed: 12,
                    minSpeed: 6
                });
            }
        });
    }
    
    // カオス系更新メソッド群
    updateBlocks() {
        this.blocks.forEach(block => {
            // 目の瞬き
            if (block.hasEyes && Date.now() - block.lastBlink > 2000 + Math.random() * 3000) {
                block.eyeState = block.eyeState === 'open' ? 'closed' : 'open';
                block.lastBlink = Date.now();
            }
            
            // ブロックが勝手に動く
            if (block.isMoving) {
                block.x += block.moveDirection.x;
                block.y += block.moveDirection.y;
                
                // 画面端で跳ね返る
                if (block.x <= 0 || block.x + block.width >= this.canvas.width) {
                    block.moveDirection.x *= -1;
                }
                if (block.y <= 0 || block.y + block.height >= this.canvas.height) {
                    block.moveDirection.y *= -1;
                }
            }
            
            // ブロックがしゃべる（カオスレベルに応じて）
            const speechThreshold = 0.9995 - (this.chaosLevel * 0.0001);
            if (Math.random() > speechThreshold && Date.now() - block.lastSpeech > 5000) {
                this.createSpeechBubble(block);
                block.lastSpeech = Date.now();
            }
            
            // ブロックが攻撃してくる（カオスレベルに応じて）
            const attackThreshold = 0.9995 - (this.chaosLevel * 0.0002);
            if (Math.random() > attackThreshold) {
                this.createBlockProjectile(block);
            }
        });
    }
    
    updateBlockProjectiles() {
        this.blockProjectiles.forEach((projectile, index) => {
            projectile.x += projectile.dx;
            projectile.y += projectile.dy;
            projectile.life--;
            
            if (projectile.life <= 0 || projectile.y > this.canvas.height) {
                this.blockProjectiles.splice(index, 1);
            }
            
            // パドルとの衝突
            if (this.checkProjectilePaddleCollision(projectile)) {
                this.blockProjectiles.splice(index, 1);
                this.lives--;
                this.createParticles(projectile.x, projectile.y, '#ff0000');
            }
        });
    }
    
    updateEmojiRain() {
        this.emojiRain.forEach((emoji, index) => {
            emoji.y += emoji.speed;
            emoji.rotation += emoji.rotationSpeed;
            
            if (emoji.y > this.canvas.height) {
                this.emojiRain.splice(index, 1);
            }
        });
    }
    
    updateInvaders() {
        this.invaders.forEach((invader, index) => {
            invader.x += invader.dx;
            invader.y += invader.dy;
            
            if (invader.x <= 0 || invader.x >= this.canvas.width - 30) {
                invader.dx *= -1;
                invader.y += 20;
            }
            
            if (invader.y > this.canvas.height) {
                this.invaders.splice(index, 1);
            }
            
            // インベーダーも攻撃（カオスレベルに応じて）
            const invaderAttackThreshold = 0.995 - (this.chaosLevel * 0.0001);
            if (Math.random() > invaderAttackThreshold) {
                this.createInvaderProjectile(invader);
            }
        });
    }
    
    updateTetrisBlocks() {
        this.tetrisBlocks.forEach((tetris, index) => {
            tetris.y += tetris.speed;
            tetris.rotation += tetris.rotationSpeed;
            
            if (tetris.y > this.canvas.height) {
                this.tetrisBlocks.splice(index, 1);
            }
        });
    }
    
    updateSpeechBubbles() {
        this.speechBubbles.forEach((bubble, index) => {
            bubble.life--;
            bubble.y -= 0.5;
            
            if (bubble.life <= 0) {
                this.speechBubbles.splice(index, 1);
            }
        });
    }
    
    triggerChaosEvents() {
        // カオスレベルを更新（スコアとレベルに基づく）
        this.chaosLevel = Math.min(100, Math.floor(this.score / 100) + (this.level - 1) * 10);
        
        // ランダムイベント発生（カオスレベルに応じて）
        const eventThreshold = 0.9999 - (this.chaosLevel * 0.00001);
        if (Math.random() > eventThreshold) {
            const events = [
                () => this.createEmojiRain(),
                () => this.spawnInvaders(),
                () => this.dropTetrisBlocks(),
                () => this.flipScreen(),
                () => this.chaosGravity()
            ];
            
            // カオスレベルが低い時は軽いイベントのみ
            let availableEvents = events;
            if (this.chaosLevel < 20) {
                availableEvents = [() => this.createEmojiRain()]; // 絵文字の雨のみ
            } else if (this.chaosLevel < 40) {
                availableEvents = events.slice(0, 3); // 絵文字、インベーダー、テトリスのみ
            }
            
            const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
            randomEvent();
        }
    }
    
    // カオス系作成メソッド群
    createSpeechBubble(block) {
        const phrases = [
            "やめてー！", "逃げるー！", "痛いよ〜", "助けて〜", "うわああ",
            "こっち来るな！", "もうダメだ…", "君、上手だね", "つまらない",
            "眠い…", "お腹空いた", "今日寒くない？", "なんで僕を？"
        ];
        
        this.speechBubbles.push({
            x: block.x + block.width / 2,
            y: block.y - 20,
            text: phrases[Math.floor(Math.random() * phrases.length)],
            life: 120,
            personality: block.personality
        });
    }
    
    createBlockProjectile(block) {
        this.blockProjectiles.push({
            x: block.x + block.width / 2,
            y: block.y + block.height,
            dx: (Math.random() - 0.5) * 4,
            dy: 3 + Math.random() * 3,
            life: 120,
            color: block.color,
            symbol: ['💥', '⚡', '🔥', '❄️'][Math.floor(Math.random() * 4)]
        });
    }
    
    createInvaderProjectile(invader) {
        this.blockProjectiles.push({
            x: invader.x + 15,
            y: invader.y + 30,
            dx: 0,
            dy: 5,
            life: 100,
            color: '#00ff00',
            symbol: '👾'
        });
    }
    
    createEmojiRain() {
        const emojis = ['🌈', '🦄', '🍕', '🎈', '⭐', '🎭', '🎪', '🎨', '🎯', '🎲', '🎧', '📱', '💎', '🔮', '🎊'];
        
        // カオスレベルに応じて数を調整
        const emojiCount = Math.max(5, Math.min(30, 5 + this.chaosLevel / 5));
        
        for (let i = 0; i < emojiCount; i++) {
            this.emojiRain.push({
                x: Math.random() * this.canvas.width,
                y: -50 - Math.random() * 200,
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                speed: 2 + Math.random() * 4,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.2
            });
        }
    }
    
    spawnInvaders() {
        // カオスレベルに応じて数を調整
        const invaderCount = Math.max(2, Math.min(8, 2 + this.chaosLevel / 20));
        
        for (let i = 0; i < invaderCount; i++) {
            this.invaders.push({
                x: i * (this.canvas.width / invaderCount) + 50,
                y: 100,
                dx: 1 + this.chaosLevel / 50,
                dy: 0,
                color: '#00ff00'
            });
        }
    }
    
    dropTetrisBlocks() {
        const shapes = [
            [[1,1,1,1]], // I
            [[1,1],[1,1]], // O
            [[0,1,0],[1,1,1]], // T
            [[1,0],[1,1],[0,1]] // Z
        ];
        
        for (let i = 0; i < 3; i++) {
            this.tetrisBlocks.push({
                x: Math.random() * (this.canvas.width - 60),
                y: -100 - i * 50,
                shape: shapes[Math.floor(Math.random() * shapes.length)],
                speed: 2 + Math.random() * 3,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00'][Math.floor(Math.random() * 4)]
            });
        }
    }
    
    flipScreen() {
        this.isFlipped = !this.isFlipped;
        setTimeout(() => {
            this.isFlipped = false;
        }, 5000);
    }
    
    chaosGravity() {
        this.gravityDirection = Math.random() > 0.5 ? 1 : -1;
        setTimeout(() => {
            this.gravityDirection = 1;
        }, 3000 + Math.random() * 5000);
    }
    
    // 衝突判定追加
    checkProjectilePaddleCollision(projectile) {
        return projectile.x >= this.paddle.x && projectile.x <= this.paddle.x + this.paddle.width &&
               projectile.y + 10 >= this.paddle.y && projectile.y <= this.paddle.y + this.paddle.height;
    }
    
    update() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.updatePaddle();
        this.updateBalls();
        this.updatePowerUps();
        this.updateParticles();
        this.updateLasers();
        this.updateBlocks();
        this.updateBlockProjectiles();
        this.updateEmojiRain();
        this.updateInvaders();
        this.updateTetrisBlocks();
        this.updateSpeechBubbles();
        this.checkCollisions();
        this.checkGameState();
        this.triggerChaosEvents();
    }
    
    handleSwipe(deltaX, deltaY) {
        if (!this.gameRunning || this.gamePaused) return;
        
        // 水平スワイプでパドル移動
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            const moveDistance = deltaX * 0.5;
            this.paddle.x += moveDistance;
            this.paddle.x = Math.max(0, Math.min(this.paddle.x, this.canvas.width - this.paddle.width));
        }
        // 上スワイプでレーザー発射
        else if (deltaY < -this.touch.swipeThreshold && this.laserMode) {
            this.fireLaser();
        }
    }
    
    updatePaddle() {
        // キーボード操作
        if (this.keys['ArrowLeft'] && this.paddle.x > 0) {
            this.paddle.x -= this.paddle.speed;
        }
        if (this.keys['ArrowRight'] && this.paddle.x < this.canvas.width - this.paddle.width) {
            this.paddle.x += this.paddle.speed;
        }
        
        // マウス操作（PCのみ）
        if (this.mouse.isActive && this.mouse.x > 0 && this.mouse.x < this.canvas.width) {
            this.paddle.x = this.mouse.x - this.paddle.width / 2;
            this.paddle.x = Math.max(0, Math.min(this.paddle.x, this.canvas.width - this.paddle.width));
        }
        
        // タッチ操作（リアルタイム追従）
        if (this.touch.isActive && this.touch.currentX > 0 && this.touch.currentX < this.canvas.width) {
            this.paddle.x = this.touch.currentX - this.paddle.width / 2;
            this.paddle.x = Math.max(0, Math.min(this.paddle.x, this.canvas.width - this.paddle.width));
        }
        
        // レーザー発射（キーボード）
        if (this.laserMode && this.keys[' ']) {
            this.fireLaser();
        }
    }
    
    fireLaser() {
        if (this.lasers.length < 3) {
            this.lasers.push({
                x: this.paddle.x + this.paddle.width / 2,
                y: this.paddle.y,
                width: 3,
                height: 20,
                speed: 10
            });
        }
    }
    
    updateBalls() {
        this.balls.forEach((ball, index) => {
            ball.trail.push({ x: ball.x, y: ball.y });
            if (ball.trail.length > 10) ball.trail.shift();
            
            // より軽い重力効果
            ball.dy += 0.03 * this.gravityDirection;
            
            // 速度制限を適用
            const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
            if (currentSpeed > ball.maxSpeed) {
                const ratio = ball.maxSpeed / currentSpeed;
                ball.dx *= ratio;
                ball.dy *= ratio;
            } else if (currentSpeed < ball.minSpeed) {
                const ratio = ball.minSpeed / currentSpeed;
                ball.dx *= ratio;
                ball.dy *= ratio;
            }
            
            ball.x += ball.dx;
            ball.y += ball.dy;
            
            if (ball.x <= ball.radius || ball.x >= this.canvas.width - ball.radius) {
                ball.dx = -ball.dx;
                this.createParticles(ball.x, ball.y, ball.color);
            }
            
            if (ball.y <= ball.radius) {
                ball.dy = -ball.dy;
                this.createParticles(ball.x, ball.y, ball.color);
            }
            
            if (ball.y > this.canvas.height + ball.radius) {
                this.balls.splice(index, 1);
                if (this.balls.length === 0) {
                    this.lives--;
                    if (this.lives > 0) {
                        this.createInitialBall();
                    }
                }
            }
            
            if (this.rainbowMode) {
                ball.color = `hsl(${(Date.now() + index * 60) % 360}, 100%, 50%)`;
            }
        });
    }
    
    updatePowerUps() {
        this.powerUps.forEach((powerUp, index) => {
            powerUp.y += powerUp.speed;
            powerUp.rotation += 0.1;
            
            if (powerUp.y > this.canvas.height) {
                this.powerUps.splice(index, 1);
            }
            
            if (this.checkPowerUpPaddleCollision(powerUp)) {
                this.activatePowerUp(powerUp.type);
                this.powerUps.splice(index, 1);
                this.createParticles(powerUp.x, powerUp.y, powerUp.color);
            }
        });
    }
    
    updateParticles() {
        this.particles.forEach((particle, index) => {
            particle.x += particle.dx;
            particle.y += particle.dy;
            particle.life--;
            particle.alpha = particle.life / particle.maxLife;
            
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }
    
    updateLasers() {
        this.lasers.forEach((laser, index) => {
            laser.y -= laser.speed;
            
            if (laser.y < 0) {
                this.lasers.splice(index, 1);
            }
            
            this.blocks.forEach((block, blockIndex) => {
                if (this.checkLaserBlockCollision(laser, block)) {
                    this.hitBlock(block, blockIndex);
                    this.lasers.splice(index, 1);
                }
            });
        });
    }
    
    checkCollisions() {
        this.balls.forEach((ball, ballIndex) => {
            if (this.checkBallPaddleCollision(ball)) {
                const hitPos = (ball.x - this.paddle.x) / this.paddle.width;
                ball.dx = (hitPos - 0.5) * 8;
                ball.dy = -Math.abs(ball.dy) * 1.1; // パドルから跳ね返る時に少し加速
                
                // 最低限の上向き速度を保証
                if (Math.abs(ball.dy) < 6) {
                    ball.dy = ball.dy < 0 ? -6 : 6;
                }
                
                this.createParticles(ball.x, ball.y, this.paddle.color);
            }
            
            this.blocks.forEach((block, blockIndex) => {
                if (this.checkBallBlockCollision(ball, block)) {
                    this.hitBlock(block, blockIndex);
                    
                    const ballCenterX = ball.x;
                    const ballCenterY = ball.y;
                    const blockCenterX = block.x + block.width / 2;
                    const blockCenterY = block.y + block.height / 2;
                    
                    if (Math.abs(ballCenterX - blockCenterX) > Math.abs(ballCenterY - blockCenterY)) {
                        ball.dx = -ball.dx;
                    } else {
                        ball.dy = -ball.dy;
                    }
                }
            });
        });
    }
    
    hitBlock(block, blockIndex) {
        block.hits--;
        block.scale = 1.2;
        setTimeout(() => block.scale = 1, 100);
        
        this.createParticles(block.x + block.width / 2, block.y + block.height / 2, block.color);
        
        if (block.hits <= 0) {
            this.handleBlockDestruction(block, blockIndex);
        } else {
            block.color = this.getBlockColor(block.hits, 0);
        }
    }
    
    handleBlockDestruction(block, blockIndex) {
        this.blocks.splice(blockIndex, 1);
        this.score += 10 * this.level;
        
        switch (block.type) {
            case 'explosive':
                this.explodeBlock(block);
                break;
            case 'teleport':
                this.teleportBalls();
                break;
            case 'multiplier':
                this.score += 50 * this.level;
                break;
        }
        
        if (Math.random() < 0.1) {
            this.createPowerUp(block.x + block.width / 2, block.y + block.height / 2);
        }
        
        this.createExplosion(block.x + block.width / 2, block.y + block.height / 2, block.color);
    }
    
    explodeBlock(block) {
        const explosionRadius = 80;
        this.blocks = this.blocks.filter(otherBlock => {
            const distance = Math.sqrt(
                Math.pow(otherBlock.x + otherBlock.width / 2 - block.x - block.width / 2, 2) +
                Math.pow(otherBlock.y + otherBlock.height / 2 - block.y - block.height / 2, 2)
            );
            
            if (distance < explosionRadius) {
                this.score += 5 * this.level;
                this.createParticles(otherBlock.x + otherBlock.width / 2, otherBlock.y + otherBlock.height / 2, otherBlock.color);
                return false;
            }
            return true;
        });
    }
    
    teleportBalls() {
        this.balls.forEach(ball => {
            ball.x = Math.random() * (this.canvas.width - 2 * ball.radius) + ball.radius;
            ball.y = Math.random() * (this.canvas.height / 2) + ball.radius;
            this.createParticles(ball.x, ball.y, '#ff6b6b');
        });
    }
    
    createPowerUp(x, y) {
        const types = ['multi-ball', 'laser', 'big-paddle', 'gravity', 'rainbow'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        this.powerUps.push({
            x: x - 15,
            y: y,
            width: 30,
            height: 20,
            speed: 2,
            type: type,
            color: '#feca57',
            rotation: 0
        });
    }
    
    createParticles(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                dx: (Math.random() - 0.5) * 6,
                dy: (Math.random() - 0.5) * 6,
                life: 30,
                maxLife: 30,
                color: color,
                alpha: 1
            });
        }
    }
    
    createExplosion(x, y, color) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                dx: (Math.random() - 0.5) * 12,
                dy: (Math.random() - 0.5) * 12,
                life: 60,
                maxLife: 60,
                color: color,
                alpha: 1
            });
        }
    }
    
    checkBallPaddleCollision(ball) {
        return ball.x >= this.paddle.x && ball.x <= this.paddle.x + this.paddle.width &&
               ball.y + ball.radius >= this.paddle.y && ball.y - ball.radius <= this.paddle.y + this.paddle.height;
    }
    
    checkBallBlockCollision(ball, block) {
        return ball.x + ball.radius >= block.x && ball.x - ball.radius <= block.x + block.width &&
               ball.y + ball.radius >= block.y && ball.y - ball.radius <= block.y + block.height;
    }
    
    checkPowerUpPaddleCollision(powerUp) {
        return powerUp.x + powerUp.width >= this.paddle.x && powerUp.x <= this.paddle.x + this.paddle.width &&
               powerUp.y + powerUp.height >= this.paddle.y && powerUp.y <= this.paddle.y + this.paddle.height;
    }
    
    checkLaserBlockCollision(laser, block) {
        return laser.x + laser.width >= block.x && laser.x <= block.x + block.width &&
               laser.y <= block.y + block.height && laser.y + laser.height >= block.y;
    }
    
    checkGameState() {
        if (this.blocks.length === 0) {
            this.level++;
            this.blockPattern++;
            this.createBlocks();
            // レベルアップ時のボール速度調整を緩やかに
            this.balls.forEach(ball => {
                ball.dx *= 1.05;
                ball.dy *= 1.05;
                // 速度制限も更新
                ball.maxSpeed = Math.min(ball.maxSpeed * 1.05, 15);
                ball.minSpeed = Math.min(ball.minSpeed * 1.05, 8);
            });
        }
        
        if (this.lives <= 0) {
            this.gameOver();
        }
        
        this.updateUI();
    }
    
    gameOver() {
        this.gameRunning = false;
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over').style.display = 'flex';
        
        // モバイルでUIを元に戻す
        if (this.isMobile) {
            document.body.classList.remove('game-running');
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
        
        // カオスレベルも表示
        let effectText = this.specialEffect;
        if (this.chaosLevel > 0) {
            effectText += ` (カオス: ${this.chaosLevel}%)`;
        }
        document.getElementById('special-effect').textContent = effectText;
    }
    
    render() {
        this.ctx.save();
        
        // 画面反転
        if (this.isFlipped) {
            this.ctx.translate(this.canvas.width, this.canvas.height);
            this.ctx.rotate(Math.PI);
        }
        
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawStars();
        this.drawPaddle();
        this.drawBalls();
        this.drawBlocks();
        this.drawPowerUps();
        this.drawParticles();
        this.drawLasers();
        this.drawBlockProjectiles();
        this.drawEmojiRain();
        this.drawInvaders();
        this.drawTetrisBlocks();
        this.drawSpeechBubbles();
        
        this.ctx.restore();
        
        if (!this.gameRunning) {
            this.drawStartScreen();
        }
        
        if (this.gamePaused) {
            this.drawPauseScreen();
        }
    }
    
    drawStars() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 50; i++) {
            const x = (i * 137.5) % this.canvas.width;
            const y = (i * 78.5) % this.canvas.height;
            this.ctx.fillRect(x, y, 1, 1);
        }
    }
    
    drawPaddle() {
        this.ctx.save();
        this.ctx.fillStyle = this.paddle.color;
        this.ctx.shadowColor = this.paddle.color;
        this.ctx.shadowBlur = 10;
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        this.ctx.restore();
    }
    
    drawBalls() {
        this.balls.forEach(ball => {
            ball.trail.forEach((point, index) => {
                this.ctx.globalAlpha = index / ball.trail.length * 0.5;
                this.ctx.fillStyle = ball.color;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, ball.radius * (index / ball.trail.length), 0, Math.PI * 2);
                this.ctx.fill();
            });
            
            this.ctx.globalAlpha = 1;
            this.ctx.save();
            this.ctx.fillStyle = ball.color;
            this.ctx.shadowColor = ball.color;
            this.ctx.shadowBlur = 15;
            this.ctx.beginPath();
            this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    drawBlocks() {
        this.blocks.forEach(block => {
            this.ctx.save();
            this.ctx.translate(block.x + block.width / 2, block.y + block.height / 2);
            this.ctx.scale(block.scale, block.scale);
            this.ctx.rotate(block.rotation);
            
            this.ctx.fillStyle = block.color;
            this.ctx.shadowColor = block.color;
            this.ctx.shadowBlur = 5;
            this.ctx.fillRect(-block.width / 2, -block.height / 2, block.width, block.height);
            
            // 目を描画
            if (block.hasEyes) {
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(-8, -8, 6, 6);
                this.ctx.fillRect(2, -8, 6, 6);
                
                if (block.eyeState === 'open') {
                    this.ctx.fillStyle = 'black';
                    this.ctx.fillRect(-6, -6, 2, 2);
                    this.ctx.fillRect(4, -6, 2, 2);
                } else {
                    this.ctx.fillStyle = 'black';
                    this.ctx.fillRect(-8, -5, 6, 1);
                    this.ctx.fillRect(2, -5, 6, 1);
                }
            }
            
            // 特殊ブロックシンボル
            if (block.type !== 'normal') {
                this.ctx.fillStyle = 'white';
                this.ctx.font = '10px Arial';
                this.ctx.textAlign = 'center';
                const symbols = { explosive: '💥', teleport: '⚡', multiplier: '×2' };
                this.ctx.fillText(symbols[block.type] || '', 0, 8);
            }
            
            // 性格表示
            this.ctx.font = '8px Arial';
            this.ctx.fillText(block.personality, 0, -12);
            
            this.ctx.restore();
        });
    }
    
    drawPowerUps() {
        this.powerUps.forEach(powerUp => {
            this.ctx.save();
            this.ctx.translate(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2);
            this.ctx.rotate(powerUp.rotation);
            
            this.ctx.fillStyle = powerUp.color;
            this.ctx.shadowColor = powerUp.color;
            this.ctx.shadowBlur = 10;
            this.ctx.fillRect(-powerUp.width / 2, -powerUp.height / 2, powerUp.width, powerUp.height);
            
            this.ctx.fillStyle = 'black';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('P', 0, 3);
            
            this.ctx.restore();
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
            this.ctx.restore();
        });
    }
    
    drawLasers() {
        this.ctx.fillStyle = '#ff0000';
        this.ctx.shadowColor = '#ff0000';
        this.ctx.shadowBlur = 5;
        this.lasers.forEach(laser => {
            this.ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
        });
    }
    
    drawBlockProjectiles() {
        this.blockProjectiles.forEach(projectile => {
            this.ctx.save();
            this.ctx.fillStyle = projectile.color;
            this.ctx.shadowColor = projectile.color;
            this.ctx.shadowBlur = 10;
            
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(projectile.symbol, projectile.x, projectile.y);
            
            this.ctx.restore();
        });
    }
    
    drawEmojiRain() {
        this.emojiRain.forEach(emoji => {
            this.ctx.save();
            this.ctx.translate(emoji.x, emoji.y);
            this.ctx.rotate(emoji.rotation);
            
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(emoji.emoji, 0, 0);
            
            this.ctx.restore();
        });
    }
    
    drawInvaders() {
        this.invaders.forEach(invader => {
            this.ctx.save();
            this.ctx.fillStyle = invader.color;
            this.ctx.shadowColor = invader.color;
            this.ctx.shadowBlur = 10;
            
            // インベーダー風の形
            this.ctx.fillRect(invader.x, invader.y, 30, 20);
            this.ctx.fillRect(invader.x - 5, invader.y + 10, 40, 10);
            this.ctx.fillRect(invader.x + 5, invader.y + 20, 20, 5);
            
            // 目
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(invader.x + 8, invader.y + 5, 4, 4);
            this.ctx.fillRect(invader.x + 18, invader.y + 5, 4, 4);
            
            this.ctx.restore();
        });
    }
    
    drawTetrisBlocks() {
        this.tetrisBlocks.forEach(tetris => {
            this.ctx.save();
            this.ctx.translate(tetris.x, tetris.y);
            this.ctx.rotate(tetris.rotation);
            
            this.ctx.fillStyle = tetris.color;
            this.ctx.shadowColor = tetris.color;
            this.ctx.shadowBlur = 5;
            
            // テトリスブロック描画
            tetris.shape.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    if (cell) {
                        this.ctx.fillRect(colIndex * 15, rowIndex * 15, 14, 14);
                        this.ctx.strokeStyle = 'white';
                        this.ctx.strokeRect(colIndex * 15, rowIndex * 15, 14, 14);
                    }
                });
            });
            
            this.ctx.restore();
        });
    }
    
    drawSpeechBubbles() {
        this.speechBubbles.forEach(bubble => {
            this.ctx.save();
            
            // 吹き出し背景
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 2;
            
            const textWidth = this.ctx.measureText(bubble.text).width + 10;
            const bubbleX = bubble.x - textWidth / 2;
            const bubbleY = bubble.y - 20;
            
            this.ctx.fillRect(bubbleX, bubbleY, textWidth, 20);
            this.ctx.strokeRect(bubbleX, bubbleY, textWidth, 20);
            
            // 吹き出しの尻尾
            this.ctx.beginPath();
            this.ctx.moveTo(bubble.x - 5, bubbleY + 20);
            this.ctx.lineTo(bubble.x, bubbleY + 25);
            this.ctx.lineTo(bubble.x + 5, bubbleY + 20);
            this.ctx.fill();
            this.ctx.stroke();
            
            // テキスト
            this.ctx.fillStyle = 'black';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(bubble.text, bubble.x, bubbleY + 15);
            
            // 性格絵文字
            this.ctx.font = '10px Arial';
            this.ctx.fillText(bubble.personality, bubble.x + textWidth / 2 - 8, bubbleY + 8);
            
            this.ctx.restore();
        });
    }
    
    drawStartScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        if (this.isMobile) {
            // モバイル版：シンプルに
            this.ctx.font = 'bold 32px Arial';
            this.ctx.textAlign = 'center';
            
            // グラデーション効果
            const gradient = this.ctx.createLinearGradient(0, this.canvas.height / 2 - 50, 0, this.canvas.height / 2 - 10);
            gradient.addColorStop(0, '#4ecdc4');
            gradient.addColorStop(1, '#ff6b6b');
            this.ctx.fillStyle = gradient;
            this.ctx.fillText('NEXUS BREAKER', this.canvas.width / 2, this.canvas.height / 2 - 40);
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = '18px Arial';
            this.ctx.fillText('タップでスタート', this.canvas.width / 2, this.canvas.height / 2 + 20);
        } else {
            // PC版：詳細説明
            this.ctx.font = 'bold 48px Arial';
            this.ctx.textAlign = 'center';
            
            // グラデーション効果
            const gradient = this.ctx.createLinearGradient(0, this.canvas.height / 2 - 100, 0, this.canvas.height / 2 - 60);
            gradient.addColorStop(0, '#4ecdc4');
            gradient.addColorStop(1, '#ff6b6b');
            this.ctx.fillStyle = gradient;
            this.ctx.shadowColor = '#4ecdc4';
            this.ctx.shadowBlur = 20;
            this.ctx.fillText('NEXUS BREAKER', this.canvas.width / 2, this.canvas.height / 2 - 80);
            
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = 'white';
            this.ctx.font = '18px Arial';
            this.ctx.fillText('スタートボタンを押して開始', this.canvas.width / 2, this.canvas.height / 2 - 30);
            
            this.ctx.font = '16px Arial';
            this.ctx.fillText('🖱️ マウスまたは矢印キーで操作', this.canvas.width / 2, this.canvas.height / 2 + 10);
            this.ctx.fillText('⌨️ スペースキーで一時停止', this.canvas.width / 2, this.canvas.height / 2 + 35);
            this.ctx.fillText('⚡ レーザーモード時：クリックで発射', this.canvas.width / 2, this.canvas.height / 2 + 60);
        }
    }
    
    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('一時停止', this.canvas.width / 2, this.canvas.height / 2);
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

function restartGame() {
    game.resetGame();
}

const game = new ExtraordinaryBreakout();