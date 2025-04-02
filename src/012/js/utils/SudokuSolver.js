class SudokuSolver {
    static solve(grid) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (grid[i][j] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (SudokuSolver.isValid(grid, i, j, num)) {
                            grid[i][j] = num;

                            if (SudokuSolver.solve(grid)) {
                                return true;
                            } else {
                                grid[i][j] = 0; // バックトラック
                            }
                        }
                    }
                    return false; // 解なし
                }
            }
        }
        return true; // 全て埋まった
    }

    static isValid(grid, row, col, num) {
        // 行に同じ数字がないか
        for (let i = 0; i < 9; i++) {
            if (grid[row][i] === num) {
                return false;
            }
        }

        // 列に同じ数字がないか
        for (let i = 0; i < 9; i++) {
            if (grid[i][col] === num) {
                return false;
            }
        }

        // 3x3のブロックに同じ数字がないか
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if (grid[i][j] === num) {
                    return false;
                }
            }
        }

        return true;
    }
}

export { SudokuSolver };
