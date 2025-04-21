class UIManager {
    constructor() {
        this.startButton = document.getElementById('start-button');
        this.gameScreen = document.getElementById('game-screen');
        this.endScreen = document.getElementById('end-screen');
        this.finalScore = document.getElementById('final-score');
        this.restartButton = document.getElementById('restart-button');
        this.menuButton = document.getElementById('menu-button');
        this.scoreDisplay = null;
        this.timerDisplay = null;
        this.target = null;
    }

    showStartScreen() {
        this.startButton.style.display = 'block';
        this.gameScreen.style.display = 'none';
        this.endScreen.style.display = 'none';
    }

    showGameScreen() {
        this.startButton.style.display = 'none';
        this.gameScreen.style.display = 'block';
        this.endScreen.style.display = 'none';
    }

    createScoreDisplay() {
        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'score';
        this.gameScreen.appendChild(scoreDisplay);
        this.scoreDisplay = scoreDisplay;
    }

    createTimerDisplay() {
        const timerDisplay = document.createElement('div');
        timerDisplay.id = 'timer';
        this.gameScreen.appendChild(timerDisplay);
        this.timerDisplay = timerDisplay;
    }

    showEndScreen(score) {
        this.gameScreen.style.display = 'none';
        this.endScreen.style.display = 'block';
        this.finalScore.textContent = `Final Score: ${score}`;
    }

    updateScore(score) {
        this.scoreDisplay.textContent = `Score: ${score}`;
    }

    updateTimer(time) {
        this.timerDisplay.textContent = `Time: ${time}`;
    }

    updateScore(score) {
        this.scoreDisplay.textContent = `Score: ${score}`;
    }
}

export default UIManager;
