import { Piece } from '../models/piece.js';

export class Lance extends Piece {
  constructor(player, position, moveStrategy) {
    super(player, position, moveStrategy);
  }
}
