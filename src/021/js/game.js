class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.fireworks = [];
        this.particles = [];
        this.score = 0;
        this.scoreElement = document.getElementById('score');
        this.missedFireworks = 3;
        this.missedElement = document.getElementById('missed');
        this.gameOver = false;
        
        // キャンバスサイズの設定
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // タッチイベントとクリックイベントの設定
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleTouch(e));
        
        // ゲームループの開始
        this.lastTime = 0;
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        
        // 定期的に花火を発射
        setInterval(() => this.launchFirework(), 500);
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    launchFirework() {
        const x = Math.random() * this.canvas.width;
        const speedY = -100 - Math.random() * 5; // 上向きの初速度
        this.fireworks.push(new Firework(x, this.canvas.height, speedY));
    }
    
    handleTouch(e) {
        e.preventDefault();
        let x, y;
        const rect = this.canvas.getBoundingClientRect();
        
        if (e.type === 'touchstart') {
            const touch = e.touches[0];
            x = touch.clientX - rect.left;
            y = touch.clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }

        // タップした位置に近い花火を探す
        for (let i = 0; i < this.fireworks.length; i++) {
            const firework = this.fireworks[i];
            const distance = Math.sqrt((x - firework.x) ** 2 + (y - firework.y) ** 2);
            // if (distance < firework.radius * 4) {
            if (distance < firework.radius * 10) {
                this.explodeFirework(firework.x, firework.y, firework.color);
                this.fireworks.splice(i, 1);
                this.score += 10;
                this.scoreElement.innerText = this.score;
                if (this.score >= 1000) {
                    this.gameOver = true;
                    document.getElementById('game-clear').style.display = 'block';
                    return;
                }
                break;
            }
        }
    }
    
    explodeFirework(x, y, color) {
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5;
            const particle = new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color);
            this.particles.push(particle);
        }
    }
    
    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // 画面のクリア
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 花火の更新と描画
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const firework = this.fireworks[i];
            firework.update(deltaTime / 1000);
            firework.draw(this.ctx);
            
            // 画面外に出た花火を削除
            if (firework.y > this.canvas.height) {
                this.fireworks.splice(i, 1);
                this.missedFireworks--;
                this.missedElement.innerText = this.missedFireworks;
                if (this.missedFireworks <= 0) {
                    this.gameOver = true;
                    document.getElementById('game-over').style.display = 'block';
                    return;
                }
            } else if (firework.exploded) {
                this.fireworks.splice(i, 1);
            }
        }
        
        // パーティクルの更新と描画
        if (!this.gameOver) {
            for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(deltaTime / 1000);
            particle.draw(this.ctx);
            
            // 寿命が尽きたパーティクルを削除
            if (particle.alpha < 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // スコアの更新
        this.scoreElement.innerText = this.score;
        }
        
        // アニメーションの継続
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
}

// ゲーム開始
window.onload = () => {
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        new Game();
    });
};
