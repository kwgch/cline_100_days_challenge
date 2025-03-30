import { Piece } from '../models/piece.js';

export class Bishop extends Piece {
  constructor(player, position, moveStrategy) {
    super(player, position, moveStrategy);
  }
}
