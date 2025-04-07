export class Projectile {
    constructor(x, y, angle, power) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.power = power;
        this.velocityX = Math.cos(this.angle) * this.power;
        this.velocityY = Math.sin(this.angle) * this.power;
        this.gravity = 2;
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.velocityY += this.gravity;
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
}
