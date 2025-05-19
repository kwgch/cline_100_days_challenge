document.addEventListener('DOMContentLoaded', () => {
    // Get canvas and context
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match container
    function resizeCanvas() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    
    // Initial resize and add event listener for window resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.velocity = {
                x: (Math.random() - 0.5) * 4,
                y: (Math.random() - 0.5) * 4
            };
            this.opacity = 1;
            this.gravity = 0.1;
            this.friction = 0.99;
            this.lifespan = 200 + Math.random() * 100;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
        
        update() {
            this.draw();
            
            // Apply gravity if enabled
            if (gravityEnabled) {
                this.velocity.y += this.gravity;
            }
            
            // Apply friction
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            
            // Update position
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            
            // Bounce off walls
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.velocity.x = -this.velocity.x * 0.8;
                
                // Prevent particles from getting stuck at the sides
                if (this.x + this.radius > canvas.width) {
                    this.x = canvas.width - this.radius;
                }
                
                if (this.x - this.radius < 0) {
                    this.x = this.radius;
                }
            }
            
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.velocity.y = -this.velocity.y * 0.8;
                
                // Prevent particles from getting stuck at the bottom
                if (this.y + this.radius > canvas.height) {
                    this.y = canvas.height - this.radius;
                }
                
                if (this.y - this.radius < 0) {
                    this.y = this.radius;
                }
            }
            
            // Decrease lifespan and opacity
            this.lifespan--;
            if (this.lifespan <= 100) {
                this.opacity = this.lifespan / 100;
            }
        }
    }
    
    // Variables
    let particles = [];
    let gravityEnabled = true;
    let interactionEnabled = false;
    let trailsEnabled = true;
    let particleColor = '#00aaff';
    let particleSize = 15;
    let particleQuantity = 3;
    
    // Event listeners for controls
    document.getElementById('gravity-toggle').addEventListener('click', () => {
        gravityEnabled = !gravityEnabled;
    });
    
    document.getElementById('clear').addEventListener('click', () => {
        particles = [];
    });
    
    document.getElementById('particle-color').addEventListener('input', (e) => {
        particleColor = e.target.value;
    });
    
    document.getElementById('particle-size').addEventListener('input', (e) => {
        particleSize = parseInt(e.target.value);
    });
    
    document.getElementById('particle-quantity').addEventListener('input', (e) => {
        particleQuantity = parseInt(e.target.value);
    });
    
    document.getElementById('interaction-toggle').addEventListener('click', () => {
        interactionEnabled = !interactionEnabled;
    });
    
    document.getElementById('trail-toggle').addEventListener('click', () => {
        trailsEnabled = !trailsEnabled;
    });
    
    // Create particles on click/touch
    function createParticle(x, y) {
        const radius = particleSize;
        for (let i = 0; i < particleQuantity; i++) {
            particles.push(new Particle(x, y, radius * (0.5 + Math.random() * 0.5), particleColor));
        }
    }
    
    // Handle mouse/touch events
    function handlePointerDown(e) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        createParticle(x, y);
    }
    
    function handleTouchMove(e) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        // Only create particles every few frames to avoid overwhelming the system
        if (Math.random() > 0.5) {
            createParticle(x, y);
        }
    }
    
    // Add event listeners
    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('mousemove', (e) => {
        if (e.buttons === 1) { // Left mouse button is pressed
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Only create particles every few frames to avoid overwhelming the system
            if (Math.random() > 0.7) {
                createParticle(x, y);
            }
        }
    });
    
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        createParticle(x, y);
    }, { passive: false });
    
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Calculate distance between two particles
    function distance(particle1, particle2) {
        const dx = particle1.x - particle2.x;
        const dy = particle1.y - particle2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Handle particle interactions
    function handleParticleInteractions() {
        if (!interactionEnabled) return;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                
                // Calculate distance between particles
                const dist = distance(p1, p2);
                const minDist = p1.radius + p2.radius;
                
                // If particles are overlapping
                if (dist < minDist) {
                    // Calculate collision vector
                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    
                    // Calculate collision normal
                    const nx = dx / dist;
                    const ny = dy / dist;
                    
                    // Calculate relative velocity
                    const vx = p1.velocity.x - p2.velocity.x;
                    const vy = p1.velocity.y - p2.velocity.y;
                    
                    // Calculate relative velocity in terms of the normal direction
                    const velocityAlongNormal = vx * nx + vy * ny;
                    
                    // Do not resolve if velocities are separating
                    if (velocityAlongNormal > 0) continue;
                    
                    // Calculate restitution (bounciness)
                    const restitution = 0.8;
                    
                    // Calculate impulse scalar
                    let impulseScalar = -(1 + restitution) * velocityAlongNormal;
                    impulseScalar /= 2; // Equal mass assumption
                    
                    // Apply impulse
                    p1.velocity.x -= impulseScalar * nx;
                    p1.velocity.y -= impulseScalar * ny;
                    p2.velocity.x += impulseScalar * nx;
                    p2.velocity.y += impulseScalar * ny;
                    
                    // Move particles apart to prevent sticking
                    const overlap = minDist - dist;
                    const moveX = overlap * nx * 0.5;
                    const moveY = overlap * ny * 0.5;
                    
                    p1.x -= moveX;
                    p1.y -= moveY;
                    p2.x += moveX;
                    p2.y += moveY;
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (trailsEnabled) {
            // Create a semi-transparent background for trail effect
            ctx.fillStyle = 'rgba(30, 30, 30, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            // Clear the canvas completely
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        // Handle particle interactions
        handleParticleInteractions();
        
        // Update and remove dead particles
        particles = particles.filter(particle => {
            particle.update();
            return particle.lifespan > 0;
        });
        
        // Display particle count and status
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '12px Arial';
        ctx.fillText(`Particles: ${particles.length}`, 10, 20);
        ctx.fillText(`Gravity: ${gravityEnabled ? 'ON' : 'OFF'}`, 10, 40);
        ctx.fillText(`Interaction: ${interactionEnabled ? 'ON' : 'OFF'}`, 10, 60);
        ctx.fillText(`Trails: ${trailsEnabled ? 'ON' : 'OFF'}`, 10, 80);
    }
    
    // Start animation
    animate();
    
    // Add some initial particles
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        createParticle(x, y);
    }
});
