class StorageManager {
    constructor() {
        this.highScoreKey = 'highScore';
    }

    getHighScore() {
        const highScore = localStorage.getItem(this.highScoreKey);
        return highScore ? parseInt(highScore) : 0;
    }

    setHighScore(score) {
        localStorage.setItem(this.highScoreKey, score.toString());
    }

    updateHighScore(score) {
        const highScore = this.getHighScore();
        if (score > highScore) {
            this.setHighScore(score);
            return true;
        }
        return false;
    }
}

export default StorageManager;
