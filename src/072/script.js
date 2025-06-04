class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.isPlaying = false;
        
        this.player = {
            x: 0,
            y: 0,
            radius: 15,
            trail: []
        };
        
        this.collectibles = [];
        this.enemies = [];
        this.particles = [];
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        
        document.getElementById('startButton').addEventListener('click', () => this.start());
        document.getElementById('restartButton').addEventListener('click', () => this.restart());
        
        this.player.x = this.canvas.width / 2;
        this.player.y = this.canvas.height / 2;
    }
    
    resizeCanvas() {
        const maxWidth = 800;
        const maxHeight = 600;
        const padding = 100;
        
        this.canvas.width = Math.min(window.innerWidth - padding, maxWidth);
        this.canvas.height = Math.min(window.innerHeight - padding, maxHeight);
    }
    
    handleMouseMove(e) {
        if (!this.isPlaying) return;
        
        const rect = this.canvas.getBoundingClientRect();
        this.player.x = e.clientX - rect.left;
        this.player.y = e.clientY - rect.top;
        
        this.player.trail.push({ x: this.player.x, y: this.player.y });
        if (this.player.trail.length > 20) {
            this.player.trail.shift();
        }
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        if (!this.isPlaying) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.player.x = touch.clientX - rect.left;
        this.player.y = touch.clientY - rect.top;
        
        this.player.trail.push({ x: this.player.x, y: this.player.y });
        if (this.player.trail.length > 20) {
            this.player.trail.shift();
        }
    }
    
    start() {
        document.getElementById('startScreen').style.display = 'none';
        this.isPlaying = true;
        this.spawnCollectibles();
        this.spawnEnemies();
        this.gameLoop();
    }
    
    restart() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.collectibles = [];
        this.enemies = [];
        this.particles = [];
        this.player.trail = [];
        this.updateUI();
        
        document.getElementById('gameOverScreen').style.display = 'none';
        this.start();
    }
    
    spawnCollectibles() {
        const count = 5 + this.level * 2;
        for (let i = 0; i < count; i++) {
            this.collectibles.push({
                x: Math.random() * (this.canvas.width - 40) + 20,
                y: Math.random() * (this.canvas.height - 40) + 20,
                radius: 10,
                collected: false,
                pulse: 0
            });
        }
    }
    
    spawnEnemies() {
        const count = 2 + Math.floor(this.level / 2);
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            this.enemies.push({
                x: Math.random() * (this.canvas.width - 40) + 20,
                y: Math.random() * (this.canvas.height - 40) + 20,
                radius: 15,
                speed: 1 + this.level * 0.3,
                angle: angle,
                dx: Math.cos(angle),
                dy: Math.sin(angle)
            });
        }
    }
    
    update() {
        // Update collectibles
        this.collectibles.forEach(collectible => {
            if (!collectible.collected) {
                collectible.pulse += 0.1;
                
                const dx = this.player.x - collectible.x;
                const dy = this.player.y - collectible.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.player.radius + collectible.radius) {
                    collectible.collected = true;
                    this.score += 10;
                    this.createParticles(collectible.x, collectible.y, '#FFD700');
                    this.updateUI();
                }
            }
        });
        
        // Remove collected items
        this.collectibles = this.collectibles.filter(c => !c.collected);
        
        // Check if level complete
        if (this.collectibles.length === 0) {
            this.level++;
            this.updateUI();
            this.spawnCollectibles();
            this.spawnEnemies();
        }
        
        // Update enemies
        this.enemies.forEach(enemy => {
            enemy.x += enemy.dx * enemy.speed;
            enemy.y += enemy.dy * enemy.speed;
            
            // Bounce off walls
            if (enemy.x - enemy.radius < 0 || enemy.x + enemy.radius > this.canvas.width) {
                enemy.dx *= -1;
            }
            if (enemy.y - enemy.radius < 0 || enemy.y + enemy.radius > this.canvas.height) {
                enemy.dy *= -1;
            }
            
            // Check collision with player
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.player.radius + enemy.radius) {
                this.lives--;
                this.createParticles(this.player.x, this.player.y, '#FF0000');
                this.updateUI();
                
                // Reset player position
                this.player.x = this.canvas.width / 2;
                this.player.y = this.canvas.height / 2;
                this.player.trail = [];
                
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        });
        
        // Update particles
        this.particles.forEach(particle => {
            particle.x += particle.dx;
            particle.y += particle.dy;
            particle.life -= 0.02;
        });
        
        this.particles = this.particles.filter(p => p.life > 0);
    }
    
    createParticles(x, y, color) {
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            this.particles.push({
                x: x,
                y: y,
                dx: Math.cos(angle) * 3,
                dy: Math.sin(angle) * 3,
                color: color,
                life: 1
            });
        }
    }
    
    draw() {
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw player trail
        this.player.trail.forEach((point, index) => {
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, (index / this.player.trail.length) * this.player.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(79, 195, 247, ${index / this.player.trail.length * 0.5})`;
            this.ctx.fill();
        });
        
        // Draw collectibles
        this.collectibles.forEach(collectible => {
            const pulseSize = Math.sin(collectible.pulse) * 3;
            this.ctx.beginPath();
            this.ctx.arc(collectible.x, collectible.y, collectible.radius + pulseSize, 0, Math.PI * 2);
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fill();
            
            // Draw star shape
            this.ctx.save();
            this.ctx.translate(collectible.x, collectible.y);
            this.ctx.rotate(collectible.pulse * 0.5);
            this.drawStar(0, 0, 5, collectible.radius, collectible.radius / 2);
            this.ctx.restore();
        });
        
        // Draw enemies
        this.enemies.forEach(enemy => {
            this.ctx.beginPath();
            this.ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = '#FF4444';
            this.ctx.fill();
            
            // Draw spikes
            this.ctx.save();
            this.ctx.translate(enemy.x, enemy.y);
            for (let i = 0; i < 8; i++) {
                this.ctx.rotate(Math.PI / 4);
                this.ctx.beginPath();
                this.ctx.moveTo(0, -enemy.radius);
                this.ctx.lineTo(-3, -enemy.radius - 5);
                this.ctx.lineTo(3, -enemy.radius - 5);
                this.ctx.closePath();
                this.ctx.fill();
            }
            this.ctx.restore();
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 3 * particle.life, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color + Math.floor(particle.life * 255).toString(16).padStart(2, '0');
            this.ctx.fill();
        });
        
        // Draw player as mouse pointer using Font Awesome icon
        this.ctx.save();
        this.ctx.translate(this.player.x, this.player.y);
        
        // Draw background circle for visibility
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.player.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(79, 195, 247, 0.3)';
        this.ctx.fill();
        
        // Draw mouse pointer icon
        this.ctx.font = '24px "Font Awesome 6 Free"';
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Font Awesome mouse-pointer icon (Unicode: f245)
        const mouseIcon = '\uf245';
        
        // Draw stroke first
        this.ctx.strokeText(mouseIcon, -2, 2);
        // Then fill
        this.ctx.fillText(mouseIcon, -2, 2);
        
        this.ctx.restore();
    }
    
    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
            
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }
        
        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fill();
    }
    
    updateUI() {
        document.getElementById('scoreValue').textContent = this.score;
        document.getElementById('livesValue').textContent = this.lives;
        document.getElementById('levelValue').textContent = this.level;
    }
    
    gameOver() {
        this.isPlaying = false;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverScreen').style.display = 'block';
    }
    
    gameLoop() {
        if (!this.isPlaying) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

const game = new Game();