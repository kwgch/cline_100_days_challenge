const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let target = { x: 0, y: 0 };
let isInteracting = false;

const PARTICLE_COUNT = 200;
const COOL_COLORS = [
    '#00D9FF', // Cyan
    '#0096FF', // Light Blue
    '#0059FF', // Blue
    '#4B0082', // Indigo
    '#00CED1', // Dark Turquoise
    '#20B2AA', // Light Sea Green
    '#00FFFF', // Aqua
    '#1E90FF'  // Dodger Blue
];

const EYE_COLOR = '#FF0040'; // Bright Red

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor(isEye = false) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.maxSpeed = 3;
        this.maxForce = 0.05;
        this.isEye = isEye;
        this.size = isEye ? 4 : 2 + Math.random() * 2;
        this.color = isEye ? EYE_COLOR : COOL_COLORS[Math.floor(Math.random() * COOL_COLORS.length)];
        this.trail = [];
        this.maxTrailLength = 10;
    }

    flock(particles) {
        let alignment = this.align(particles);
        let cohesion = this.cohere(particles);
        let separation = this.separate(particles);
        let seek = this.seek(target);

        alignment.mult(1.0);
        cohesion.mult(1.0);
        separation.mult(1.5);
        seek.mult(isInteracting ? 2.0 : 0.2);

        this.applyForce(alignment);
        this.applyForce(cohesion);
        this.applyForce(separation);
        this.applyForce(seek);
    }

    align(particles) {
        let perceptionRadius = 50;
        let steering = new Vector(0, 0);
        let total = 0;

        for (let other of particles) {
            let d = dist(this.x, this.y, other.x, other.y);
            if (other !== this && d < perceptionRadius) {
                steering.add(new Vector(other.vx, other.vy));
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(new Vector(this.vx, this.vy));
            steering.limit(this.maxForce);
        }
        return steering;
    }

    cohere(particles) {
        let perceptionRadius = 50;
        let steering = new Vector(0, 0);
        let total = 0;

        for (let other of particles) {
            let d = dist(this.x, this.y, other.x, other.y);
            if (other !== this && d < perceptionRadius) {
                steering.add(new Vector(other.x, other.y));
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.sub(new Vector(this.x, this.y));
            steering.setMag(this.maxSpeed);
            steering.sub(new Vector(this.vx, this.vy));
            steering.limit(this.maxForce);
        }
        return steering;
    }

    separate(particles) {
        let perceptionRadius = 25;
        let steering = new Vector(0, 0);
        let total = 0;

        for (let other of particles) {
            let d = dist(this.x, this.y, other.x, other.y);
            if (other !== this && d < perceptionRadius && d > 0) {
                let diff = new Vector(this.x - other.x, this.y - other.y);
                diff.div(d * d);
                steering.add(diff);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(new Vector(this.vx, this.vy));
            steering.limit(this.maxForce);
        }
        return steering;
    }

    seek(target) {
        let desired = new Vector(target.x - this.x, target.y - this.y);
        desired.setMag(this.maxSpeed);
        let steering = desired.sub(new Vector(this.vx, this.vy));
        steering.limit(this.maxForce);
        return steering;
    }

    applyForce(force) {
        this.vx += force.x;
        this.vy += force.y;
    }

    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        this.x += this.vx;
        this.y += this.vy;

        let vel = new Vector(this.vx, this.vy);
        vel.limit(this.maxSpeed);
        this.vx = vel.x;
        this.vy = vel.y;

        this.edges();
    }

    edges() {
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        // Draw trail
        ctx.strokeStyle = this.color + '40';
        ctx.lineWidth = this.size * 0.5;
        ctx.beginPath();
        for (let i = 0; i < this.trail.length; i++) {
            if (i === 0) {
                ctx.moveTo(this.trail[i].x, this.trail[i].y);
            } else {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
        }
        ctx.stroke();

        // Draw particle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Vector helper class
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    mult(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }

    div(n) {
        this.x /= n;
        this.y /= n;
        return this;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    setMag(n) {
        let m = this.mag();
        if (m !== 0) {
            this.mult(n / m);
        }
        return this;
    }

    limit(max) {
        if (this.mag() > max) {
            this.setMag(max);
        }
        return this;
    }
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function init() {
    resizeCanvas();
    particles = [];
    
    // Create one red "eye" particle
    particles.push(new Particle(true));
    
    // Create the rest as cool-colored particles
    for (let i = 1; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle(false));
    }
    
    target.x = canvas.width / 2;
    target.y = canvas.height / 2;
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let particle of particles) {
        particle.flock(particles);
        particle.update();
        particle.draw();
    }

    requestAnimationFrame(animate);
}

// Mouse events
canvas.addEventListener('mousedown', (e) => {
    isInteracting = true;
    target.x = e.clientX;
    target.y = e.clientY;
});

canvas.addEventListener('mousemove', (e) => {
    if (isInteracting) {
        target.x = e.clientX;
        target.y = e.clientY;
    }
});

canvas.addEventListener('mouseup', () => {
    isInteracting = false;
});

// Touch events
let lastTouch = null;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isInteracting = true;
    const touch = e.touches[0];
    target.x = touch.clientX;
    target.y = touch.clientY;
    lastTouch = { x: touch.clientX, y: touch.clientY };
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isInteracting) {
        const touch = e.touches[0];
        target.x = touch.clientX;
        target.y = touch.clientY;
        
        // Calculate swipe velocity for more dynamic movement
        if (lastTouch) {
            const dx = touch.clientX - lastTouch.x;
            const dy = touch.clientY - lastTouch.y;
            target.x += dx * 2;
            target.y += dy * 2;
        }
        lastTouch = { x: touch.clientX, y: touch.clientY };
    }
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    isInteracting = false;
    lastTouch = null;
});

// Window resize
window.addEventListener('resize', () => {
    resizeCanvas();
});

// Initialize and start animation
init();
animate();