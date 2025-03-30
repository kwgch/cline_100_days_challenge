import { Piece } from '../models/piece.js';

export class Rook extends Piece {
  constructor(player, position, moveStrategy) {
    super(player, position, moveStrategy);
  }
}
