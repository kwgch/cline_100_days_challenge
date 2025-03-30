import { MoveStrategy } from './moveStrategy.js';

export class RookMoveStrategy extends MoveStrategy {
  getValidMoves(piece, board) {
    const validMoves = [];
    const directions = [
      {x: 0, y: 1},   // 下
      {x: 0, y: -1},   // 上
      {x: 1, y: 0},   // 右
      {x: -1, y: 0}    // 左
    ];

    for (const dir of directions) {
      let x = piece.position.x + dir.x;
      let y = piece.position.y + dir.y;

      while (board.isPositionInBoard({x, y})) {
        const targetPiece = board.getPieceAt({x, y});

        if (!targetPiece) {
          validMoves.push({x, y});
        } else if (targetPiece.player !== piece.player) {
          validMoves.push({x, y});
          break;
        } else {
          break;
        }

        x += dir.x;
        y += dir.y;
      }
    }

    return validMoves;
  }
}
