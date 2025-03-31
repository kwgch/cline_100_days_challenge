import Entity from './Entity.js';

class Bullet extends Entity {
  constructor(x, y, width, height, color, isPlayerBullet) {
    super(x, y, width, height);
    this.color = color;
    this.speed = 10;
    this.isPlayerBullet = isPlayerBullet;
  }

  update() {
    this.y += this.isPlayerBullet ? -this.speed : this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Bullet;
