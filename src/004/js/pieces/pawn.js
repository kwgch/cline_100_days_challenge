import { Piece } from '../models/piece.js';

export class Pawn extends Piece {
  constructor(player, position, moveStrategy) {
    super(player, position, moveStrategy);
  }
}
