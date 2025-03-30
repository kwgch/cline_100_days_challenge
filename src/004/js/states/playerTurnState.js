import { PieceFactory } from '../factories/pieceFactory.js';

export class Player1TurnState {
  constructor(gameManager) {
    this.gameManager = gameManager;
  }

  onEnter() {
    // プレイヤー1ターンの初期化処理
    console.log('Player 1 turn');
    this.gameManager.eventEmitter.emit('turnChanged', 'player1');
  }

  getCurrentPlayer() {
    return 'player1';
  }

  handlePieceSelection(piece) {
    // プレイヤー1の駒のみ選択可能
    if (piece.player === 'player1') {
      // 駒選択処理
      return true;
    }
    return false;
  }

  handleBoardClick(position, selectedPiece) {
    // 移動先の選択処理
    const targetPiece = this.gameManager.board.getPieceAt(position);
    if (targetPiece && targetPiece.player === this.getCurrentPlayer()) {
      return false;
    }

    console.log('Player1TurnState.handleBoardClick: gameManager=', this.gameManager, 'selectedPiece=', selectedPiece);
    const validMoves = selectedPiece.getValidMoves(this.gameManager.board);
    if (validMoves.some(move => move.x === position.x && move.y === position.y)) {
      // 移動が完了したら
      const capturedPiece = this.gameManager.board.movePiece(selectedPiece.position, position);
      if (capturedPiece) {
        this.gameManager.capturePiece(capturedPiece);
      }
      this.gameManager.incrementMoveCount();
      this.gameManager.changeState(new Player2TurnState(this.gameManager));
      this.gameManager.eventEmitter.emit('boardUpdated');

      if (this.gameManager.board.isCheck('player2')) {
        this.gameManager.eventEmitter.emit('check', 'player2');
      }
      return true;
    }
    return false;
  }
}

export class Player2TurnState {
  constructor(gameManager) {
    this.gameManager = gameManager;
  }

  onEnter() {
    // プレイヤー2ターンの初期化処理
    console.log('Player 2 turn');
    this.gameManager.eventEmitter.emit('turnChanged', 'player2');
  }

  getCurrentPlayer() {
    return 'player2';
  }

  handlePieceSelection(piece) {
    // プレイヤー2の駒のみ選択可能
    if (piece.player === 'player2') {
      // 駒選択処理
      return true;
    }
    return false;
  }

  handleBoardClick(position, selectedPiece) {
    // 移動先の選択処理
    const targetPiece = this.gameManager.board.getPieceAt(position);
    if (targetPiece && targetPiece.player === this.getCurrentPlayer()) {
      return false;
    }

    const validMoves = selectedPiece.getValidMoves(this.gameManager.board);
    if (validMoves.some(move => move.x === position.x && move.y === position.y)) {
      // 移動が完了したら
      const capturedPiece = this.gameManager.board.movePiece(selectedPiece.position, position);
      if (capturedPiece) {
        this.gameManager.capturePiece(capturedPiece);
      }
      this.gameManager.incrementMoveCount();
      this.gameManager.changeState(new Player1TurnState(this.gameManager));
      this.gameManager.eventEmitter.emit('boardUpdated');
      if (this.gameManager.board.isCheck('player1')) {
        this.gameManager.eventEmitter.emit('check', 'player1');
      }
      return true;
    }
    return false;
  }
}
