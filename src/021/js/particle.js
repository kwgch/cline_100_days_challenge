class Particle {
    constructor(x, y, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
        this.alpha = 1; // 透明度
        this.decay = 0.02 + Math.random() * 0.03; // 透明度の減衰率
        this.gravity = 0.5; // パーティクルへの重力
    }
    
    update(deltaTime) {
        // 位置の更新
        this.x += this.speedX * deltaTime * 60;
        this.y += this.speedY * deltaTime * 60;
        
        // 重力の影響
        this.speedY += this.gravity * deltaTime;
        
        // 透明度の減衰
        this.alpha -= this.decay * deltaTime * 60;
        if (this.alpha < 0) this.alpha = 0;
    }
    
    draw(ctx) {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}
