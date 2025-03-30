import { Piece } from '../models/piece.js';

export class Gold extends Piece {
  constructor(player, position, moveStrategy) {
    super(player, position, moveStrategy);
  }
}
