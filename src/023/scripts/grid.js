class Grid {
  constructor(width, height, cellSize) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.grid = [];
  }

  initialize() {
    this.grid = Array(this.height).fill(null).map(() => Array(this.width).fill(0));
  }

  getCell(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.grid[y][x];
    }
    return 0;
  }

  setCell(x, y, state) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x] = state;
    }
  }

  clear() {
    this.initialize();
  }

  randomize(density) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.grid[y][x] = Math.random() < density ? 1 : 0;
      }
    }
  }

  nextGeneration(ruleEngine) {
    const nextGrid = Array(this.height).fill(null).map(() => Array(this.width).fill(0));

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        nextGrid[y][x] = ruleEngine.applyRules(this, x, y);
      }
    }

    this.grid = nextGrid;
  }

  countNeighbors(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        count += this.getCell(x + j, y + i);
      }
    }
    return count;
  }

  render(canvas, colorMode) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x] === 1) {
          ctx.fillStyle = colorMode === 'rainbow' ? `hsl(${(x + y) * 10 % 360}, 100%, 50%)` : '#000';
          ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
        }
      }
    }
  }
}
