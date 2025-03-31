import Entity from './Entity.js';

class Invader extends Entity {
  constructor(x, y, width, height, color) {
    super(x, y, width, height);
    this.color = color;
    this.speed = 1;
    this.direction = 1; // 1 = right, -1 = left
  }

  update() {
    this.x += this.speed * this.direction;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Invader;
