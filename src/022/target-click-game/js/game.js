class GameManager {
    constructor(difficulty = 'normal') {
        this.score = 0;
        this.timeLeft = 30;
        this.gameInterval = null;
        this.difficulty = difficulty;
    }

    startGame() {
        this.score = 0;
        this.timeLeft = 30;
        this.updateScoreDisplay(this.score);
        this.updateTimerDisplay(this.timeLeft);

        this.gameInterval = setInterval(() => this.updateTimer(), 1000);
        this.moveTarget();
    }

    endGame() {
        clearInterval(this.gameInterval);
        this.timeLeft = 30;
    }

    updateTimer() {
        this.timeLeft--;
        this.updateTimerDisplay(this.timeLeft);

        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }

    updateScoreDisplay() {
        document.getElementById('score').textContent = `Score: ${this.score}`;
    }

    updateTimerDisplay() {
        document.getElementById('timer').textContent = `Time: ${this.timeLeft}`;
    }

    targetClicked() {
        this.score++;
        this.updateScoreDisplay(this.score);
        this.moveTarget();
    }

    moveTarget() {
        const targetElement = document.getElementById('target');
        const gameScreen = document.getElementById('game-screen');
        const targetWidth = targetElement.offsetWidth;
        const targetHeight = targetElement.offsetHeight;
        const gameWidth = gameScreen.offsetWidth;
        const gameHeight = gameScreen.offsetHeight;

        let randomX = Math.random() * (gameWidth - targetWidth);
        let randomY = Math.random() * (gameHeight - targetHeight);

        randomX = Math.max(0, Math.min(randomX, gameWidth - targetWidth));
        randomY = Math.max(0, Math.min(randomY, gameHeight - targetHeight));

        targetElement.style.left = `${randomX}px`;
        targetElement.style.top = `${randomY}px`;
    }
}

export default GameManager;
