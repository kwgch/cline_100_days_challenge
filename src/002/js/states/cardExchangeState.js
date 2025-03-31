var CardExchangeState = class {
    constructor(context) {
      this.context = context;
      this.selectedCards = [];
    }
    enter() {
      this.context.uiManager.updateGameState("\u30AB\u30FC\u30C9\u4EA4\u63DB");
      this.context.uiManager.displayCards("player", this.context.player.hand);
      this.context.uiManager.exchangeButton.disabled = false;
      if (this.context.uiManager.exchangeDoneButton) {
        this.context.uiManager.exchangeDoneButton.style.display = "none";
      }
      this.context.uiManager.playerCards.addEventListener("click", this.selectCard.bind(this));
      this.context.uiManager.exchangeButton.addEventListener("click", this.exchangeCardsAndEnd.bind(this));
    }
    exit() {
      this.context.uiManager.playerCards.removeEventListener("click", this.selectCard.bind(this));
      this.context.uiManager.exchangeButton.removeEventListener("click", this.exchangeCardsAndEnd.bind(this));
    }
    selectCard(event) {
      if (event.target.classList.contains("card")) {
        const cardIndex = Array.from(event.target.parentNode.children).indexOf(event.target);
        if (this.selectedCards.includes(cardIndex)) {
          this.selectedCards = this.selectedCards.filter((index) => index !== cardIndex);
          event.target.classList.remove("selected");
        } else {
          this.selectedCards.push(cardIndex);
          event.target.classList.add("selected");
        }
      }
    }
    exchangeCardsAndEnd() {
      const newCards = this.context.deck.deal(this.selectedCards.length);
      for (let i = 0; i < this.selectedCards.length; i++) {
        this.context.player.hand[this.selectedCards[i]] = newCards[i];
      }
      this.selectedCards = [];
      this.context.uiManager.displayCards("player", this.context.player.hand);
      this.context.setState("result");
    }
    handleAction(action, data) {
      if (action === "exchangeCards") {
        this.context.setState("result");
      }
    }
  };
export { CardExchangeState };
