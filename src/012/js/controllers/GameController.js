import { SudokuModel } from '../models/SudokuModel.js';
import { GameStateModel } from '../models/GameStateModel.js';
import { BoardView } from '../views/BoardView.js';
import { ControlView } from '../views/ControlView.js';
import { TimerView } from '../views/TimerView.js';
import { InputController } from './InputController.js';
import { StorageController } from './StorageController.js';
import { EventEmitter } from '../utils/EventEmitter.js';
import { SudokuGenerator } from '../utils/SudokuGenerator.js';
import { SudokuSolver } from '../utils/SudokuSolver.js';

class GameController {
    constructor() {
        this.sudokuModel = new SudokuModel();
        this.gameState = new GameStateModel();
        this.eventEmitter = new EventEmitter();

        // ビューの初期化
        this.boardView = new BoardView(document.getElementById('board'), this);
        this.controlView = new ControlView(document.getElementById('controls'), this);
        this.timerView = new TimerView(document.getElementById('timer'));

        this.inputController = new InputController(this);
        this.storageController = new StorageController(this);

        this.intervalId = null; // タイマーのsetIntervalのID
    }

    initGame(difficulty) {
        this.sudokuModel.initialize(difficulty);
        const generatedGrid = SudokuGenerator.generate(difficulty);
        this.sudokuModel.setGrid(generatedGrid);
        this.boardView.render();
        this.updateBoard();
        this.controlView.render();

        this.gameState.resetGame();
        this.updateTimer();
        this.startTimer();
    }

    handleCellClick(row, col) {
        this.inputController.selectCell(row, col);
        this.boardView.highlightCell(row, col);
    }

    handleNumberInput(num) {
        this.inputController.inputNumber(num);
        this.updateBoard();
    }

    checkSolution() {
        if (this.sudokuModel.isSolved()) {
            alert('Congratulations! You solved the Sudoku!');
        } else {
            alert('The Sudoku is not yet solved.');
        }
    }

    solveSudoku() {
        const grid = this.sudokuModel.grid.map(row => row.map(cell => cell.value));
        if (SudokuSolver.solve(grid)) {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    this.sudokuModel.grid[row][col].value = grid[row][col];
                }
            }
            this.updateBoard();
        } else {
            alert('This Sudoku has no solution!');
        }
    }

    updateBoard() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cellValue = this.sudokuModel.grid[row][col].value;
                const isGiven = this.sudokuModel.grid[row][col].isGiven;
                this.boardView.updateCell(row, col, cellValue, isGiven);
            }
        }
    }

    startTimer() {
        this.gameState.startTimer();
        this.intervalId = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    stopTimer() {
        this.gameState.stopTimer();
        clearInterval(this.intervalId);
    }

    updateTimer() {
        const elapsedTime = this.gameState.isRunning ? Math.floor((Date.now() - this.gameState.startTime) / 1000) : Math.floor(this.gameState.elapsedTime / 1000);
        this.timerView.updateTime(elapsedTime);
    }
}

export { GameController };
