class Firework {
    constructor(x, y, speedY) {
        this.x = x;
        this.y = y;
        this.speedX = (Math.random() - 0.5) * 3; // 左右のランダムな速度
        this.speedY = speedY;
        this.gravity = 15; // 重力加速度
        this.radius = 5;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.exploded = false;
    }
    
    update(deltaTime) {
        // 位置の更新
        this.x += this.speedX * deltaTime * 3;
        this.y += this.speedY * deltaTime * 3;
        
        // 速度の更新（重力の影響）
        this.speedY += this.gravity * deltaTime;
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    
    explode(particles) {
        // 爆発時にパーティクルを生成
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3;
            const particle = new Particle(
                this.x,
                this.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                this.color
            );
            particles.push(particle);
        }
        this.exploded = true;
    }
}
