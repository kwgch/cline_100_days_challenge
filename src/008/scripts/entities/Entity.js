class Entity {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  update() {
    // Abstract method
  }

  draw(ctx) {
    // Abstract method
  }
}

export default Entity;
