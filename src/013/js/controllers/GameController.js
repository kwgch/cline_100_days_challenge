import Game from '../models/Game.js';
import BoardView from '../views/BoardView.js';
import UIView from '../views/UIView.js';
import Tile from '../models/Tile.js';

class GameController {
  constructor() {
    this.game = new Game();
    this.boardView = null;
    this.uiView = null;
  }
  
  initialize() {
    this.boardView = new BoardView(document.getElementById('board'), this);
    this.uiView = new UIView(this);
    this.uiView.initialize();
    this.uiView.solveButton = document.getElementById('solve-button'); // Get solve button
    this.uiView.solveButton.addEventListener('click', () => { // Add event listener
      this.handleAlmostSolve();
    });
    this.startNewGame();
  }

  startNewGame() {
    this.game.init();
    this.boardView.initialize(this.game.board);
    this.uiView.updateMoveCount(this.game.moveCount);
  }
  handleTileClick(row, col) {
    const moveResults = this.game.moveTile(row, col);
    if (moveResults) {
      moveResults.forEach(moveResult => {
        this.boardView.updateTilePosition(moveResult);
      });
      this.uiView.updateMoveCount(this.game.moveCount);
      if (this.game.checkWinCondition()) {
        this.uiView.showGameClearMessage(this.game.moveCount, document.getElementById('timer').innerText);
      }
    }
  }
  
  handleReset() {
    this.game.stopTimer();
    this.startNewGame();
  }

  handleAlmostSolve() {
    const board = this.game.board;
    const size = board.size;

    // Create a solved board
    let numbers = Array.from({ length: 15 }, (_, i) => i + 1);
    let k = 0;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i === size - 1 && j === size - 1) {
          board.tiles[i][j] = null;
          board.emptyPos = { row: i, col: j };
        } else {
          board.tiles[i][j] = new Tile(numbers[k], i, j);
          k++;
        }
      }
    }

    // Swap two adjacent tiles to create an almost solved state
    let tile1 = board.tiles[size - 1][size - 2];
    let tile2 = board.tiles[size - 1][size - 3];

    if (tile1 && tile2) {
      // Swap the tiles
      let temp = board.tiles[size - 1][size - 2];
      board.tiles[size - 1][size - 2] = board.tiles[size - 1][size - 3];
      board.tiles[size - 1][size - 3] = temp;

      // Update the tile objects' positions
      let tempCol = tile1.col;
      tile1.col = tile2.col;
      tile2.col = tempCol;
    }

    this.boardView.initialize(board);
  }
  
  updateGameState() {
    // TODO: Implement game state updates
  }

  handleAlmostSolve() {
    const board = this.game.board;
    const size = board.size;

    // Create a solved board
    let numbers = Array.from({ length: 15 }, (_, i) => i + 1);
    let k = 0;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i === size - 1 && j === size - 1) {
          board.tiles[i][j] = null;
          board.emptyPos = { row: i, col: j };
        } else {
          board.tiles[i][j] = new Tile(numbers[k], i, j);
          k++;
        }
      }
    }

    // Swap two adjacent tiles to create an almost solved state
    let tile1 = board.tiles[size - 1][size - 2];
    let tile2 = board.tiles[size - 1][size - 3];

    if (tile1 && tile2) {
      // Swap the tiles
      let temp = board.tiles[size - 1][size - 2];
      board.tiles[size - 1][size - 2] = board.tiles[size - 1][size - 3];
      board.tiles[size - 1][size - 3] = temp;

      // Update the tile objects' positions
      let tempCol = tile1.col;
      tile1.col = tile2.col;
      tile2.col = tempCol;
    }

    this.boardView.initialize(board);
  }
  
  updateGameState() {
    // TODO: Implement game state updates
  }

  handleAlmostSolve() {
    // Create a solved board
    let numbers = Array.from({ length: 15 }, (_, i) => i + 1);
    let solvedBoard = Array(4).fill(null).map(() => Array(4).fill(null));
    let k = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i === 3 && j === 3) {
          solvedBoard[i][j] = null;
        } else {
          let tile = new Tile(numbers[k], i, j);
          solvedBoard[i][j] = tile;
          k++;
        }
      }
    }

    // Swap two adjacent tiles to create an almost solved state
    let tile1 = solvedBoard[3][2];
    let tile2 = solvedBoard[3][1];

    // Check if tiles exist before swapping
    if (tile1 && tile2) {
      // Swap the tiles
      let temp = solvedBoard[3][2];
      solvedBoard[3][2] = solvedBoard[3][1];
      solvedBoard[3][1] = temp;

      // Update the tile objects' positions
      let tempCol = tile1.col;
      let tempRow = tile1.row;
      tile1.col = tile2.col;
      tile1.row = tile2.row;
      tile2.col = tempCol;
      tile2.row = tempRow;
    }

    this.game.board.tiles = solvedBoard;
    this.game.board.emptyPos = {row:3, col:3};
    this.boardView.initialize(this.game.board);
  }
  
  updateGameState() {
    // TODO: Implement game state updates
  }
}

export default GameController;
