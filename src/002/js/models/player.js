var Player = class {
    constructor() {
      this.hand = [];
    }
    addCard(card) {
      this.hand.push(card);
    }
    removeCard(card) {
      this.hand = this.hand.filter((c) => c !== card);
    }
  };
export { Player };
