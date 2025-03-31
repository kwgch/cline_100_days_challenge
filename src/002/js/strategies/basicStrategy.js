import { NPCStrategy } from './npcStrategy.js';
var BasicStrategy = class extends NPCStrategy {
    decideExchangeCards(hand) {
      const cardsToExchange = hand.filter((card) => parseInt(card.rank) < 6 && !isNaN(parseInt(card.rank)));
      return cardsToExchange;
    }
  };
export { BasicStrategy };
