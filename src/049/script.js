const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

const mazeWidth = 20;
const mazeHeight = 20;
let cellSize;

let maze = [];
let playerX = 0;
let playerY = 0;
let hasBomb = false;
let mazeState = [];
let enemies = [];
const enemyEmoji = '😈';

function resizeCanvas() {
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetWidth;
	cellSize = canvas.width / mazeWidth;
	drawMaze();
}

function generateMaze() {
	maze = [];
	mazeState = [];
	enemies = [];
	for (let y = 0; y < mazeHeight; y++) {
		maze[y] = [];
		mazeState[y] = [];
		for (let x = 0; x < mazeWidth; x++) {
			const isWall = Math.random() < 0.3;
			maze[y][x] = isWall ? 1 : 0; // 1 for wall, 0 for path
			mazeState[y][x] = isWall ? 1 : 0;
		}
	}
	maze[0][0] = 0; // Start point
	mazeState[0][0] = 0;
	maze[mazeHeight - 1][mazeWidth - 1] = 0; // End point
	mazeState[mazeHeight - 1][mazeWidth - 1] = 0;

	// Place enemies
	for (let i = 0; i < 3; i++) {
		let enemyX, enemyY;
		do {
			enemyX = Math.floor(Math.random() * mazeWidth);
			enemyY = Math.floor(Math.random() * mazeHeight);
		} while (mazeState[enemyY][enemyX] === 1 || (enemyX === 0 && enemyY === 0) ||
			(enemyX === mazeWidth - 1 && enemyY === mazeHeight - 1));
		enemies.push({
			x: enemyX,
			y: enemyY
		});
	}
}

function drawMaze() {
	ctx.fillStyle = 'green';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = 'gray';
	for (let y = 0; y < mazeHeight; y++) {
		for (let x = 0; x < mazeWidth; x++) {
			if (mazeState[y][x] === 1) {
				ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
			}
		}
	}

	// Draw the goal
	ctx.font = cellSize + 'px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = 'green';
	ctx.fillText('🚪', (mazeWidth - 1) * cellSize + cellSize / 2, (mazeHeight - 1) *
		cellSize + cellSize / 2);

	// Draw the player as an emoji
	ctx.font = cellSize + 'px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = 'blue';
	ctx.fillText('🧑‍🚀', playerX * cellSize + cellSize / 2, playerY * cellSize +
		cellSize / 2);

	// Draw the bomb
	if (hasBomb && bombX !== -1 && bombY !== -1) {
		ctx.font = cellSize + 'px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = 'black';
		ctx.fillText('💣', bombX * cellSize + cellSize / 2, bombY * cellSize +
			cellSize / 2);
	}

	// Draw the enemies
	ctx.font = cellSize + 'px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = 'yellow';
	for (const enemy of enemies) {
		ctx.fillText(enemyEmoji, enemy.x * cellSize + cellSize / 2, enemy.y *
			cellSize + cellSize / 2);
	}
}

function movePlayer(dx, dy) {
	if (playerX + dx >= 0 && playerX + dx < mazeWidth &&
		playerY + dy >= 0 && playerY < mazeHeight &&
		mazeState[playerY + dy][playerX + dx] === 0) {
		playerX += dx;
		playerY += dy;

		// Check for collision with enemies
		for (const enemy of enemies) {
			if (enemy.x === playerX && enemy.y === playerY) {
				document.getElementById('gameOver').style.display = 'block';
				return;
			}
		}

		drawMaze();

		// Check if the player reached the goal
		if (playerX === mazeWidth - 1 && playerY === mazeHeight - 1) {
			document.getElementById('youWin').style.display = 'block';
		}
	}
}

function move(dx, dy) {
	movePlayer(dx, dy);
}

function handleKeyDown(event) {
	switch (event.key) {
		case 'ArrowUp':
			movePlayer(0, -1);
			break;
		case 'ArrowDown':
			movePlayer(0, 1);
			break;
		case 'ArrowLeft':
			movePlayer(-1, 0);
			break;
		case 'ArrowRight':
			movePlayer(1, 0);
			break;
	}
}

generateMaze();
resizeCanvas();
drawMaze();

window.addEventListener('resize', resizeCanvas);
document.addEventListener('keydown', handleKeyDown);

let bombX = -1;
let bombY = -1;

resetGame();

// Add bomb placement functionality
function placeBomb() {
	if (!hasBomb) {
		bombX = playerX;
		bombY = playerY;
		hasBomb = true;
		drawMaze(); // Redraw the maze to show the bomb
		setTimeout(explodeBomb, 3000);
	}
}

function explodeBomb() {
	if (hasBomb) {
		// Check if player is in blast radius (1 cell)
		if (Math.abs(playerX - bombX) <= 1 && Math.abs(playerY - bombY) <= 1) {
			// Visual explosion effect
			ctx.fillStyle = 'red';
			for (let x = bombX - 1; x <= bombX + 1; x++) {
				for (let y = bombY - 1; y <= bombY + 1; y++) {
					if (x >= 0 && x < mazeWidth && y >= 0 && y < mazeHeight) {
						ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
					}
				}
			}
			setTimeout(() => {
				document.getElementById('gameOver').style.display = 'block';
			}, 200);
			return;
		}

		// Visual explosion effect
		ctx.fillStyle = 'red';
		for (let x = bombX - 1; x <= bombX + 1; x++) {
			for (let y = bombY - 1; y <= bombY + 1; y++) {
				if (x >= 0 && x < mazeWidth && y >= 0 && y < mazeHeight) {
					ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
				}
			}
		}

		setTimeout(() => {
			// Destroy walls around the bomb
			for (let x = bombX - 1; x <= bombX + 1; x++) {
				for (let y = bombY - 1; y <= bombY + 1; y++) {
					if (x >= 0 && x < mazeWidth && y >= 0 && y < mazeHeight) {
						mazeState[y][x] = 0; // Set to path
					}
				}
			}

			// Kill enemies in blast radius
			for (let i = enemies.length - 1; i >= 0; i--) {
				const enemy = enemies[i];
				if (Math.abs(enemy.x - bombX) <= 1 && Math.abs(enemy.y - bombY) <= 1) {
					enemies.splice(i, 1);
				}
			}

			bombX = -1;
			bombY = -1;
			hasBomb = false;
			drawMaze();
		}, 200);
	}
}

function drawMaze() {
	ctx.fillStyle = 'green';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = 'gray';
	for (let y = 0; y < mazeHeight; y++) {
		for (let x = 0; x < mazeWidth; x++) {
			if (mazeState[y][x] === 1) {
				ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
			}
		}
	}

	// Draw the goal
	ctx.font = cellSize + 'px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = 'green';
	ctx.fillText('🚪', (mazeWidth - 1) * cellSize + cellSize / 2, (mazeHeight - 1) *
		cellSize + cellSize / 2);

	// Draw the player as an emoji
	ctx.font = cellSize + 'px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = 'blue';
	ctx.fillText('🧑‍🚀', playerX * cellSize + cellSize / 2, playerY * cellSize +
		cellSize / 2);

	// Draw the bomb
	if (hasBomb && bombX !== -1 && bombY !== -1) {
		ctx.font = cellSize + 'px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = 'black';
		ctx.fillText('💣', bombX * cellSize + cellSize / 2, bombY * cellSize +
			cellSize / 2);
	}

	// Draw the enemies
	ctx.font = cellSize + 'px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = 'yellow';
	for (const enemy of enemies) {
		ctx.fillText(enemyEmoji, enemy.x * cellSize + cellSize / 2, enemy.y *
			cellSize + cellSize / 2);
	}
}

function resetGame() {
	document.getElementById('gameOver').style.display = 'none';
	document.getElementById('youWin').style.display = 'none';
	playerX = 0;
	playerY = 0;
	bombX = -1;
	bombY = -1;
	hasBomb = false;
	generateMaze();
	drawMaze();

	// Move enemies randomly
	setInterval(moveEnemies, 1000);
}

function moveEnemies() {
	for (let i = 0; i < enemies.length; i++) {
		const enemy = enemies[i];
		const directions = [
			[0, -1],
			[0, 1],
			[-1, 0],
			[1, 0]
		];
		const randomDirection = directions[Math.floor(Math.random() * directions.length)];
		const dx = randomDirection[0];
		const dy = randomDirection[1];

		if (enemy.x + dx >= 0 && enemy.x + dx < mazeWidth &&
			enemy.y + dy >= 0 && enemy.y < mazeHeight &&
			mazeState[enemy.y + dy][enemy.x + dx] === 0) {
			enemy.x += dx;
			enemy.y += dy;

			// Check for collision with player
			if (enemy.x === playerX && enemy.y === playerY) {
				document.getElementById('gameOver').style.display = 'block';
				return;
			}
		}
	}
	drawMaze();
}

// Touch controls
function move(dx, dy) {
	movePlayer(dx, dy);
}
