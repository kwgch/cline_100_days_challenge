class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.speed = 200;
        this.weapons = [];
        this.lastFire = 0;
        this.fireRate = 250;
    }

    update(deltaTime) {
        // Keyboard input
        if (keys['ArrowLeft']) this.x -= this.speed * deltaTime / 1000;
        if (keys['ArrowRight']) this.x += this.speed * deltaTime / 1000;
        if (keys['ArrowUp']) this.y -= this.speed * deltaTime / 1000;
        if (keys['ArrowDown']) this.y += this.speed * deltaTime / 1000;

        // Mouse input
        if (mouse.x) {
            this.x = mouse.x - this.width / 2;
        }
        if (mouse.y) {
            this.y = mouse.y - this.height / 2;
        }

        // Keep player within bounds
        if (this.x < 0) this.x = 0;
        if (this.x > game.canvas.width - this.width) this.x = game.canvas.width - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y > game.canvas.height - this.height) this.y = game.canvas.height - this.height;

        if (keys['Space'] && this.lastFire > this.fireRate) {
            this.shoot();
            this.lastFire = 0;
        }

        this.lastFire += deltaTime;

        for (let i = 0; i < this.weapons.length; i++) {
            this.weapons[i].update(deltaTime);
            if (this.weapons[i].x > game.canvas.width) {
                this.weapons.splice(i, 1);
                i--;
            }
        }
    }

    shoot() {
        const weapon = new Weapon(this.x + this.width, this.y + this.height / 2);
        this.weapons.push(weapon);
    }

    render(ctx) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height / 2); // Nose of the jet
        ctx.lineTo(this.x + this.width / 3, this.y); // Top wing
        ctx.lineTo(this.x + this.width, this.y + this.height / 3); // Right side
        ctx.lineTo(this.x + this.width, this.y + this.height * (2/3)); // Bottom right
        ctx.lineTo(this.x + this.width / 3, this.y + this.height); // Bottom wing
	    ctx.lineTo(this.x, this.y + this.height * (2/3)); // Left wing
        ctx.closePath();
        ctx.fill();

        for (let i = 0; i < this.weapons.length; i++) {
            this.weapons[i].render(ctx);
        }
    }
}

const keys = {};
document.addEventListener('keydown', function(e) {
    keys[e.code] = true;
});
document.addEventListener('keyup', function(e) {
    keys[e.code] = false;
});

const mouse = {
    x: null,
    y: null,
    touchStartX: null,
    touchStartY: null
}

document.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Touch events
document.addEventListener('touchstart', function(e) {
    e.preventDefault();
    mouse.touchStartX = e.touches[0].clientX;
    mouse.touchStartY = e.touches[0].clientY;
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
}, { passive: false });

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
    
    if (game && game.player) {
        game.player.x = e.touches[0].clientX - game.player.width / 2;
        game.player.y = e.touches[0].clientY - game.player.height / 2;
    }
}, { passive: false });

document.addEventListener('touchend', function(e) {
    e.preventDefault();
    mouse.touchStartX = null;
    mouse.touchStartY = null;
    // Shoot on tap
    if (game && game.player && game.player.lastFire > game.player.fireRate) {
        game.player.shoot();
        game.player.lastFire = 0;
    }
});

document.addEventListener('mousedown', function(e) {
    if (game && game.player && game.player.lastFire > game.player.fireRate) {
        game.player.shoot();
        game.player.lastFire = 0;
    }
});
