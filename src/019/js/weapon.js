class Weapon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 10;
        this.speed = 300;
    }

    update(deltaTime) {
        this.x += this.speed * deltaTime / 1000;
    }

    render(ctx) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
