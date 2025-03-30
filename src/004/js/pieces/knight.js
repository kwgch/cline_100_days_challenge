import { Piece } from '../models/piece.js';

export class Knight extends Piece {
  constructor(player, position, moveStrategy) {
    super(player, position, moveStrategy);
  }
}
