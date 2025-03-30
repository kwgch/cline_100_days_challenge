import { Piece } from '../models/piece.js';

export class Silver extends Piece {
  constructor(player, position, moveStrategy) {
    super(player, position, moveStrategy);
  }
}
