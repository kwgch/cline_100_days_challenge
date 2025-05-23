import { MoveStrategy } from './moveStrategy.js';

export class KingMoveStrategy extends MoveStrategy {
  getValidMoves(piece, board) {
    const validMoves = [];
    const directions = [
      {x: 0, y: 1},   // 下
      {x: 1, y: 1},   // 右下
      {x: -1, y: 1},  // 左下
      {x: 1, y: 0},   // 右
      {x: -1, y: 0},  // 左
      {x: 0, y: -1},   // 上
      {x: 1, y: -1},   // 右上
      {x: -1, y: -1}  // 左上
    ];

    for (const dir of directions) {
      const x = piece.position.x + dir.x;
      const y = piece.position.y + dir.y;

      if (board.isPositionInBoard({x, y})) {
        const targetPiece = board.getPieceAt({x, y});
        if (!targetPiece || targetPiece.player !== piece.player) {
          validMoves.push({x, y});
        }
      }
    }

    return validMoves;
  }
}
