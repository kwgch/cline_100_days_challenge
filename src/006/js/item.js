class Item {
  constructor(x, y, game) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.speed = 1;
    this.game = game;
    this.type = this.randomItemType();
    this.color = this.getItemColor();
    this.removed = false;
  }

  update() {
    this.y += this.speed;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.font = '14px Comic Sans MS';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(this.getItemSymbol(), this.x, this.y + 5);
  }

  randomItemType() {
    const itemTypes = ['heart', 'expand', 'shrink'];
    const weights = [0.03, 0.03, 0.03]; // Probabilities for each item type
    let random = Math.random();
    for (let i = 0; i < itemTypes.length; i++) {
      random -= weights[i];
      if (random < 0) {
        return itemTypes[i];
      }
    }
    return 'heart'; // Default to heart if something goes wrong
  }

  getItemColor() {
    switch (this.type) {
      case 'heart':
        return 'red';
      case 'expand':
        return 'green';
      case 'shrink':
        return 'blue';
      default:
        return 'black';
    }
  }

  getItemSymbol() {
    switch (this.type) {
      case 'heart':
        return '♡';
      case 'expand':
        return '拡';
      case 'shrink':
        return '縮';
      default:
        return '?';
    }
  }

  remove() {
    this.removed = true;
  }
}
