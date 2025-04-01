class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    // Set canvas dimensions based on screen size
    this.canvas.width = Math.min(window.innerWidth, 480); // Maximum width of 480px
    this.canvas.height = Math.min(window.innerHeight, 320); // Maximum height of 320px

    this.score = 0;
    this.lives = 3;
    this.balls = [];
    this.items = [];
    this.catcher = new Catcher(this.canvas.width / 2, this.canvas.height - 30, this);
    this.scoreManager = new ScoreManager(this);
    this.uiManager = new UIManager(this);
    this.gameOver = false;
    this.lastTime = 0;

    this.init();
  }

  init() {
    this.uiManager.showStartScreen();
    document.getElementById('start-button').addEventListener('click', () => {
      this.uiManager.hideStartScreen();
      this.start();
    });
  }

  start() {
    this.score = 0;
    this.lives = 3;
    this.balls = [];
    for (let i = 0; i < 3; i++) {
      this.balls.push(new Ball(Math.random() * this.canvas.width, 30, this));
    }
    this.gameOver = false;
    this.uiManager.updateScore(this.score);
    this.uiManager.updateLives(this.lives);
    this.uiManager.hideGameOverScreen();
    this.catcher.resetSize();

    this.gameLoop(0);
  }

  addNewBall() {
    this.balls.push(new Ball(Math.random() * this.canvas.width, 30, this));
  }

  update(deltaTime) {
    this.catcher.update();
    this.balls.forEach(ball => {
      ball.update(deltaTime);
      if (ball.y > this.canvas.height) {
        this.lives--;
        this.uiManager.updateLives(this.lives);
        ball.reset();
        if (this.lives <= 0) {
          this.gameOver = true;
          this.uiManager.showGameOverScreen();
        }
      }

      if (this.checkCollision(ball, this.catcher)) {
        this.score += 10;
        this.uiManager.updateScore(this.score);
        ball.reset();
        this.scoreManager.updateDifficulty();
      }
    });

    if (Math.random() < 0.001) {
      this.items.push(new Item(Math.random() * this.canvas.width, 30, this));
    }

    this.items.forEach(item => {
      item.update();
      if (this.checkCollision(item, this.catcher)) {
        this.applyItemEffect(item);
        item.remove();
      }
    });

    this.items = this.items.filter(item => !item.removed);
  }

  checkCollision(object, catcher) {
    if (object.y + object.radius >= catcher.y &&
      object.x >= catcher.x &&
      object.x <= catcher.x + catcher.width) {
      return true;
    }
    return false;
  }

  applyItemEffect(item) {
    switch (item.type) {
      case 'heart':
        this.lives = Math.min(this.lives + 1, 5);
        this.uiManager.updateLives(this.lives);
        break;
      case 'expand':
        this.catcher.expand();
        break;
      case 'shrink':
        this.catcher.shrink();
        break;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.catcher.draw(this.ctx);
    this.balls.forEach(ball => ball.draw(this.ctx));
    this.items.forEach(item => item.draw(this.ctx));
  }

  gameLoop(timestamp) {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.update(deltaTime);
    this.draw();

    if (!this.gameOver) {
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }
}

const game = new Game('game-canvas');
