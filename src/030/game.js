// game.js

const ROWS = 12;
const COLS = 6;
const EMOJI_TYPES = ['😀','😍','🤔','😎','😭'];
const fallSpeed = 500; // milliseconds per drop
let boardState = [];
let currentPair = null;
let nextPair = null;
let score = 0;
let gameState = 'playing';
let loopId = null;

// Initialize game state
function initGame() {
  boardState = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  createBoardDOM();
  nextPair = generatePair();
  updateNextEmojiDisplay();
  spawnPair();
  setupInputListeners();
  loopId = setInterval(gameLoop, fallSpeed);
}

// Create grid in DOM
function createBoardDOM() {
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('touchstart', e => {
        if (gameState === 'playing' && currentPair && currentPair.blocks.some(b => b.row === r && b.col === c)) {
          rotatePair();
          render();
        }
      });
      cell.dataset.row = r;
      cell.dataset.col = c;
      board.appendChild(cell);
    }
  }
}

// Generate a random pair of emojis
function generatePair() {
  const a = EMOJI_TYPES[Math.floor(Math.random() * EMOJI_TYPES.length)];
  const b = EMOJI_TYPES[Math.floor(Math.random() * EMOJI_TYPES.length)];
  return { blocks: [{row:0, col:0, emoji:a}, {row:0, col:1, emoji:b}], orientation: 0 };
}

// Place nextPair into currentPair and generate new nextPair
function spawnPair() {
  currentPair = nextPair;
  // Reset positions
  currentPair.blocks[0].row = 0;
  currentPair.blocks[0].col = 2;
  currentPair.blocks[1].row = 0;
  currentPair.blocks[1].col = 3;
  nextPair = generatePair();
  updateNextEmojiDisplay();
  if (checkGameOver()) { // Moved checkGameOver here
    gameOver();
    return;
  }
}

// Check if pair can move by dr, dc
function canMove(dr, dc) {
  return currentPair.blocks.every(b => {
    const nr = b.row + dr;
    const nc = b.col + dc;
    return nc >= 0 && nc < COLS && nr >= 0 && nr < ROWS && (boardState[nr][nc] === null ||
      (currentPair.blocks.some(ob => ob.row === nr && ob.col === nc)));
  });
}

// Check if rotation is possible
function canRotate() {
  // rotate around first block
  const pivot = currentPair.blocks[0];
  const other = currentPair.blocks[1];
  // vector
  const vr = other.row - pivot.row;
  const vc = other.col - pivot.col;
  // rotated vector: (-vc, vr)
  const nr = pivot.row - vc;
  const nc = pivot.col + vr;
  return nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && (boardState[nr][nc] === null);
}

// Apply rotation
function rotatePair() {
  if (!canRotate()) return;
  const pivot = currentPair.blocks[0];
  const other = currentPair.blocks[1];
  const vr = other.row - pivot.row;
  const vc = other.col - pivot.col;
  other.row = pivot.row - vc;
  other.col = pivot.col + vr;
}

// Fix pair into boardState
function fixPair() {
  currentPair.blocks.forEach(b => {
    boardState[b.row][b.col] = b.emoji;
  });
}

// Find all matches of 3+ in line
function checkMatches() {
  const toClear = new Set();
  // horizontal & vertical
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const emoji = boardState[r][c];
      if (!emoji) continue;
      // horizontal
      let count = 1;
      while (c+count < COLS && boardState[r][c+count] === emoji) count++;
      if (count >= 3) {
        for (let k=0; k<count; k++) toClear.add(`${r},${c+k}`);
      }
      // vertical
      count = 1;
      while (r+count < ROWS && boardState[r+count][c] === emoji) count++;
      if (count >= 3) {
        for (let k=0; k<count; k++) toClear.add(`${r+k},${c}`);
      }
    }
  }
  return Array.from(toClear).map(s => s.split(',').map(Number));
}

// Clear matched cells and update score
function clearMatches(matches) {
  matches.forEach(([r,c]) => boardState[r][c] = null);
  score += matches.length * 10;
  document.getElementById('score').textContent = score;
}

// Apply gravity so items fall down
function applyGravity() {
  for (let c = 0; c < COLS; c++) {
    const colData = [];
    for (let r = ROWS-1; r >=0; r--) {
      if (boardState[r][c]) colData.push(boardState[r][c]);
    }
    for (let r = ROWS-1; r >=0; r--) {
      boardState[r][c] = colData[ROWS-1-r] || null;
    }
  }
}

// Render board and current pair
function render() {
  document.querySelectorAll('.cell').forEach(cell => {
    const r = +cell.dataset.row;
    const c = +cell.dataset.col;
    cell.textContent = boardState[r][c] || '';
  });
  if (currentPair) {
    currentPair.blocks.forEach(b => {
      const selector = `.cell[data-row="${b.row}"][data-col="${b.col}"]`;
      const cell = document.querySelector(selector);
      if (cell) cell.textContent = b.emoji;
    });
  }
}

// Main game loop
function gameLoop() {
  if (gameState !== 'playing') return;
  if (canMove(1,0)) {
    currentPair.blocks.forEach(b => b.row++);
  } else {
    fixPair();
    // chain clear
    let chain;
    do {
      const matches = checkMatches();
      if (matches.length === 0) break;
      clearMatches(matches);
      applyGravity();
      chain = true;
    } while (chain);
    spawnPair();
  }
  render();
}

// Handle keyboard & touch
function setupInputListeners() {
  document.addEventListener('keydown', e => {
    if (gameState !== 'playing') return;
    switch(e.key) {
      case 'ArrowLeft': if (canMove(0,-1)) currentPair.blocks.forEach(b=>b.col--); break;
      case 'ArrowRight': if (canMove(0,1)) currentPair.blocks.forEach(b=>b.col++); break;
      case 'ArrowDown': if (canMove(1,0)) currentPair.blocks.forEach(b=>b.row++); break;
      case 'ArrowUp': rotatePair(); break;
      case ' ': hardDrop(); break;
    }
    render();
  });

  let touchStart = null;
  window.addEventListener('touchstart', e => {
    const t = e.touches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  });
  window.addEventListener('touchend', e => {
    if (!touchStart || gameState !== 'playing') return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && canMove(0,1)) currentPair.blocks.forEach(b=>b.col++);
      if (dx < 0 && canMove(0,-1)) currentPair.blocks.forEach(b=>b.col--);
    } else {
      if (dy > 0 && canMove(1,0)) currentPair.blocks.forEach(b=>b.row++);
      if (dy < 0) rotatePair();
    }
    render();
    touchStart = null;
  });

  document.getElementById('retry-button').addEventListener('click', () => {
    clearInterval(loopId);
    initGame();
    document.getElementById('game-over-overlay').style.display = 'none';
  });
}

// Hard drop to bottom
function hardDrop() {
  while (canMove(1,0)) {
    currentPair.blocks.forEach(b => b.row++);
  }
  render();
}

// Handle game over
function gameOver() {
  gameState = 'over';
  clearInterval(loopId);
  document.getElementById('final-score').textContent = score;
  document.getElementById('game-over-overlay').style.display = 'flex';
}

// Update the next emoji display
function updateNextEmojiDisplay() {
  const nextEmojiArea = document.getElementById('next-emoji');
  nextEmojiArea.innerHTML = '';
  const emoji1 = document.createElement('div');
  emoji1.textContent = nextPair.blocks[0].emoji;
  const emoji2 = document.createElement('div');
  emoji2.textContent = nextPair.blocks[1].emoji;
  nextEmojiArea.appendChild(emoji1);
  nextEmojiArea.appendChild(emoji2);
}

// Check for game over
function checkGameOver() {
    return boardState[0].some(cell => cell !== null);
}

// Start game on load
window.addEventListener('load', initGame);
