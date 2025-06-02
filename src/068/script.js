// Particle Life Simulator
class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.type = type;
        this.radius = 2;
    }

    update(particles, rules, friction, width, height) {
        let fx = 0;
        let fy = 0;

        // Calculate forces from other particles
        for (const other of particles) {
            if (other === this) continue;

            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0 && distance < rules.attractionRange) {
                // Get attraction/repulsion force between particle types
                const force = rules.getForce(this.type, other.type, distance);
                
                fx += (dx / distance) * force;
                fy += (dy / distance) * force;
            }
        }

        // Apply forces
        this.vx += fx * 0.1;
        this.vy += fy * 0.1;

        // Apply friction
        this.vx *= friction;
        this.vy *= friction;

        // Limit velocity
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxSpeed = 5;
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Boundary conditions (wrap around)
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }

    draw(ctx) {
        const colors = {
            0: '#ff4444', // Red
            1: '#44ff44', // Green
            2: '#4444ff', // Blue
            3: '#ffff44'  // Yellow
        };

        ctx.fillStyle = colors[this.type];
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Rules {
    constructor() {
        this.attractionRange = 80;
        this.repulsionRange = 20;
        this.matrix = this.generateRandomRules();
    }

    generateRandomRules() {
        const matrix = [];
        for (let i = 0; i < 4; i++) {
            matrix[i] = [];
            for (let j = 0; j < 4; j++) {
                // Random attraction/repulsion value between -1 and 1
                matrix[i][j] = Math.random() * 2 - 1;
            }
        }
        return matrix;
    }

    setPreset(preset) {
        switch (preset) {
            case 'default':
                this.matrix = [
                    [0.5, -0.3, 0.2, -0.1],
                    [-0.3, 0.4, -0.2, 0.3],
                    [0.2, -0.2, 0.3, -0.4],
                    [-0.1, 0.3, -0.4, 0.2]
                ];
                break;
            case 'clusters':
                this.matrix = [
                    [0.8, -0.1, -0.1, -0.1],
                    [-0.1, 0.8, -0.1, -0.1],
                    [-0.1, -0.1, 0.8, -0.1],
                    [-0.1, -0.1, -0.1, 0.8]
                ];
                break;
            case 'orbits':
                this.matrix = [
                    [0, 0.6, -0.3, 0],
                    [-0.3, 0, 0.6, -0.3],
                    [0.6, -0.3, 0, 0.6],
                    [-0.3, 0.6, -0.3, 0]
                ];
                break;
            case 'chaos':
                this.matrix = [
                    [-0.5, 0.9, -0.7, 0.3],
                    [0.8, -0.6, 0.4, -0.9],
                    [-0.7, 0.5, -0.8, 0.6],
                    [0.3, -0.9, 0.7, -0.4]
                ];
                break;
        }
    }

    getForce(type1, type2, distance) {
        const attraction = this.matrix[type1][type2];
        
        if (distance < this.repulsionRange) {
            // Strong repulsion at close range
            return -1 * (1 - distance / this.repulsionRange);
        } else if (distance < this.attractionRange) {
            // Attraction/repulsion based on matrix
            const normalizedDist = (distance - this.repulsionRange) / (this.attractionRange - this.repulsionRange);
            return attraction * (1 - normalizedDist);
        }
        
        return 0;
    }
}

class ParticleLifeSimulator {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.rules = new Rules();
        this.friction = 0.95;
        this.isMouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        
        this.setupCanvas();
        this.setupControls();
        this.setupMouse();
        this.initParticles(500);
        this.animate();
    }

    setupCanvas() {
        const resize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
    }

    setupControls() {
        // Particle count
        const particleCount = document.getElementById('particleCount');
        const particleCountValue = document.getElementById('particleCountValue');
        particleCount.addEventListener('input', (e) => {
            const count = parseInt(e.target.value);
            particleCountValue.textContent = count;
            this.initParticles(count);
        });

        // Attraction range
        const attractionRange = document.getElementById('attractionRange');
        const attractionRangeValue = document.getElementById('attractionRangeValue');
        attractionRange.addEventListener('input', (e) => {
            const range = parseInt(e.target.value);
            attractionRangeValue.textContent = range;
            this.rules.attractionRange = range;
        });

        // Repulsion range
        const repulsionRange = document.getElementById('repulsionRange');
        const repulsionRangeValue = document.getElementById('repulsionRangeValue');
        repulsionRange.addEventListener('input', (e) => {
            const range = parseInt(e.target.value);
            repulsionRangeValue.textContent = range;
            this.rules.repulsionRange = range;
        });

        // Friction
        const friction = document.getElementById('friction');
        const frictionValue = document.getElementById('frictionValue');
        friction.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            frictionValue.textContent = value.toFixed(2);
            this.friction = value;
        });
    }

    setupMouse() {
        const getMousePos = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: (e.clientX || e.touches[0].clientX) - rect.left,
                y: (e.clientY || e.touches[0].clientY) - rect.top
            };
        };

        this.canvas.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            const pos = getMousePos(e);
            this.mouseX = pos.x;
            this.mouseY = pos.y;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isMouseDown) {
                const pos = getMousePos(e);
                this.mouseX = pos.x;
                this.mouseY = pos.y;
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });

        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isMouseDown = true;
            const pos = getMousePos(e);
            this.mouseX = pos.x;
            this.mouseY = pos.y;
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.isMouseDown) {
                const pos = getMousePos(e);
                this.mouseX = pos.x;
                this.mouseY = pos.y;
            }
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.isMouseDown = false;
        });
    }

    initParticles(count) {
        this.particles = [];
        for (let i = 0; i < count; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const type = Math.floor(Math.random() * 4);
            this.particles.push(new Particle(x, y, type));
        }
    }

    update() {
        // Add particles at mouse position when dragging
        if (this.isMouseDown && this.particles.length < 2000) {
            for (let i = 0; i < 3; i++) {
                const offsetX = (Math.random() - 0.5) * 20;
                const offsetY = (Math.random() - 0.5) * 20;
                const type = Math.floor(Math.random() * 4);
                this.particles.push(new Particle(this.mouseX + offsetX, this.mouseY + offsetY, type));
            }
            
            // Update particle count display
            document.getElementById('particleCountValue').textContent = this.particles.length;
            document.getElementById('particleCount').value = this.particles.length;
        }

        // Update all particles
        for (const particle of this.particles) {
            particle.update(this.particles, this.rules, this.friction, this.canvas.width, this.canvas.height);
        }
    }

    draw() {
        // Clear with trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw particles
        for (const particle of this.particles) {
            particle.draw(this.ctx);
        }

        // Draw FPS
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.fps = Math.round(1000 / deltaTime);
        this.lastTime = currentTime;
        document.getElementById('fps').textContent = this.fps;
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Global functions for buttons
let simulator;

function resetSimulation() {
    simulator.initParticles(parseInt(document.getElementById('particleCount').value));
}

function randomizeRules() {
    simulator.rules.matrix = simulator.rules.generateRandomRules();
}

function loadPreset(preset) {
    simulator.rules.setPreset(preset);
}

// Initialize simulation
window.addEventListener('load', () => {
    simulator = new ParticleLifeSimulator();
});