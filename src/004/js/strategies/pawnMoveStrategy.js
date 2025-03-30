import { MoveStrategy } from './moveStrategy.js';

export class PawnMoveStrategy extends MoveStrategy {
  getValidMoves(piece, board) {
    const validMoves = [];
    const direction = piece.player === 'player1' ? {x: 0, y: -1} : {x: 0, y: 1};
    const x = piece.position.x + direction.x;
    const y = piece.position.y + direction.y;

    if (board.isPositionInBoard({x, y})) {
      const targetPiece = board.getPieceAt({x, y});
      if (!targetPiece) {
        validMoves.push({x, y});
      } else if (targetPiece.player !== piece.player) {
        validMoves.push({x, y});
      }
    }

    return validMoves;
  }
}
