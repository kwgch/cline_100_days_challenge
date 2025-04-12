class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.speed = Math.random() * 150 + 50; // Random speed between 50 and 200
    }

    update(deltaTime) {
        this.x -= this.speed * deltaTime / 1000;
    }

   render(ctx) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y + this.height / 2); // Nose of the jet
        ctx.lineTo(this.x + this.width / 1.5, this.y); // Top wing
        ctx.lineTo(this.x, this.y + this.height / 3); // Right side
        ctx.lineTo(this.x, this.y + this.height * (2/3)); // Bottom left
        ctx.lineTo(this.x + this.width / 1.5, this.y + this.height); // Bottom wing
	    ctx.lineTo(this.x + this.width / 1.5, this.y + this.height / 3); // Left wing
        ctx.closePath();
        ctx.fill();
    }
}
