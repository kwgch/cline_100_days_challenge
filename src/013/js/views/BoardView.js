class BoardView {
  constructor(containerElement, controller) {
    this.container = containerElement;
    this.controller = controller;
    this.tileElements = {};
  }
  
  initialize(board) {
    this.container.innerHTML = '';
    this.tileElements = {};
    
    this.container.style.gridTemplateColumns = `repeat(${board.size}, 1fr)`;
    this.container.style.gridTemplateRows = `repeat(${board.size}, 1fr)`;
    
    for (let row = 0; row < board.size; row++) {
      for (let col = 0; col < board.size; col++) {
        const tile = board.tiles[row][col];
        if (tile) {
          const tileElement = document.createElement('div');
          tileElement.classList.add('tile');
          tileElement.textContent = tile.value;
          tileElement.style.gridRow = row + 1;
          tileElement.style.gridColumn = col + 1;
          tileElement.addEventListener('click', () => {
            this.controller.handleTileClick(tile.row, tile.col);
          });
          
          this.container.appendChild(tileElement);
          this.tileElements[tile.value] = tileElement;
        }
      }
    }
  }
  
 updateTilePosition(moveResult) {
    if (!moveResult) return;

    const { tile, newPos } = moveResult;
    const tileElement = this.tileElements[tile.value];

    if (tileElement) {
      tileElement.style.gridRow = newPos.row + 1;
      tileElement.style.gridColumn = newPos.col + 1;
    }
  }
}

export default BoardView;
