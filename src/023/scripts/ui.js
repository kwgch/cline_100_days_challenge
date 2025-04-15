class UIController {
  constructor(grid, ruleEngine) {
    this.grid = grid;
    this.ruleEngine = ruleEngine;
    this.isRunning = false;
    this.animationFrameId = null;
    this.speed = 10; // FPS
  }

  initializeControls() {
    this.startButton = document.getElementById('startButton');
    this.stopButton = document.getElementById('stopButton');
    this.stepButton = document.getElementById('stepButton');
    this.clearButton = document.getElementById('clearButton');
    this.randomizeButton = document.getElementById('randomizeButton');
    this.speedSlider = document.getElementById('speedSlider');
    this.canvas = document.getElementById('gameCanvas');

    this.startButton.addEventListener('click', () => this.start());
    this.stopButton.addEventListener('click', () => this.stop());
    this.stepButton.addEventListener('click', () => this.step());
    this.clearButton.addEventListener('click', () => this.clear());
    this.randomizeButton.addEventListener('click', () => this.randomize());
    this.speedSlider.addEventListener('input', () => this.updateSpeed());

    this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));

    this.updateSpeed();
    this.generation = 0;
    this.generationElement = document.getElementById('generation');
    this.livingCellsElement = document.getElementById('livingCells');
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }
  }

  stop() {
    if (this.isRunning) {
      this.isRunning = false;
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  step() {
    this.grid.nextGeneration(this.ruleEngine);
    this.grid.render(this.canvas, 'rainbow');
    this.generation++;
    this.updateStatistics();
  }

  clear() {
    this.grid.clear();
    this.grid.render(this.canvas, 'rainbow');
  }

  randomize() {
    this.grid.randomize(0.5);
    this.grid.render(this.canvas, 'rainbow');
  }

  updateSpeed() {
    this.speed = this.speedSlider.value;
  }

  gameLoop() {
    if (!this.isRunning) return;

    this.step();

    setTimeout(() => {
      this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }, 1000 / this.speed);
  }

  updateStatistics() {
    let livingCells = 0;
    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        if (this.grid.getCell(x, y) === 1) {
          livingCells++;
        }
      }
    }

    this.generationElement.textContent = this.generation;
    this.livingCellsElement.textContent = livingCells;
  }

  handleCanvasClick(e) {
    const x = Math.floor(e.offsetX / this.grid.cellSize);
    const y = Math.floor(e.offsetY / this.grid.cellSize);
    const currentState = this.grid.getCell(x, y);
    this.grid.setCell(x, y, currentState === 0 ? 1 : 0);
    this.grid.render(this.canvas, 'rainbow');
  }
}
