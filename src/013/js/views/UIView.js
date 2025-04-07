class UIView {
  constructor(controller) {
    this.controller = controller;
    this.moveCountElement = document.getElementById('move-count');
    this.timerElement = document.getElementById('timer');
    this.resetButton = document.getElementById('reset-button');
  }
  
  initialize() {
    this.resetButton.addEventListener('click', () => {
      this.controller.handleReset();
    });
  }
  
  updateMoveCount(count) {
    this.moveCountElement.innerText = count;
  }
  
 updateTimer(time) {
    this.timerElement.innerText = time;
  }

  showGameClearMessage(moveCount, time) {
    const message = document.createElement('div');
    message.classList.add('game-message');
    message.innerHTML = `<h2>Game Clear!</h2><p>Moves: ${moveCount}, Time: ${time}</p><button id="close-message">Close</button>`;
    document.body.appendChild(message);

    document.getElementById('close-message').addEventListener('click', () => {
      document.body.removeChild(message);
    });
  }

  showGameOverMessage(moveCount, time) {
    const message = document.createElement('div');
    message.classList.add('game-message');
    message.innerHTML = `<h2>Game Over!</h2><p>Moves: ${moveCount}, Time: ${time}</p><button id="close-message">Close</button>`;
    document.body.appendChild(message);

    document.getElementById('close-message').addEventListener('click', () => {
      document.body.removeChild(message);
    });
  }
}

export default UIView;
