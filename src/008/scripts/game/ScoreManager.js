class ScoreManager {
  constructor() {
    this.score = 0;
  }

  getScore() {
    return this.score;
  }

  addScore(points) {
    this.score += points;
  }

  resetScore() {
    this.score = 0;
  }
}

export default ScoreManager;
