import { Deck } from '../models/deck.js';
import { Player } from '../models/player.js';
import { NPC } from '../models/npc.js';
import { BasicStrategy } from '../strategies/basicStrategy.js';
import { UIManager } from '../ui/uiManager.js';
var InitialState = class {
    constructor(context) {
      this.context = context;
    }
    enter() {
      this.context.uiManager = new UIManager();
      this.context.uiManager.updateGameState("\u30AB\u30FC\u30C9\u3092\u914D\u308A\u307E\u3059");
      this.context.deck = new Deck();
      this.context.player = new Player();
      this.context.npc = new NPC(new BasicStrategy());
      for (let i = 0; i < 5; i++) {
        this.context.player.addCard(this.context.deck.deal(1)[0]);
        this.context.npc.addCard(this.context.deck.deal(1)[0]);
      }
      this.context.uiManager.displayCards("player", this.context.player.hand);
      this.context.uiManager.displayCards("npc", this.context.npc.hand.map((card) => ({ ...card, hidden: true })));
      setTimeout(() => {
        this.context.setState("cardExchange");
      }, 1e3);
    }
    exit() {
    }
    handleAction() {
    }
  };
export { InitialState };
