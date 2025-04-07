import Board from './Board.js';

class Game {
  constructor() {
    this.board = new Board();
    this.moveCount = 0;
    this.startTime = null;
    this.elapsedTime = 0;
    this.timerInterval = null;
    this.isGameOver = false;
  }
  
  init() {
    this.board.initialize();
    this.moveCount = 0;
    this.startTime = null;
    this.elapsedTime = 0;
    this.timerInterval = null;
    this.isGameOver = false;
  }
  
  moveTile(row, col) {
    if (this.isGameOver) {
      return false;
    }
    
    if (!this.startTime) {
      this.startTimer();
    }
    
    const moveResult = this.board.moveTile(row, col);
    
    if (moveResult) {
      this.moveCount++;
      
      if (this.board.isSolved()) {
        this.gameOver();
      }
      
      return moveResult;
    }
    
    return false;
  }
  
  checkWinCondition() {
    return this.board.isSolved();
  }
  
  startTimer() {
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      this.updateTimerDisplay();
    }, 1000);
  }
  
  stopTimer() {
    clearInterval(this.timerInterval);
  }
  
  gameOver() {
    this.isGameOver = true;
    this.stopTimer();
    this.saveScore();
  }
  
  saveScore() {
    // TODO: Implement local storage for high scores
  }
  
  getHighScores() {
    // TODO: Implement local storage for high scores
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.elapsedTime / (1000 * 60));
    const seconds = Math.floor((this.elapsedTime % (1000 * 60)) / 1000);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer').innerText = formattedTime;
  }
}

export default Game;
