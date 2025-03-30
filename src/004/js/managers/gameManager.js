import { PieceFactory } from '../factories/pieceFactory.js';
import { Board } from '../models/board.js';
import { EventEmitter } from '../utils/eventEmitter.js';
import { InitialState } from '../states/gameState.js';
import { GameOverState } from '../states/gameOverState.js';

export class GameManager {
  constructor() {
    if (GameManager.instance) {
      return GameManager.instance;
    }
    
    this.board = PieceFactory.createInitialBoard();
    this.currentState = new InitialState(this);
    this.eventEmitter = new EventEmitter();
    this.player1Captured = [];
    this.player2Captured = [];
    this.moveCount = 0;
    
    GameManager.instance = this;
  }
  
  changeState(newState) {
    this.currentState = newState;
    this.currentState.onEnter();
    this.eventEmitter.emit('stateChanged', newState);
  }
  
  incrementMoveCount() {
    this.moveCount++;
    this.eventEmitter.emit('moveCountUpdated', this.moveCount);
  }

  capturePiece(piece) {
    if (piece.player === 'player1') {
      this.player2Captured.push(piece);
    } else {
      this.player1Captured.push(piece);
    }
    this.eventEmitter.emit('capturedPiecesUpdated', { player1Captured: this.player1Captured, player2Captured: this.player2Captured });

    if (piece.constructor.name === 'King') {
      const winner = piece.player === 'player1' ? 'player2' : 'player1';
      this.changeState(new GameOverState(this, winner));
    }
  }
  
  // その他のゲーム管理メソッド
}
