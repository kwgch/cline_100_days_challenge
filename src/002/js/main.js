import { GameContext } from './states/gameContext.js';

document.addEventListener("DOMContentLoaded", () => {
    const game = new GameContext();
    game.start();
});
