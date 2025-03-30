import { PieceFactory } from '../factories/pieceFactory.js';
import { GameOverState } from '../states/gameOverState.js';

export class BoardView {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.element = document.getElementById('shogi-board');
    this.selectedPiece = null;
    this.highlightedCells = [];
    
    this.gameManager.eventEmitter.on('boardUpdated', () => this.render());
    this.gameManager.eventEmitter.on('turnChanged', (player) => this.updateTurnDisplay(player));
    this.gameManager.eventEmitter.on('moveCountUpdated', (count) => this.updateMoveCount(count));
    this.gameManager.eventEmitter.on('capturedPiecesUpdated', (pieces) => this.updateCapturedPieces(pieces));
    
    this.initBoard();
  }
  
  initBoard() {
    // 9x9のグリッドを作成
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const cell = document.createElement('div');
        cell.dataset.x = x;
        cell.dataset.y = y;
        cell.addEventListener('click', this.handleCellClick.bind(this, x, y));
        this.element.appendChild(cell);
      }
    }
    this.render();
  }
  
  render() {
    // 盤面の状態に応じてセルを更新
    const board = this.gameManager.board;
    
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const cell = this.getCellElement(x, y);
        const piece = board.getPieceAt({x, y});
        cell.textContent = piece ? this.getPieceSymbol(piece) : '';
        cell.className = 'cell'; // Reset classes
        if (piece) {
          cell.classList.add(piece.player); // Add player class
        }
      }
    }
  }

  updateCapturedPieces(pieces) {
    const player1CapturedElement = document.getElementById('player1-captured');
    const player2CapturedElement = document.getElementById('player2-captured');

    player1CapturedElement.innerHTML = '';
    player2CapturedElement.innerHTML = '';

    pieces.player1Captured.forEach(piece => {
      const pieceElement = document.createElement('div');
      pieceElement.className = `piece ${piece.player} ${piece.constructor.name.toLowerCase()}`;
      pieceElement.textContent = this.getPieceSymbol(piece);
      player1CapturedElement.appendChild(pieceElement);
    });
    
    pieces.player2Captured.forEach(piece => {
      const pieceElement = document.createElement('div');
      pieceElement.className = `piece ${piece.player} ${piece.constructor.name.toLowerCase()}`;
      pieceElement.textContent = this.getPieceSymbol(piece);
      player2CapturedElement.appendChild(pieceElement);
    });
  }
  
  highlightValidMoves(moves, player) {
    // 移動可能なセルをハイライト
    this.clearHighlights();
    
    moves.forEach(move => {
      const cell = this.getCellElement(move.x, move.y);
      cell.classList.add('highlighted');
      cell.classList.add(player + '-highlight');
      this.highlightedCells.push(cell);
    });
  }
  
  clearHighlights() {
    this.highlightedCells.forEach(cell => {
      cell.classList.remove('highlighted');
    });
    this.highlightedCells = [];
  }
  
  handleCellClick(x, y) {
    const clickedPiece = this.gameManager.board.getPieceAt({x, y});

    console.log('handleCellClick: x=', x, 'y=', y, 'selectedPiece=', this.selectedPiece);
    
    if (this.selectedPiece) {
      console.log('handleCellClick: Attempting to move selectedPiece, selectedPiece=', this.selectedPiece);
      // 駒が選択されている場合、移動を試みる
      if (this.gameManager.currentState.handleBoardClick({x, y}, this.selectedPiece)) {
        console.log('handleCellClick: Move successful, clearing selectedPiece');
        this.selectedPiece = null;
        this.clearHighlights();
      }
    } else if (clickedPiece && this.gameManager.currentState.handlePieceSelection(clickedPiece)) {
      console.log('handleCellClick: Selecting new piece');
      // 新しい駒を選択
      this.selectedPiece = clickedPiece;
      const validMoves = clickedPiece.getValidMoves(this.gameManager.board);
      this.highlightValidMoves(validMoves, clickedPiece.player);
    } else {
      console.log('handleCellClick: Invalid selection, clearing selectedPiece');
      this.selectedPiece = null;
      this.clearHighlights();
    }
  }
  
  getCellElement(x, y) {
    return this.element.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  }
  
  getPieceSymbol(piece) {
    // 駒の種類に応じた日本語表記を返す
    const symbols = {
      King: '王',
      Rook: '飛',
      Bishop: '角',
      Gold: '金',
      Silver: '銀',
      Knight: '桂',
      Lance: '香',
      Pawn: '歩'
    };
    
    let symbol = symbols[piece.constructor.name];
    if (piece.promoted) {
      if (piece.constructor.name === 'Rook') return '龍';
      if (piece.constructor.name === 'Bishop') return '馬';
      return '成' + symbol;
    }
    return symbol;
  }
  
  updateTurnDisplay(player) {
    const turnDisplay = document.getElementById('turn-display');
    turnDisplay.textContent = `現在の手番: ${player === 'player1' ? 'プレイヤー1' : 'プレイヤー2'}`;
  }

  displayCheck(player) {
    const checkDisplay = document.getElementById('check-display');
    checkDisplay.textContent = `王手！: ${player === 'player1' ? 'プレイヤー1' : 'プレイヤー2'}`;
  }

  displayGameOver(winner) {
    const gameOverDisplay = document.getElementById('game-over-display');
    gameOverDisplay.textContent = `ゲーム終了！ 勝者: ${winner === 'player1' ? 'プレイヤー1' : 'プレイヤー2'}`;
  }

  handleCellClick(x, y) {
    if (this.gameManager.currentState instanceof GameOverState) {
      return; // Prevent further moves after game over
    }

    const clickedPiece = this.gameManager.board.getPieceAt({x, y});

    console.log('handleCellClick: x=', x, 'y=', y, 'selectedPiece=', this.selectedPiece);
    
    if (this.selectedPiece) {
      console.log('handleCellClick: Attempting to move selectedPiece, selectedPiece=', this.selectedPiece);
      // 駒が選択されている場合、移動を試みる
      if (this.gameManager.currentState.handleBoardClick({x, y}, this.selectedPiece)) {
        console.log('handleCellClick: Move successful, clearing selectedPiece');
        this.selectedPiece = null;
        this.clearHighlights();
      }
    } else if (clickedPiece && this.gameManager.currentState.handlePieceSelection(clickedPiece)) {
      console.log('handleCellClick: Selecting new piece');
      // 新しい駒を選択
      this.selectedPiece = clickedPiece;
      const validMoves = clickedPiece.getValidMoves(this.gameManager.board);
      this.highlightValidMoves(validMoves, clickedPiece.player);
    } else {
      console.log('handleCellClick: Invalid selection, clearing selectedPiece');
      this.selectedPiece = null;
      this.clearHighlights();
    }
  }
  
  getCellElement(x, y) {
    return this.element.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  }
  
  getPieceSymbol(piece) {
    // 駒の種類に応じた日本語表記を返す
    const symbols = {
      King: '王',
      Rook: '飛',
      Bishop: '角',
      Gold: '金',
      Silver: '銀',
      Knight: '桂',
      Lance: '香',
      Pawn: '歩'
    };
    
    let symbol = symbols[piece.constructor.name];
    if (piece.promoted) {
      if (piece.constructor.name === 'Rook') return '龍';
      if (piece.constructor.name === 'Bishop') return '馬';
      return '成' + symbol;
    }
    return symbol;
  }
  
  updateTurnDisplay(player) {
    const turnDisplay = document.getElementById('turn-display');
    turnDisplay.textContent = `現在の手番: ${player === 'player1' ? 'プレイヤー1' : 'プレイヤー2'}`;
  }

  displayCheck(player) {
    const checkDisplay = document.getElementById('check-display');
    checkDisplay.textContent = `王手！: ${player === 'player1' ? 'プレイヤー1' : 'プレイヤー2'}`;
  }

  displayGameOver(winner) {
    const gameOverDisplay = document.getElementById('game-over-display');
    gameOverDisplay.textContent = `ゲーム終了！ 勝者: ${winner === 'player1' ? 'プレイヤー1' : 'プレイヤー2'}`;
  }
  
  updateMoveCount(count) {
    const moveCountDisplay = document.getElementById('move-count');
    moveCountDisplay.textContent = `手数: ${count}`;
  }
}
