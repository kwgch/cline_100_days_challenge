var UIManager = class {
    constructor() {
      this.gameContainer = document.getElementById("game-container");
      this.gameState = document.getElementById("game-state");
      this.npcCards = document.getElementById("npc-cards");
      this.playerCards = document.getElementById("player-cards");
      this.exchangeButton = document.getElementById("exchange-button");
      this.resultDisplay = document.getElementById("result-display");
      this.npcHandResult = document.getElementById("npc-hand-result");
      this.playerHandResult = document.getElementById("player-hand-result");
      this.gameResult = document.getElementById("game-result");
    }
    updateGameState(message) {
      this.gameState.textContent = message;
    }
    displayCards(player, cards) {
      const cardContainer = player === "player" ? this.playerCards : this.npcCards;
      cardContainer.innerHTML = "";
      cards.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        if (card.hidden) {
          cardElement.classList.add("hidden");
        } else {
          cardElement.textContent = `${card.rank}${card.suit}`;
          if (card.suit === "\u2665" || card.suit === "\u2666") {
            cardElement.style.color = "red";
          }
        }
        cardContainer.appendChild(cardElement);
      });
    }
    displayResults(npcHand, playerHand, result) {
      this.npcHandResult.textContent = `NPC Hand: ${npcHand}`;
      this.playerHandResult.textContent = `Player Hand: ${playerHand}`;
      this.gameResult.textContent = `Result: ${result}`;
      this.resultDisplay.classList.remove("hidden");
    }
  };
export { UIManager };
