const canvas = document.getElementById('physicsCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to fill the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 50;

const bombs = [];
const explosions = [];
const gravity = 0.5;
const friction = 0.98;
let score = 0;
let gameRunning = true;

// Target properties
let targetWidth = 40;
let targetHeight = 40;
let targetX = canvas.width / 2 - targetWidth / 2;
let targetY = canvas.height - targetHeight;
let targetSpeed = 2;
let targetDirection = 1;
const targetEmoji = "😈";
let enemyPresent = true;

function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

function drawTarget() {
    if (enemyPresent) {
        ctx.font = `${targetHeight}px Arial`;
        ctx.fillStyle = 'red';
        ctx.fillText(targetEmoji, targetX, targetY + targetHeight * 0.8);
    }
}

class Bomb {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = Math.random() * 4 - 2;
        this.dy = Math.random() * 4 - 2;
        this.color = 'black';
    }

    update() {
        this.dy += gravity;
        this.dx *= friction;
        this.dy *= friction;
        this.x += this.dx;
        this.y += this.dy;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y > canvas.height) {
            this.explode();
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x - this.radius / 2, this.y - this.radius);
        ctx.lineTo(this.x - this.radius / 4, this.y - this.radius * 1.5);
        ctx.stroke();
    }

    checkCollision() {
        if (
            this.x + this.radius > targetX &&
            this.x - this.radius < targetX + targetWidth &&
            this.y + this.radius > targetY &&
            this.y - this.radius < targetY + targetHeight &&
            enemyPresent
        ) {
            return true;
        }
        return false;
    }

    explode() {
        if (this.checkCollision()) {
            score++;
            updateScore();
            enemyPresent = false;
        }
        explosions.push(new Explosion(this.x, this.y));
        const index = bombs.indexOf(this);
        if (index > -1) {
            bombs.splice(index, 1);
        }
    }
}

class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: this.x + (Math.random() - 0.5) * 20,
                y: this.y + (Math.random() - 0.5) * 20,
                radius: Math.random() * 3 + 1,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                dx: Math.random() * 6 - 3,
                dy: Math.random() * 6 - 3
            });
        }
        this.life = 100;
    }

    update() {
        this.life--;
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].x += this.particles[i].dx;
            this.particles[i].y += this.particles[i].dy;
        }
    }

    draw() {
        for (let i = 0; i < this.particles.length; i++) {
            ctx.fillStyle = this.particles[i].color;
            ctx.beginPath();
            ctx.arc(this.particles[i].x, this.particles[i].y, this.particles[i].radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }
}

function createBomb(x, y) {
    const radius = Math.random() * 20 + 10;
    bombs.push(new Bomb(x, y, radius));
}

function resetEnemy() {
    if (!enemyPresent) {
        targetX = canvas.width / 2 - targetWidth / 2;
        enemyPresent = true;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update target position
    if (enemyPresent) {
        targetX += targetSpeed * targetDirection;
        if (targetX + targetWidth > canvas.width || targetX < 0) {
            targetDirection = -targetDirection;
        }
    }

    // Draw target
    drawTarget();

    // Update and draw bombs
    for (let i = bombs.length - 1; i >= 0; i--) {
        bombs[i].update();
        if (bombs[i]) bombs[i].draw();
    }

    // Update and draw explosions
    for (let i = explosions.length - 1; i >= 0; i--) {
        const explosion = explosions[i];
        if (explosion) {
            explosion.update();
            explosion.draw();
            if (explosion.life <= 0) {
                explosions.splice(i, 1);
            }
        }
    }

    requestAnimationFrame(animate);
}

// Create bombs on click/touch
canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    createBomb(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
});
canvas.addEventListener('mousedown', (e) => {
    createBomb(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
});

// Start the game
updateScore();
animate();

setInterval(() => {
    resetEnemy();
}, 3000);
