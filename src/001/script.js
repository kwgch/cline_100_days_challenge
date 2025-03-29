const board = document.getElementById('board');
let gameBoard = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, 'white', 'black', null, null, null],
    [null, null, null, 'black', 'white', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
];
let currentPlayer = 'black';

function createBoard() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleMove);
            board.appendChild(cell);

            if (gameBoard[i][j]) {
                const piece = document.createElement('div');
                piece.classList.add('piece', gameBoard[i][j]);
                cell.appendChild(piece);
            }
        }
    }
}

function handleMove(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (isValidMove(row, col)) {
        placePiece(row, col);
        flipPieces(row, col);
        switchPlayer();
    }
}

function isValidMove(row, col) {
    if (gameBoard[row][col] !== null) {
        return false;
    }

    // Check if the move results in flipping at least one opponent's piece
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;

            let newRow = row + i;
            let newCol = col + j;
            let foundOpponent = false;

            while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                if (gameBoard[newRow][newCol] === null) {
                    break;
                } else if (gameBoard[newRow][newCol] !== currentPlayer) {
                    foundOpponent = true;
                } else if (gameBoard[newRow][newCol] === currentPlayer && foundOpponent) {
                    return true;
                } else {
                    break;
                }

                newRow += i;
                newCol += j;
            }
        }
    }

    return false;
}

function placePiece(row, col) {
    gameBoard[row][col] = currentPlayer;
    const cell = board.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    const piece = document.createElement('div');
    piece.classList.add('piece', currentPlayer);
    cell.appendChild(piece);
}

function flipPieces(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;

            let newRow = row + i;
            let newCol = col + j;
            let piecesToFlip = [];
            let foundOpponent = false;

            while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                if (gameBoard[newRow][newCol] === null) {
                    break;
                } else if (gameBoard[newRow][newCol] !== currentPlayer) {
                    foundOpponent = true;
                    piecesToFlip.push({ row: newRow, col: newCol });
                } else if (gameBoard[newRow][newCol] === currentPlayer && foundOpponent) {
                    // Flip the pieces
                    piecesToFlip.forEach(p => {
                        gameBoard[p.row][p.col] = currentPlayer;
                        const cell = board.querySelector(`.cell[data-row="${p.row}"][data-col="${p.col}"]`);
                        const piece = cell.querySelector('.piece');
                        piece.classList.remove(piece.classList.contains('black') ? 'black' : 'white');
                        piece.classList.add(currentPlayer);
                    });
                    break;
                } else {
                    break;
                }

                newRow += i;
                newCol += j;
            }
        }
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    if (!hasValidMoves(currentPlayer)) {
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        if (!hasValidMoves(currentPlayer)) {
            // Game over
            determineWinner();
            return;
        }
    }
}

function hasValidMoves(player) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (gameBoard[i][j] === null && isValidMoveForPlayer(i, j, player)) {
                return true;
            }
        }
    }
    return false;
}

function isValidMoveForPlayer(row, col, player) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;

            let newRow = row + i;
            let newCol = col + j;
            let foundOpponent = false;

            while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                if (gameBoard[newRow][newCol] === null) {
                    break;
                } else if (gameBoard[newRow][newCol] !== player) {
                    foundOpponent = true;
                } else if (gameBoard[newRow][newCol] === player && foundOpponent) {
                    return true;
                } else {
                    break;
                }

                newRow += i;
                newCol += j;
            }
        }
    }

    return false;
}

function determineWinner() {
    let blackCount = 0;
    let whiteCount = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (gameBoard[i][j] === 'black') {
                blackCount++;
            } else if (gameBoard[i][j] === 'white') {
                whiteCount++;
            }
        }
    }

    let winner = blackCount > whiteCount ? 'Black' : whiteCount > blackCount ? 'White' : 'Tie';
    alert(`Game over! ${winner} wins. Black: ${blackCount}, White: ${whiteCount}`);
}

createBoard();
