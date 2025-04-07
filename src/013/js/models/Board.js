import Tile from './Tile.js';

class Board {
  constructor() {
    this.tiles = Array(4).fill(null).map(() => Array(4).fill(null));
    this.emptyPos = { row: 3, col: 3 };
    this.size = 4;
  }
  
  initialize() {
    let numbers = Array.from({ length: 15 }, (_, i) => i + 1);
    numbers = this.shuffle(numbers);

    let k = 0;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (i === this.emptyPos.row && j === this.emptyPos.col) {
          this.tiles[i][j] = null;
        } else {
          this.tiles[i][j] = new Tile(numbers[k], i, j);
          k++;
        }
      }
    }
  }

  shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  canMoveTile(row, col) {
    return (
      (row === this.emptyPos.row && Math.abs(col - this.emptyPos.col) === 1) ||
      (col === this.emptyPos.col && Math.abs(row - this.emptyPos.row) === 1)
    );
  }

  moveTile(row, col) {
    if (!this.canMoveTile(row, col)) {
      return false;
    }

    let moveResults = [];
    let emptyRow = this.emptyPos.row;
    let emptyCol = this.emptyPos.col;

    if (row === emptyRow) {
      // Moving horizontally
      let direction = col < emptyCol ? 1 : -1; // 1: left to right, -1: right to left
      let currCol = col;

      while (currCol !== emptyCol) {
        // Swap tiles
        let tile = this.tiles[row][currCol];
        this.tiles[row][currCol] = this.tiles[emptyRow][emptyCol];
        this.tiles[emptyRow][emptyCol] = tile;

        // Update tile positions
        let oldPos = { row: tile.row, col: tile.col };
        let newPos = { row: emptyRow, col: emptyCol };
        tile.row = emptyRow;
        tile.col = emptyCol;

        this.emptyPos = { row: row, col: currCol };

        moveResults.push({ tile, oldPos, newPos });

        currCol += direction;
      }
    } else if (col === emptyCol) {
      // Moving vertically
      let direction = row < emptyRow ? 1 : -1; // 1: top to bottom, -1: bottom to top
      let currRow = row;

      while (currRow !== emptyRow) {
        let tile = this.tiles[currRow][col];
        this.tiles[currRow][col] = this.tiles[emptyRow][emptyCol];
        this.tiles[emptyRow][emptyCol] = tile;

        let oldPos = { row: tile.row, col: tile.col };
        let newPos = { row: emptyRow, col: emptyCol };
        tile.row = emptyRow;
        tile.col = emptyCol;

        this.emptyPos = { row: currRow, col: col };

        moveResults.push({ tile, oldPos, newPos });

        currRow += direction;
      }
    }

    return moveResults;
  }

  isSolvable() {
    let inversionCount = 0;
    let tilesArray = [];
    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
            if (this.tiles[i][j] != null) {
                tilesArray.push(this.tiles[i][j].value);
            } else {
                tilesArray.push(0);
            }
        }
    }

    for (let i = 0; i < tilesArray.length; i++) {
        for (let j = i + 1; j < tilesArray.length; j++) {
            if (tilesArray[i] > tilesArray[j] && tilesArray[j] != 0) {
                inversionCount++;
            }
        }
    }

    if (this.size % 2 != 0) {
        return (inversionCount % 2 == 0);
    } else {
        let emptyRow = this.emptyPos.row;
        if ((this.size - emptyRow) % 2 == 0) {
            return (inversionCount % 2 != 0);
        } else {
            return (inversionCount % 2 == 0);
        }
    }
}

  isSolved() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const tile = this.tiles[i][j];
        if (tile && !tile.isInCorrectPosition()) {
          return false;
        }
      }
    }
    return true;
  }

  initialize() {
    let numbers = Array.from({ length: 15 }, (_, i) => i + 1);
    let solvable = false;
    while (!solvable) {
        numbers = this.shuffle(numbers);
        let k = 0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (i === this.emptyPos.row && j === this.emptyPos.col) {
                    this.tiles[i][j] = null;
                } else {
                    this.tiles[i][j] = new Tile(numbers[k], i, j);
                    k++;
                }
            }
        }
        solvable = this.isSolvable();
    }
}
}

export default Board;
