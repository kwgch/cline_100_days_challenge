export class Target {
    constructor(canvasWidth, canvasHeight, cannonX) {
        this.width = 30;
        this.height = 50;
        this.x = Math.random() * (canvasWidth - this.width - cannonX - 100) + cannonX + 100;
        this.y = canvasHeight - 50;
    }

    draw(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        // Update target state
    }
}
