export class Board {
  constructor() {
    // 9x9の二次元配列を初期化
    this.grid = Array(9).fill().map(() => Array(9).fill(null));
  }
  
  placePiece(piece, position) {
    this.grid[position.y][position.x] = piece;
    if (piece) {
      piece.position = position;
    }
  }
  
  getPieceAt(position) {
    return this.grid[position.y][position.x];
  }
  
  movePiece(fromPos, toPos) {
    const piece = this.getPieceAt(fromPos);
    const capturedPiece = this.getPieceAt(toPos);
    
    this.placePiece(null, fromPos); // Clear the original square
    this.placePiece(piece, toPos);

    if (capturedPiece) {
      capturedPiece.position = null;
    }
    
    return capturedPiece; // 取った駒を返す
  }
  
  isPositionInBoard(position) {
    return position.x >= 0 && position.x < 9 && position.y >= 0 && position.y < 9;
  }

  isCheck(player) {
    // 王手判定のロジック
    const kingPosition = this.findKing(player);
    if (!kingPosition) return false; // 王が見つからない場合は王手ではない

    // 盤面全体を調べて、指定されたプレイヤーの駒が王の位置に移動可能かどうかを確認
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const piece = this.getPieceAt({ x, y });
        if (piece && piece.player !== player) {
          const validMoves = piece.getValidMoves(this);
          if (validMoves.some(move => move.x === kingPosition.x && move.y === kingPosition.y)) {
            return true; // 王手
          }
        }
      }
    }

    return false; // 王手ではない
  }

  findKing(player) {
    // 指定されたプレイヤーの王の位置を探す
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const piece = this.getPieceAt({ x, y });
        if (piece && piece.constructor.name === 'King' && piece.player === player) {
          return { x, y };
        }
      }
    }
    return null; // 王が見つからない場合はnullを返す
  }
}
