export class Cannon {
    constructor(canvasWidth, canvasHeight) {
        this.x = 50;
        this.y = canvasHeight - 20;
        this.angle = -Math.PI / 4;
        this.power = 50;
        this.angleControl = document.getElementById('angle');
        this.powerControl = document.getElementById('power');

        this.angleControl.addEventListener('input', () => {
            this.angle = this.angleControl.value * Math.PI / 180;
        });

        this.powerControl.addEventListener('input', () => {
            this.power = this.powerControl.value;
        });
    }

    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, 50, 20);
    }

    update() {
        // Update cannon state
    }
}
