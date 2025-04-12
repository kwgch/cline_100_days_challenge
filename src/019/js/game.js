class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.player = new Player(this.canvas.width / 2, this.canvas.height - 50);
        this.enemies = [];
        this.uiManager = new UIManager(this);
        this.collisionManager = new CollisionManager(this);
        this.lastTime = 0;
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;

        this.spawnEnemyInterval = 1000;
        this.lastSpawnTime = 0;

        this.stars = [];
        this.numStars = 100;
        this.createStars();
    }

    createStars() {
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speed: Math.random() * 20 + 10
            });
        }
    }

    init() {
        this.start();
    }

    start() {
        requestAnimationFrame(this.update.bind(this));
    }

    update(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateStars(deltaTime);
        this.renderStars(this.ctx);

        this.player.update(deltaTime);
        this.player.render(this.ctx);

        this.updateEnemies(deltaTime);

        this.collisionManager.checkCollisions();

        this.uiManager.updateScore(this.score);
        this.uiManager.updateLives(this.lives);
        this.uiManager.render(this.ctx);

        if (!this.gameOver) {
            requestAnimationFrame(this.update.bind(this));
        } else {
            this.uiManager.showGameOver(this.ctx);
        }
    }

    updateEnemies(deltaTime) {
        if (this.lastTime - this.lastSpawnTime > this.spawnEnemyInterval) {
            this.spawnEnemy();
            this.lastSpawnTime = this.lastTime;
        }

        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update(deltaTime);
            this.enemies[i].render(this.ctx);

            if (this.enemies[i].x < -50) {
                this.enemies.splice(i, 1);
                i--;
            }
        }
    }

    updateStars(deltaTime) {
        for (let i = 0; i < this.stars.length; i++) {
            let star = this.stars[i];
            star.x -= star.speed * deltaTime / 1000;
            if (star.x < 0) {
                star.x = this.canvas.width;
            }
        }
    }

    renderStars(ctx) {
        ctx.fillStyle = 'white';
        for (let i = 0; i < this.stars.length; i++) {
            let star = this.stars[i];
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    spawnEnemy() {
        const enemy = new Enemy(this.canvas.width, Math.random() * this.canvas.height);
        this.enemies.push(enemy);
    }

    endGame() {
        this.gameOver = true;
    }
}

let game;
window.onload = function() {
    game = new Game('gameCanvas');
    //game.init(); // Game will start on button click
}
