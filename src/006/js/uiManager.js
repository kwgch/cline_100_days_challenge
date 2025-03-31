class UIManager {
  constructor(game) {
    this.game = game;
    this.scoreElement = document.getElementById('score');
    this.livesElement = document.getElementById('lives');
    this.finalScoreElement = document.getElementById('final-score');
    this.startScreen = document.getElementById('start-screen');
    this.gameOverScreen = document.getElementById('game-over-screen');
    this.restartButton = document.getElementById('restart-button');

    this.restartButton.addEventListener('click', () => {
      this.game.start();
    });
  }

  updateScore(score) {
    this.scoreElement.textContent = score;
  }

  updateLives(lives) {
    this.livesElement.textContent = lives;
  }

  showStartScreen() {
    this.startScreen.classList.add('show');
  }

  hideStartScreen() {
    this.startScreen.classList.remove('show');
  }

  showGameOverScreen() {
    this.finalScoreElement.textContent = this.game.score;
    this.gameOverScreen.classList.add('show');
  }

  hideGameOverScreen() {
    this.gameOverScreen.classList.remove('show');
  }
}
