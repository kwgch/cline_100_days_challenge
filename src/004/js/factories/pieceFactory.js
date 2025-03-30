import { King } from '../pieces/king.js';
import { Rook } from '../pieces/rook.js';
import { Bishop } from '../pieces/bishop.js';
import { Gold } from '../pieces/gold.js';
import { Silver } from '../pieces/silver.js';
import { Knight } from '../pieces/knight.js';
import { Lance } from '../pieces/lance.js';
import { Pawn } from '../pieces/pawn.js';

import { KingMoveStrategy } from '../strategies/kingMoveStrategy.js';
import { RookMoveStrategy } from '../strategies/rookMoveStrategy.js';
import { BishopMoveStrategy } from '../strategies/bishopMoveStrategy.js';
import { GoldMoveStrategy } from '../strategies/goldMoveStrategy.js';
import { SilverMoveStrategy } from '../strategies/silverMoveStrategy.js';
import { KnightMoveStrategy } from '../strategies/knightMoveStrategy.js';
import { LanceMoveStrategy } from '../strategies/lanceMoveStrategy.js';
import { PawnMoveStrategy } from '../strategies/pawnMoveStrategy.js';
import { Board } from '../models/board.js';

export class PieceFactory {
  static createPiece(type, player, position) {
    switch(type) {
      case 'king':
        return new King(player, position, new KingMoveStrategy());
      case 'rook':
        return new Rook(player, position, new RookMoveStrategy());
      case 'bishop':
        return new Bishop(player, position, new BishopMoveStrategy());
      case 'gold':
        return new Gold(player, position, new GoldMoveStrategy());
      case 'silver':
        return new Silver(player, position, new SilverMoveStrategy());
      case 'knight':
        return new Knight(player, position, new KnightMoveStrategy());
      case 'lance':
        return new Lance(player, position, new LanceMoveStrategy());
      case 'pawn':
        return new Pawn(player, position, new PawnMoveStrategy());
    }
  }
  
  static createInitialBoard() {
    const board = new Board();
    
    // プレイヤー2（上側）の駒を配置
    board.placePiece(this.createPiece('lance', 'player2', {x: 0, y: 0}), {x: 0, y: 0});
    board.placePiece(this.createPiece('knight', 'player2', {x: 1, y: 0}), {x: 1, y: 0});
    board.placePiece(this.createPiece('silver', 'player2', {x: 2, y: 0}), {x: 2, y: 0});
    board.placePiece(this.createPiece('gold', 'player2', {x: 3, y: 0}), {x: 3, y: 0});
    board.placePiece(this.createPiece('king', 'player2', {x: 4, y: 0}), {x: 4, y: 0});
    board.placePiece(this.createPiece('gold', 'player2', {x: 5, y: 0}), {x: 5, y: 0});
    board.placePiece(this.createPiece('silver', 'player2', {x: 6, y: 0}), {x: 6, y: 0});
    board.placePiece(this.createPiece('knight', 'player2', {x: 7, y: 0}), {x: 7, y: 0});
    board.placePiece(this.createPiece('lance', 'player2', {x: 8, y: 0}), {x: 8, y: 0});
    
    board.placePiece(this.createPiece('bishop', 'player2', {x: 1, y: 1}), {x: 1, y: 1});
    board.placePiece(this.createPiece('rook', 'player2', {x: 7, y: 1}), {x: 7, y: 1});
    
    for (let x = 0; x < 9; x++) {
      board.placePiece(this.createPiece('pawn', 'player2', {x: x, y: 2}), {x: x, y: 2});
    }
    
    // プレイヤー1（下側）の駒を配置
    board.placePiece(this.createPiece('lance', 'player1', {x: 0, y: 8}), {x: 0, y: 8});
    board.placePiece(this.createPiece('knight', 'player1', {x: 1, y: 8}), {x: 1, y: 8});
    board.placePiece(this.createPiece('silver', 'player1', {x: 2, y: 8}), {x: 2, y: 8});
    board.placePiece(this.createPiece('gold', 'player1', {x: 3, y: 8}), {x: 3, y: 8});
    board.placePiece(this.createPiece('king', 'player1', {x: 4, y: 8}), {x: 4, y: 8});
    board.placePiece(this.createPiece('gold', 'player1', {x: 5, y: 8}), {x: 5, y: 8});
    board.placePiece(this.createPiece('silver', 'player1', {x: 6, y: 8}), {x: 6, y: 8});
    board.placePiece(this.createPiece('knight', 'player1', {x: 7, y: 8}), {x: 7, y: 8});
    board.placePiece(this.createPiece('lance', 'player1', {x: 8, y: 8}), {x: 8, y: 8});
    
    board.placePiece(this.createPiece('bishop', 'player1', {x: 7, y: 7}), {x: 7, y: 7});
    board.placePiece(this.createPiece('rook', 'player1', {x: 1, y: 7}), {x: 1, y: 7});
    
    for (let x = 0; x < 9; x++) {
      board.placePiece(this.createPiece('pawn', 'player1', {x: x, y: 6}), {x: x, y: 6});
    }

    return board;
  }
}
