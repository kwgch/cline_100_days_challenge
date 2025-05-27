class ColorGameEngine {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.isGameActive = false;
        this.gridSize = 3; // 3x3から開始
        this.maxGridSize = 6; // 最大6x6
        this.colorDifference = 50; // 初期の色の差
        this.minColorDifference = 5; // 最小の色の差
        this.correctTileIndex = 0;
        this.currentColors = [];
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.livesElement = document.getElementById('lives');
        this.colorGrid = document.getElementById('color-grid');
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.gameOverDiv = document.getElementById('game-over');
        this.levelUpDiv = document.getElementById('level-up');
        this.finalScoreElement = document.getElementById('final-score');
        this.finalLevelElement = document.getElementById('final-level');
        this.newLevelElement = document.getElementById('new-level');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        
        // レベルアップ表示を自動で隠す
        this.levelUpDiv.addEventListener('click', () => this.hideLevelUp());
    }

    startGame() {
        this.isGameActive = true;
        this.startBtn.style.display = 'none';
        this.restartBtn.style.display = 'inline-block';
        this.generateNewRound();
    }

    restartGame() {
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.gridSize = 3;
        this.colorDifference = 50;
        this.updateUI();
        this.hideGameOver();
        this.startGame();
    }

    generateNewRound() {
        if (!this.isGameActive) return;

        // グリッドサイズを設定
        this.colorGrid.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        this.colorGrid.style.gridTemplateRows = `repeat(${this.gridSize}, 1fr)`;

        // 基本色を生成
        const baseColor = this.generateRandomColor();
        const differentColor = this.generateDifferentColor(baseColor);

        // 正解のタイルの位置をランダムに決定
        const totalTiles = this.gridSize * this.gridSize;
        this.correctTileIndex = Math.floor(Math.random() * totalTiles);

        // 色の配列を作成
        this.currentColors = [];
        for (let i = 0; i < totalTiles; i++) {
            this.currentColors.push(i === this.correctTileIndex ? differentColor : baseColor);
        }

        this.renderGrid();
    }

    generateRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return { r, g, b };
    }

    generateDifferentColor(baseColor) {
        const { r, g, b } = baseColor;
        
        // ランダムにR、G、Bのいずれかを変更
        const colorChannel = Math.floor(Math.random() * 3);
        const direction = Math.random() > 0.5 ? 1 : -1;
        
        let newR = r, newG = g, newB = b;
        
        switch (colorChannel) {
            case 0: // Red
                newR = Math.max(0, Math.min(255, r + (this.colorDifference * direction)));
                break;
            case 1: // Green
                newG = Math.max(0, Math.min(255, g + (this.colorDifference * direction)));
                break;
            case 2: // Blue
                newB = Math.max(0, Math.min(255, b + (this.colorDifference * direction)));
                break;
        }

        return { r: newR, g: newG, b: newB };
    }

    renderGrid() {
        this.colorGrid.innerHTML = '';
        
        this.currentColors.forEach((color, index) => {
            const tile = document.createElement('div');
            tile.className = 'color-tile';
            tile.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
            tile.addEventListener('click', () => this.handleTileClick(index));
            
            // タッチイベントも追加（スマホ対応）
            tile.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleTileClick(index);
            });
            
            this.colorGrid.appendChild(tile);
        });
    }

    handleTileClick(clickedIndex) {
        if (!this.isGameActive) return;

        const tiles = this.colorGrid.querySelectorAll('.color-tile');
        const clickedTile = tiles[clickedIndex];

        if (clickedIndex === this.correctTileIndex) {
            // 正解
            clickedTile.classList.add('correct');
            this.score += this.level * 10;
            this.updateUI();
            
            setTimeout(() => {
                this.checkLevelUp();
                this.generateNewRound();
            }, 800);
        } else {
            // 不正解
            clickedTile.classList.add('wrong');
            tiles[this.correctTileIndex].classList.add('correct');
            this.lives--;
            this.updateUI();
            
            if (this.lives <= 0) {
                setTimeout(() => this.gameOver(), 1000);
            } else {
                setTimeout(() => this.generateNewRound(), 1500);
            }
        }
    }

    checkLevelUp() {
        const newLevel = Math.floor(this.score / 100) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.showLevelUp();
            
            // 難易度を上げる
            if (this.gridSize < this.maxGridSize && this.level % 3 === 0) {
                this.gridSize++;
            }
            
            if (this.colorDifference > this.minColorDifference) {
                this.colorDifference = Math.max(this.minColorDifference, this.colorDifference - 3);
            }
        }
    }

    showLevelUp() {
        this.newLevelElement.textContent = this.level;
        this.levelUpDiv.style.display = 'block';
        
        // 3秒後に自動で隠す
        setTimeout(() => this.hideLevelUp(), 3000);
    }

    hideLevelUp() {
        this.levelUpDiv.style.display = 'none';
    }

    gameOver() {
        this.isGameActive = false;
        this.finalScoreElement.textContent = this.score;
        this.finalLevelElement.textContent = this.level;
        this.gameOverDiv.style.display = 'block';
        this.restartBtn.style.display = 'none';
        this.startBtn.style.display = 'inline-block';
        this.startBtn.textContent = '再挑戦';
    }

    hideGameOver() {
        this.gameOverDiv.style.display = 'none';
        this.startBtn.textContent = 'ゲーム開始';
    }

    updateUI() {
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
        this.livesElement.textContent = this.lives;
    }
}

// ゲーム初期化
document.addEventListener('DOMContentLoaded', () => {
    const game = new ColorGameEngine();
    
    // デバッグ情報（開発時のみ）
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🎨 色彩感覚テストゲーム - デバッグモード');
        console.log('ゲームオブジェクト:', game);
    }
});

// PWA対応（将来的な拡張用）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // サービスワーカーの登録は今回は省略
        console.log('PWA対応準備完了');
    });
}

// パフォーマンス最適化
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // ページが非表示になった時の処理
        console.log('ゲーム一時停止');
    } else {
        // ページが表示された時の処理
        console.log('ゲーム再開');
    }
});

// エラーハンドリング
window.addEventListener('error', (event) => {
    console.error('ゲームエラー:', event.error);
    // 本番環境では適切なエラー報告を実装
});

// タッチデバイスでの最適化
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // ダブルタップズームを防ぐ
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// 画面の向き変更に対応
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        // レイアウトの再計算
        window.scrollTo(0, 0);
    }, 100);
});
