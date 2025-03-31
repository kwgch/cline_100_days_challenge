import { InitialState } from './initialState.js';
import { CardExchangeState } from './cardExchangeState.js';
import { ResultState } from './resultState.js';
import { EventEmitter } from '../utils/eventEmitter.js';
export class GameContext {
    constructor() {
      this.states = {
        initial: new InitialState(this),
        cardExchange: new CardExchangeState(this),
        result: new ResultState(this)
      };
      this.currentState = this.states.initial;
      this.player = null;
      this.npc = null;
      this.deck = null;
      this.events = new EventEmitter();
    }
    start() {
      this.currentState.enter();
    }
    setState(stateName) {
      this.currentState.exit();
      this.currentState = this.states[stateName];
      this.currentState.enter();
    }
    handleAction(action, data) {
      this.currentState.handleAction(action, data);
    }
  };
