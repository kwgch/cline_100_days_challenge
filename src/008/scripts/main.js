// Game variables
import Player from './entities/Player.js';
import Invader from './entities/Invader.js';
import Bullet from './entities/Bullet.js';
import CollisionDetector from './game/CollisionDetector.js';
import ScoreManager from './game/ScoreManager.js';

// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 20;
const PLAYER_COLOR = 'green';
const PLAYER_X = canvas.width / 2 - PLAYER_WIDTH / 2;
const PLAYER_Y = canvas.height - PLAYER_HEIGHT;

const INVADER_WIDTH = 20;
const INVADER_HEIGHT = 20;
const INVADER_COLOR = 'red';

const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 10;
const BULLET_COLOR = 'white';

const INVADER_ROWS = 3;
const INVADER_COLUMNS = 10;
const INVADER_PADDING = 20;
const INVADER_OFFSET_TOP = 50;
const INVADER_OFFSET_LEFT = 30;

const INVADER_SHOOTING_PROBABILITY = 0.005;

// Game objects
const player = new Player(PLAYER_X, PLAYER_Y, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR);
const invaders = [];
const bullets = [];
const collisionDetector = new CollisionDetector();
const scoreManager = new ScoreManager();
let gameOver = false;

function createInvaderBullet(invader) {
  const bulletX = invader.x + invader.width / 2 - BULLET_WIDTH / 2;
  const bulletY = invader.y + invader.height;
  const bullet = new Bullet(bulletX, bulletY, BULLET_WIDTH, BULLET_HEIGHT, BULLET_COLOR, false);
  bullets.push(bullet);
}

function createInvaders() {
  for (let row = 0; row < INVADER_ROWS; row++) {
    for (let col = 0; col < INVADER_COLUMNS; col++) {
      const x = col * (INVADER_WIDTH + INVADER_PADDING) + INVADER_OFFSET_LEFT;
      const y = row * (INVADER_HEIGHT + INVADER_PADDING) + INVADER_OFFSET_TOP;
      const invader = new Invader(x, y, INVADER_WIDTH, INVADER_HEIGHT, INVADER_COLOR);
      invaders.push(invader);
    }
  }
}

createInvaders();

// Input handling
let leftPressed = false;
let rightPressed = false;
let spacePressed = false;

function createBullet() {
  const bulletX = player.x + player.width / 2 - BULLET_WIDTH / 2;
  const bulletY = player.y - BULLET_HEIGHT;
  const bullet = new Bullet(bulletX, bulletY, BULLET_WIDTH, BULLET_HEIGHT, BULLET_COLOR, true);
  bullets.push(bullet);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    leftPressed = true;
  } else if (event.key === 'ArrowRight') {
    rightPressed = true;
  } else if (event.key === ' ') {
    spacePressed = true;
    createBullet();
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft') {
    leftPressed = false;
  } else if (event.key === 'ArrowRight') {
    rightPressed = false;
  } else if (event.key === ' ') {
    spacePressed = false;
  }
});

canvas.addEventListener('mousemove', (event) => {
  if (gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  player.x = mouseX - player.width / 2;

  // Keep player within bounds
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x > canvas.width - player.width) {
    player.x = canvas.width - player.width;
  }
});

// Game loop
function gameLoop() {
  // Update game state
  update();

  // Draw game elements
  draw();

  // Request next frame
  requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
  if (gameOver) {
    return;
  }

  // Player movement
  if (leftPressed) {
    player.x -= player.speed;
  }
  if (rightPressed) {
    player.x += player.speed;
  }

  // Keep player within bounds
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x > canvas.width - player.width) {
    player.x = canvas.width - player.width;
  }

  // Update bullets
  bullets.forEach(bullet => bullet.update());

   // Update invaders
  for (let i = 0; i < invaders.length; i++) {
    const invader = invaders[i];
    invader.update();

    // Check if invader has reached the edge of the screen
    if (invader.x <= 0 || invader.x >= canvas.width - invader.width) {
      invaders.forEach(invader => {
        invader.direction *= -1;
        invader.y += 10;
      });
      
      break; // Skip collision detection this frame
    }

    // Invader shooting
    if (Math.random() < INVADER_SHOOTING_PROBABILITY) {
      createInvaderBullet(invader);
    }
  }

  // Detect collisions
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];

    if (bullet.isPlayerBullet) {
      for (let j = 0; j < invaders.length; j++) {
        const invader = invaders[j];

        if (collisionDetector.detectCollision(bullet, invader)) {
          // Remove bullet and invader
          bullets.splice(i, 1);
          invaders.splice(j, 1);
          i--;
          j--;

          // Update score
          scoreManager.addScore(10);
          break; // Break inner loop after collision
        }
      }
    } else {
      if (collisionDetector.detectCollision(bullet, player)) {
        // Game Over
        gameOver = true;
        console.log('Game Over!');
      }
    }

    // Remove bullets that are out of bounds
    if (bullet.y > canvas.height || bullet.y < 0) {
      bullets.splice(i, 1);
      i--;
    }
  }
}

// Draw game elements
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  player.draw(ctx);

  // Draw invaders
  invaders.forEach(invader => invader.draw(ctx));

   // Draw bullets
  bullets.forEach(bullet => bullet.draw(ctx));

  // Draw score
  ctx.textAlign = 'left';
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + scoreManager.getScore(), 10, 30);

  // Check if game is clear
  if (invaders.length === 0) {
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Clear!', canvas.width / 2, canvas.height / 2 + 50);
  }

  if (gameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 + 50);
  }
}

// Start the game loop
gameLoop();
