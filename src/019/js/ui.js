class UIManager {
    constructor(game) {
        this.game = game;
    }

    updateScore(score) {
        this.score = score;
    }

    updateLives(lives) {
        this.lives = lives;
    }

    render(ctx) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Score: ' + this.score, 10, 40);
        ctx.fillText('Lives: ' + this.lives, 10, 70);
    }

    showGameOver(ctx) {
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', this.game.canvas.width / 2, this.game.canvas.height / 2);
    }
}
