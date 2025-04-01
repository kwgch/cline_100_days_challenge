const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Paddle properties
const paddleWidth = 10;
const paddleHeight = 75;
const paddleSpeed = 5;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

// Mouse controls
canvas.addEventListener('mousemove', (e) => {
    // Get mouse position relative to the canvas
    let rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;

    // Update left paddle position
    leftPaddleY = mouseY - paddleHeight / 2;

    // Keep left paddle within bounds
    if (leftPaddleY < 0) {
        leftPaddleY = 0;
    }
    if (leftPaddleY + paddleHeight > canvas.height) {
        leftPaddleY = canvas.height - paddleHeight;
    }
});

let touchStartY = 0;
let paddleStartY = 0;

function handleTouchStart(e) {
    e.preventDefault();
    let touch = e.touches[0];
    let rect = canvas.getBoundingClientRect();
    touchStartY = touch.pageY - rect.top;
    paddleStartY = leftPaddleY;
}

function handleTouchMove(e) {
    e.preventDefault();
    let touch = e.touches[0];
    let rect = canvas.getBoundingClientRect();
    let touchY = touch.pageY - rect.top;
    let deltaY = touchY - touchStartY;

    leftPaddleY = paddleStartY + deltaY;

    // パドルを画面内に収める
    if (leftPaddleY < 0) {
        leftPaddleY = 0;
    }
    if (leftPaddleY + paddleHeight > canvas.height) {
        leftPaddleY = canvas.height - paddleHeight;
    }
}

canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);

// Ball properties
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSize = 10;
let ballSpeedX = 3;
let ballSpeedY = 3;

// Scoring
let leftScore = 0;
let rightScore = 0;

// Game loop
function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();

    // AI for right paddle
    if (ballY < rightPaddleY + paddleHeight / 2) {
        rightPaddleY -= paddleSpeed;
    } else if (ballY > rightPaddleY + paddleHeight / 2) {
        rightPaddleY += paddleSpeed;
    }

    // Keep right paddle within bounds
    if (rightPaddleY < 0) {
        rightPaddleY = 0;
    }
    if (rightPaddleY + paddleHeight > canvas.height) {
        rightPaddleY = canvas.height - paddleHeight;
    }

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce off top and bottom
    if (ballY + ballSize > canvas.height || ballY - ballSize < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Bounce off paddles (basic - no collision detection yet)
    if (ballX - ballSize < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballX + ballSize > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Score (basic - no reset yet)
    if (ballX < 0) {
        rightScore++;
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
    }
    if (ballX > canvas.width) {
        leftScore++;
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
    }

    // Draw score
    ctx.font = '20px Arial';
    ctx.fillText('Player 1: ' + leftScore, 50, 30);
    ctx.fillText('Player 2: ' + rightScore, canvas.width - 150, 30);

    // Next frame
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
