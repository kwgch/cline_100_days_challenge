export class Piece {
  constructor(player, position, moveStrategy) {
    this.player = player; // 'player1' または 'player2'
    this.position = position;
    this.promoted = false;
    this.moveStrategy = moveStrategy;
  }
  
  getValidMoves(board) {
    return this.moveStrategy.getValidMoves(this, board);
  }
  
  promote() {
    this.promoted = true;
    // 成り駒の移動戦略に変更
    this.moveStrategy = this.getPromotedMoveStrategy();
  }
  
  getPromotedMoveStrategy() {
    // 成り駒の移動戦略を返す
  }
  
  canPromote(toPosition) {
    // 成れるかどうかの判定
    if (this.promoted) return false;
    
    // プレイヤー1（下側）の駒は上位3段に入ると成れる
    if (this.player === 'player1' && toPosition.y >= 6) return true;
    
    return false;
  }
}
