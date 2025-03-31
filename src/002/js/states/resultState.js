import { HandEvaluator } from '../utils/evaluator.js';
var ResultState = class {
    constructor(context) {
      this.context = context;
    }
    enter() {
      this.context.uiManager.updateGameState("\u7D50\u679C\u8868\u793A");
      const playerHand = this.context.player.hand;
      const npcHand = this.context.npc.hand;
      const evaluator = new HandEvaluator();
      const playerHandResult = evaluator.evaluateHand(playerHand);
      const npcHandResult = evaluator.evaluateHand(npcHand);
      let gameResult = "";
      if (playerHandResult > npcHandResult) {
        gameResult = "\u30D7\u30EC\u30A4\u30E4\u30FC\u306E\u52DD\u5229\uFF01";
      } else if (npcHandResult > playerHandResult) {
        gameResult = "NPC\u306E\u52DD\u5229\uFF01";
      } else {
        gameResult = "\u5F15\u304D\u5206\u3051\uFF01";
      }
      this.context.uiManager.displayCards("npc", this.context.npc.hand);
      this.context.uiManager.displayResults(npcHandResult, playerHandResult, gameResult);
    }
    exit() {
    }
  };
export { ResultState };
