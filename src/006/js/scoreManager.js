class ScoreManager {
  constructor(game) {
    this.game = game;
    this.score = 0;
  }

  increaseScore(points) {
    this.score += points;
    this.game.uiManager.updateScore(this.score);
  }

  decreaseLife() {
    this.game.lives--;
    this.game.uiManager.updateLives(this.game.lives);
    if (this.game.lives <= 0) {
      this.game.gameOver = true;
      this.game.uiManager.showGameOverScreen();
    }
  }

  updateDifficulty() {
    this.game.balls.forEach(ball => {
      ball.updateProperties(this.score);
    });

    if (this.score % 200 === 0 && this.score > 0) {
      for (let i = 0; i < 2; i++) {
        this.game.addNewBall();
      }
    }
  }
}
