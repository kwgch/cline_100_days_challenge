import { MoveStrategy } from './moveStrategy.js';

export class KnightMoveStrategy extends MoveStrategy {
  getValidMoves(piece, board) {
    const validMoves = [];
    const directions = piece.player === 'player1' ? [
      {x: 1, y: -2},
      {x: -1, y: -2},
      {x: 2, y: -1},
      {x: -2, y: -1},
      {x: 2, y: 1},
      {x: -2, y: 1},
      {x: 1, y: 2},
      {x: -1, y: 2}
    ] : [
      {x: 1, y: 2},
      {x: -1, y: 2},
      {x: 2, y: 1},
      {x: -2, y: 1},
      {x: 2, y: -1},
      {x: -2, y: -1},
      {x: 1, y: -2},
      {x: -1, y: -2}
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
