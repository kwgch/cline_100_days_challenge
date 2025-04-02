import { CellModel } from './CellModel.js';

class SudokuModel {
    constructor() {
        this.grid = []; // 9x9の二次元配列
        this.solution = []; // 解答
        this.difficulty = 'medium'; // 難易度
    }

    initialize(difficulty) {
        this.difficulty = difficulty;
        this.grid = Array(9).fill(null).map(() => Array(9).fill(null).map(() => new CellModel()));
        this.solution = []; // 解答
    }

    isCellValid(row, col, num) {
        // 行に同じ数字がないか
        for (let i = 0; i < 9; i++) {
            if (this.grid[row][i].value === num) {
                return false;
            }
        }

        // 列に同じ数字がないか
        for (let i = 0; i < 9; i++) {
            if (this.grid[i][col].value === num) {
                return false;
            }
        }

        // 3x3のブロックに同じ数字がないか
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if (this.grid[i][j].value === num) {
                    return false;
                }
            }
        }

        return true;
    }

    isSolved() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.grid[row][col].value === 0) {
                    return false;
                }
            }
        }
        return this.isValidSudoku();
    }

    isValidSudoku() {
        for (let i = 0; i < 9; i++) {
            let row = new Set();
            let col = new Set();
            let box = new Set();

            for (let j = 0; j < 9; j++) {
                let rowVal = this.grid[i][j].value;
                let colVal = this.grid[j][i].value;
                let boxVal = this.grid[3 * Math.floor(i / 3) + Math.floor(j / 3)][3 * (i % 3) + (j % 3)].value;

                if (rowVal !== 0) {
                    if (row.has(rowVal)) return false;
                    row.add(rowVal);
                }
                if (colVal !== 0) {
                    if (col.has(colVal)) return false;
                    col.add(colVal);
                }
                if (boxVal !== 0) {
                    if (box.has(boxVal)) return false;
                    box.add(boxVal);
                }
            }
        }
        return true;
    }
    
    setGrid(gridValues) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                this.grid[row][col].value = gridValues[row][col];
                this.grid[row][col].isGiven = gridValues[row][col] !== 0;
            }
        }
    }
}

export { SudokuModel };
