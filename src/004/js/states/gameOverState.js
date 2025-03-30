import { GameState } from './gameState.js';

export class GameOverState extends GameState {
  constructor(gameManager, winner) {
    super(gameManager);
    this.winner = winner;
  }

  onEnter() {
    console.log('Game Over! Winner: ' + this.winner);
    this.gameManager.eventEmitter.emit('gameOver', this.winner);
  }

  handleBoardClick(position) {
    // Game is over, no further moves allowed
    return false;
  }

  handlePieceSelection(piece) {
    // Game is over, no further piece selection allowed
    return false;
  }
}
