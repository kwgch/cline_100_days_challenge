class Catcher {
  constructor(x, y, game) {
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 15;
    this.color = '#FF69B4';
    this.game = game;
    this.originalWidth = 80;
    this.sizeChangeTimer = null;

    this.handleTouchMove = this.handleTouchMove.bind(this);
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
  }

  update() {
    // Keep the catcher within the bounds of the canvas
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width > this.game.canvas.width) {
      this.x = this.game.canvas.width - this.width;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  handleMouseMove(event) {
    this.x = event.clientX - this.game.canvas.offsetLeft - this.width / 2;
  }

  handleTouchMove(event) {
    event.preventDefault();
    const touch = event.touches[0];
    this.x = touch.clientX - this.game.canvas.offsetLeft - this.width / 2;
  }

  expand() {
    this.width *= 1.2;
    this.startSizeChangeTimer();
  }

  shrink() {
    this.width *= 0.8;
    this.startSizeChangeTimer();
  }

  startSizeChangeTimer() {
    clearTimeout(this.sizeChangeTimer);
    this.sizeChangeTimer = setTimeout(() => {
      this.resetSize();
    }, 30000); // 30 seconds
  }

  resetSize() {
    this.width = this.originalWidth;
  }
}
