export class Target {
    constructor(canvasWidth, canvasHeight) {
        this.x = canvasWidth - 50;
        this.y = canvasHeight - 50;
        this.width = 30;
        this.height = 50;
    }

    draw(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        // Update target state
    }
}
