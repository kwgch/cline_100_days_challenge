import Entity from './Entity.js';

class Player extends Entity {
  constructor(x, y, width, height, color) {
    super(x, y, width, height);
    this.color = color;
    this.speed = 5;
  }

  update() {
    // TODO: Implement player movement and shooting logic
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Player;
