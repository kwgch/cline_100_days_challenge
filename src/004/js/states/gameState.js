import { Player1TurnState } from './playerTurnState.js';

// 基底クラス
export class GameState {
  constructor(gameManager) {
    this.gameManager = gameManager;
  }
  
  onEnter() {}
  onExit() {}
  handleBoardClick(position) {}
  handlePieceSelection(piece) {}
  getCurrentPlayer() {}
}

// 具体的な状態クラス
export class InitialState {
  constructor(gameManager) {
    this.gameManager = gameManager;
  }

  onEnter() {
    // ゲーム開始時の初期化処理
    console.log('Game started');
    this.gameManager.changeState(new Player1TurnState(this.gameManager));
  }
}
