import { MoveStrategy } from './moveStrategy.js';

export class LanceMoveStrategy extends MoveStrategy {
  getValidMoves(piece, board) {
    const validMoves = [];
    const direction = piece.player === 'player1' ? {x: 0, y: -1} : {x: 0, y: 1};

    let x = piece.position.x + direction.x;
    let y = piece.position.y + direction.y;

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

      x += direction.x;
      y += direction.y;
    }

    return validMoves;
  }
}
