import { Board } from './models/board.js';
import { Piece } from './models/piece.js';
import { PieceFactory } from './factories/pieceFactory.js';
import { GameManager } from './managers/gameManager.js';
import { InitialState } from './states/gameState.js';
import { GameOverState } from './states/gameOverState.js';
import { EventEmitter } from './utils/eventEmitter.js';
import { BoardView } from './views/boardView.js';
import { Player1TurnState, Player2TurnState } from './states/playerTurnState.js';

// Initialize game components
const gameManager = new GameManager();
const boardView = new BoardView(gameManager);

gameManager.eventEmitter.on('check', (player) => {
  boardView.displayCheck(player);
});

gameManager.eventEmitter.on('gameOver', (winner) => {
  boardView.displayGameOver(winner);
});

// Start the game
const initialState = new InitialState(gameManager);
gameManager.changeState(initialState);

console.log('Shogi game initialized.');
