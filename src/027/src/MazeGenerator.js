export class MazeGenerator {
    constructor() {
        this.grid = [];
        this.cols = 0;
        this.rows = 0;
        this.stack = [];
    }

    // Helper to get index in 1D array representation if needed, or use 2D directly
    index(x, y) {
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) {
            return -1; // Out of bounds
        }
        return y * this.cols + x; // or simply access grid[y][x]
    }

    // Initialize the grid with cells, all walls intact
    setupGrid(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.grid = [];
        this.stack = [];
        for (let y = 0; y < rows; y++) {
            this.grid[y] = [];
            for (let x = 0; x < cols; x++) {
                this.grid[y][x] = new Cell(x, y);
            }
        }
    }

    // Check for valid and unvisited neighbors
    checkNeighbors(cell) {
        const x = cell.x;
        const y = cell.y;
        const neighbors = [];

        const top = (y > 0) ? this.grid[y - 1][x] : undefined;
        const right = (x < this.cols - 1) ? this.grid[y][x + 1] : undefined;
        const bottom = (y < this.rows - 1) ? this.grid[y + 1][x] : undefined;
        const left = (x > 0) ? this.grid[y][x - 1] : undefined;

        if (top && !top.visited) neighbors.push(top);
        if (right && !right.visited) neighbors.push(right);
        if (bottom && !bottom.visited) neighbors.push(bottom);
        if (left && !left.visited) neighbors.push(left);

        if (neighbors.length > 0) {
            // Choose one random neighbor
            const r = Math.floor(Math.random() * neighbors.length);
            return neighbors[r];
        } else {
            return undefined; // No unvisited neighbors
        }
    }

    // Remove the wall between two adjacent cells
    removeWall(current, next) {
        const dx = current.x - next.x; // -1 (next is right), 1 (next is left), 0
        const dy = current.y - next.y; // -1 (next is bottom), 1 (next is top), 0

        if (dx === 1) { // Next is to the left of current
            current.walls[3] = false; // Remove current's left wall
            next.walls[1] = false;    // Remove next's right wall
        } else if (dx === -1) { // Next is to the right of current
            current.walls[1] = false; // Remove current's right wall
            next.walls[3] = false;    // Remove next's left wall
        }

        if (dy === 1) { // Next is above current
            current.walls[0] = false; // Remove current's top wall
            next.walls[2] = false;    // Remove next's bottom wall
        } else if (dy === -1) { // Next is below current
            current.walls[2] = false; // Remove current's bottom wall
            next.walls[0] = false;    // Remove next's top wall
        }
    }

    // Main generation function using Recursive Backtracking
    generate(cols, rows) {
        this.setupGrid(cols, rows);

        // Start at a random cell (or fixed e.g., 0,0)
        let current = this.grid[0][0];
        current.visited = true;
        this.stack.push(current);
        let visitedCount = 1;
        const totalCells = cols * rows;

        while (visitedCount < totalCells) {
            let next = this.checkNeighbors(current);
            if (next) {
                next.visited = true;
                visitedCount++;

                // Remove the wall between current and next
                this.removeWall(current, next);

                // Push current to the stack
                this.stack.push(current);

                // Current becomes next
                current = next;
            } else if (this.stack.length > 0) {
                // No unvisited neighbors, backtrack
                current = this.stack.pop();
            } else {
                // Should not happen if algorithm is correct and starts connected
                console.warn("Maze generation ended unexpectedly.");
                break;
            }
        }
        console.log("Maze generation complete.");
        return this.grid; // Return the grid data with wall information
    }
}

export class Cell {
    constructor(x, y) {
        this.x = x; // Grid column index
        this.y = y; // Grid row index
        this.walls = [true, true, true, true]; // [top, right, bottom, left] - true means wall exists
        this.visited = false; // For generation algorithm
    }
    // Helper methods like index, checkNeighbors can be added [3]
}
