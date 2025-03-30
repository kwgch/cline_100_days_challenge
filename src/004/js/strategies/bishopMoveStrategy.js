import { MoveStrategy } from './moveStrategy.js';

export class BishopMoveStrategy extends MoveStrategy {
  getValidMoves(piece, board) {
    // 角の移動可能範囲を計算
    const validMoves = [];
    const directions = [
      {x: 1, y: 1}, {x: 1, y: -1}, 
      {x: -1, y: 1}, {x: -1, y: -1}
    ];
    
    for (const dir of directions) {
      let x = piece.position.x + dir.x;
      let y = piece.position.y + dir.y;
      
      while (board.isPositionInBoard({x, y})) {
        const targetPiece = board.getPieceAt({x, y});
        
        if (!targetPiece) {
          // 空きマスには移動可能
          validMoves.push({x, y});
        } else if (targetPiece.player !== piece.player) {
          // 相手の駒は取れる
          validMoves.push({x, y});
          break;
        } else {
          // 自分の駒があるので、それ以上進めない
          break;
        }
        
        x += dir.x;
        y += dir.y;
      }
    }
    
    return validMoves;
  }
}
