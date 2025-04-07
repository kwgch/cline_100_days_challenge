class Tile {
  constructor(value, row, col) {
    this.value = value;
    this.row = row;
    this.col = col;
    this.correctRow = Math.floor((value - 1) / 4);
    this.correctCol = (value - 1) % 4;
  }
  
  isInCorrectPosition() {
    return this.row === this.correctRow && this.col === this.correctCol;
  }
}

export default Tile;
