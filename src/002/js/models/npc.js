import { Player } from './player.js';
var NPC = class extends Player {
    constructor(strategy) {
      super();
      this.strategy = strategy;
    }
    decideExchangeCards() {
      return this.strategy.decideExchangeCards(this.hand);
    }
  };
export { NPC };
