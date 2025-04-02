class InputController {
    constructor(gameController) {
        this.gameController = gameController;
        this.selectedCell = { row: -1, col: -1 };
        this.isNoteMode = false;
    }

    selectCell(row, col) {
        this.selectedCell = { row, col };
    }

    inputNumber(num) {
        if (this.selectedCell.row === -1 || this.selectedCell.col === -1) {
            return; // セルが選択されていない場合
        }

        const { row, col } = this.selectedCell;
        if (this.gameController.sudokuModel.grid[row][col].isGiven) {
            return; // 初期値のセルには入力できない
        }

        this.gameController.sudokuModel.grid[row][col].value = num;
    }

    toggleNoteMode() {
        this.isNoteMode = !this.isNoteMode;
    }
}

export { InputController };
