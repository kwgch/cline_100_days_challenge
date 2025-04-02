class GameStateModel {
    constructor() {
        this.startTime = null;
        this.elapsedTime = 0;
        this.isRunning = false;
        this.mistakes = 0;
        this.hintsUsed = 0;
    }

    startTimer() {
        this.startTime = Date.now() - this.elapsedTime;
        this.isRunning = true;
    }

    stopTimer() {
        this.isRunning = false;
        this.elapsedTime = Date.now() - this.startTime;
    }

    resetGame() {
        this.startTime = null;
        this.elapsedTime = 0;
        this.isRunning = false;
        this.mistakes = 0;
        this.hintsUsed = 0;
    }
}

export { GameStateModel };
