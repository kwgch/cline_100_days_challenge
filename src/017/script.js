// ゲームの状態管理
class GameState {
    constructor() {
        this.isRunning = false;
        this.score = 0;
        this.enemies = [];
        this.bombs = [];
        this.lastTime = 0;
        this.enemySpawnInterval = 2000; // ミリ秒
        this.lastEnemySpawn = 0;
    }

    reset() {
        this.isRunning = false;
        this.score = 0;
        this.enemies = [];
        this.bombs = [];
        document.getElementById('score').textContent = '0';
        // 敵と爆弾の要素を削除
        document.querySelectorAll('.enemy, .bomb').forEach(el => el.remove());
    }
}

// プレイヤークラス
class Player {
    constructor() {
        this.element = document.getElementById('player');
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.x = window.innerWidth / 2;
        this.y = 50;
        this.speed = 0.5; // 移動速度係数

        this.updatePosition();
    }

    move(newX) {
        // 画面外に出ないように制限
        this.x = Math.max(this.width / 2, Math.min(newX, window.innerWidth - this.width / 2));
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.x - this.width / 2}px`;
    }

    dropBomb() {
        return new Bomb(this.x, this.y + this.height);
    }
}

// 爆弾クラス
class Bomb {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 15;
        this.speed = 5;
        this.element = document.createElement('div');
        this.element.className = 'bomb';
        this.element.style.left = `${this.x - this.width / 2}px`;
        this.element.style.top = `${this.y}px`;
        document.getElementById('game-area').appendChild(this.element);
    }

    update() {
        this.y += this.speed;
        this.element.style.top = `${this.y}px`;

        // 地面に着いたかチェック
        const groundTop = window.innerHeight * 0.8 - 50; // ground要素の上端
        if (this.y + this.height >= groundTop) {
            return false; // 爆弾を削除
        }
        return true; // 爆弾を維持
    }

    remove() {
        this.element.remove();
    }
}

// 敵クラス
class Enemy {
    constructor(i) {
        this.id = i;
        this.width = 40;
        this.height = 20;
        this.x = Math.random() * (window.innerWidth - this.width);
        this.y = window.innerHeight * 0.8 - 50 - this.height;
        this.speed = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 2);

        this.element = document.createElement('div');
        this.element.className = 'enemy';
        this.element.style.left = `${this.x}px`;
        this.element.style.bottom = `${50}px`;
        document.getElementById('game-area').appendChild(this.element);
        this.element.innerText = this.id;
    }

    update() {
        this.x += this.speed;

        // 画面端で反転
        if (this.x + this.width > window.innerWidth || this.x < 0) {
            this.speed *= -1;
        }

        this.element.style.left = `${this.x}px`;
        return true; // 敵を維持
    }

    checkCollision(bomb) {
        return (
            bomb.x + bomb.width / 2 > this.x &&
            bomb.x - bomb.width / 2 < this.x + this.width &&
            bomb.y > this.y &&
            bomb.y < this.y + this.height
        );
    }
}

// ゲームコントローラー
class GameController {
    constructor() {
        this.gameState = new GameState();
        this.player = new Player();

        this.setupEventListeners();
        this.gameLoop = this.gameLoop.bind(this); // バインド
        requestAnimationFrame(this.gameLoop); // 初期化時に一度呼び出す
    }

    setupEventListeners() {
        const gameArea = document.getElementById('game-area');
        const startButton = document.getElementById('start-button');

        // PC操作
        gameArea.addEventListener('mousemove', (e) => {
            if (this.gameState.isRunning) {
                this.player.move(e.clientX);
            }
        });

        gameArea.addEventListener('click', (e) => {
            if (this.gameState.isRunning) {
                this.gameState.bombs.push(this.player.dropBomb());
            }
        });

        // スマホ操作
        let touchStartX = 0;

        gameArea.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;

            // タップで爆弾投下（短いタッチの場合）
            if (this.gameState.isRunning) {
                this.gameState.bombs.push(this.player.dropBomb());
            }
        });

        gameArea.addEventListener('touchmove', (e) => {
            if (this.gameState.isRunning) {
                e.preventDefault(); // スクロール防止
                const touchX = e.touches[0].clientX;
                const deltaX = touchX - touchStartX;

                this.player.move(this.player.x + deltaX);
                touchStartX = touchX;
            }
        });

        // ゲーム開始ボタン
        startButton.addEventListener('click', () => {
            if (this.gameState.isRunning) {
                this.gameState.reset();
                startButton.textContent = 'ゲーム開始';
            } else {
                this.gameState.isRunning = true;
                this.gameState.lastTime = performance.now();
                startButton.textContent = 'リセット';
                requestAnimationFrame(this.gameLoop); // ゲームループ開始
            }
        });

        // リサイズ対応
        window.addEventListener('resize', () => {
            this.player.move(window.innerWidth / 2);
        });
    }

    gameLoop(timestamp) {
        if (!this.gameState.isRunning) return;

        const deltaTime = timestamp - this.gameState.lastTime;
        this.gameState.lastTime = timestamp;

        // 敵の生成
        if (timestamp - this.gameState.lastEnemySpawn > this.gameState.enemySpawnInterval) {
            this.gameState.enemies.push(new Enemy(++this.enemiesNum));
            this.gameState.lastEnemySpawn = timestamp;
        }

        // 爆弾の更新
        this.gameState.bombs = this.gameState.bombs.filter(bomb => {
            const isActive = bomb.update();
            if (!isActive) {
                bomb.remove();
            }
            return isActive;
        });

        // 敵の更新と衝突判定
        this.gameState.enemies = this.gameState.enemies.filter(enemy => {
            enemy.update();

            // 爆弾との衝突判定
            for (let i = 0; i < this.gameState.bombs.length; i++) {
                const bomb = this.gameState.bombs[i];
                if (enemy.checkCollision(bomb)) {
                    // 爆発エフェクト
                    const burst = new mojs.Burst({
                        left: bomb.x,
                        top: bomb.y,
                        radius: { 0: 50 },
                        count: 10,
                        children: {
                            shape: 'circle',
                            fill: 'red',
                            radius: 10,
                            duration: 1000,
                        }
                    });
                    burst.play();
                    enemy.element.remove();
                    bomb.remove();
                    this.gameState.bombs.splice(i, 1);
                    this.gameState.score += 100;
                    document.getElementById('score').textContent = this.gameState.score;
                    return false; // 敵を削除
                }
            }
            return true;
        });

        requestAnimationFrame(this.gameLoop);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GameController();
});
