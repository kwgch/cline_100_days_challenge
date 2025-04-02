import { SudokuSolver } from './SudokuSolver.js';

class SudokuGenerator {
    static generate(difficulty) {
        let grid = Array(9).fill(null).map(() => Array(9).fill(0));

        // 対角線上の3x3ブロックを埋める
        for (let i = 0; i < 3; i++) {
            let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            for (let row = i * 3; row < i * 3 + 3; row++) {
                for (let col = i * 3; col < i * 3 + 3; col++) {
                    let numIndex = Math.floor(Math.random() * nums.length);
                    grid[row][col] = nums[numIndex];
                    nums.splice(numIndex, 1);
                }
            }
        }

        // 数独を解く
        if (!SudokuSolver.solve(grid)) {
            return null; // 解けなければnullを返す
        }

        // 難易度に応じて数字を削除
        SudokuGenerator.removeNumbers(grid, difficulty);

        return grid;
    }

    static removeNumbers(grid, difficulty) {
        let numbersToRemove;
        switch (difficulty) {
            case 'easy':
                numbersToRemove = 40;
                break;
            case 'medium':
                numbersToRemove = 50;
                break;
            case 'hard':
                numbersToRemove = 60;
                break;
            default:
                numbersToRemove = 50;
        }

        let positions = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                positions.push({ row: i, col: j });
            }
        }

        for (let i = 0; i < numbersToRemove; i++) {
            let positionIndex = Math.floor(Math.random() * positions.length);
            let { row, col } = positions[positionIndex];
            grid[row][col] = 0;
            positions.splice(positionIndex, 1);
        }
    }
}

export { SudokuGenerator };
