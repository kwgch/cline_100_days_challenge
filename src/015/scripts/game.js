import { Cannon } from './cannon.js';
import { Projectile } from './projectile.js';
import { Target } from './target.js';
import { getRandomNumber } from './utils.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const cannon = new Cannon(canvas.width, canvas.height);
const target = new Target(canvas.width, canvas.height, cannon.x);
const projectiles = [];

let mouseDownTime = 0;

canvas.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
        mouseDownTime = Date.now();
    }
});

canvas.addEventListener('mouseup', () => {
    const mouseUpTime = Date.now();
    const holdTime = mouseUpTime - mouseDownTime;
    const power = Math.min(holdTime / 10, 100); // Adjust the scaling factor as needed
    projectiles.push(new Projectile(cannon.x, cannon.y, cannon.angle, cannon.power));
});

function gameLoop() {
    // Update game state
    cannon.update();
    target.update();

    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].update();

        // Check for collision
        if (projectiles[i].x > target.x && projectiles[i].x < target.x + target.width &&
            projectiles[i].y > target.y && projectiles[i].y < target.y + target.height) {
            projectiles.splice(i, 1);
            target.x = Math.random() * (canvas.width - target.width);
            target.y = canvas.height - 50;
            console.log('Hit!');
        }
    }

    // Draw game elements
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cannon.draw(ctx);
    target.draw(ctx);

    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].draw(ctx);
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
