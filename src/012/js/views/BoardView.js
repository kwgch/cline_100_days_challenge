import { EventEmitter } from '../utils/EventEmitter.js';

class BoardView {
    constructor(container, controller) {
        this.container = container;
        this.controller = controller;
        this.cells = []; // DOMの参照を保持
        this.eventEmitter = new EventEmitter();
    }

    render() {
        this.container.innerHTML = '';
        this.cells = [];

        for (let row = 0; row < 9; row++) {
            this.cells[row] = [];
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                this.container.appendChild(cell);
                this.cells[row][col] = cell;

                cell.addEventListener('click', () => {
                    this.controller.handleCellClick(row, col);
                });
            }
        }
    }

    updateCell(row, col, value, isGiven = false) {
        const cell = this.cells[row][col];
        cell.textContent = value === 0 ? '' : value;
        cell.classList.toggle('given', isGiven);
    }

    highlightCell(row, col) {
        this.cells.forEach(rowCells => {
            rowCells.forEach(c => c.classList.remove('selected'));
        });
        this.cells[row][col].classList.add('selected');
    }
}

export { BoardView };
