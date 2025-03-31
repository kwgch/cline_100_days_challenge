class Ball {
  constructor(x, y, game) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.baseSpeed = 2;
    this.speed = this.baseSpeed + Math.random() * 1.5;
    this.game = game;
    this.hueOffset = Math.random() * 360;
    this.color = this.getColorByScore(0);
    this.baseSize = 15;
    this.minSize = 5;
  }

  update(deltaTime) {
    this.y += this.speed;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  reset() {
    this.y = 0;
    this.x = Math.random() * this.game.canvas.width;
    this.speed = this.baseSpeed + Math.random() * 1.5;
    this.radius = this.baseSize;
    this.updateProperties(this.game.score);
  }

  updateProperties(score) {
    this.baseSpeed = 2 * (1 + Math.floor(score / 200) * 0.1);
    this.speed = this.baseSpeed + Math.random() * 1.5;
    this.radius = Math.max(this.baseSize * (1 - Math.floor(score / 500) * 0.05), this.minSize);
    this.color = this.getColorByScore(score);
  }

  getColorByScore(score) {
    const hue = Math.floor(score * 2) % 360; // Cycle through hues
    return `hsl(${(hue + this.hueOffset) % 360}, 70%, 80%)`; // Pastel colors
  }
}
