var Deck = class {
    constructor() {
      this.cards = [];
      this.suits = ["\u2660", "\u2665", "\u2666", "\u2663"];
      this.ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
      this.createDeck();
      this.shuffle();
    }
    createDeck() {
      for (let suit of this.suits) {
        for (let rank of this.ranks) {
          this.cards.push({ suit, rank });
        }
      }
    }
    shuffle() {
      for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
    }
    deal(numCards) {
      const dealtCards = [];
      for (let i = 0; i < numCards; i++) {
        dealtCards.push(this.cards.pop());
      }
      return dealtCards;
    }
  };
export { Deck };
