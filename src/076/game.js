let scene, camera, renderer;
let player, emojis = [];
let score = 0, timeLeft = 60, level = 1;
let gameRunning = false;
let mouseX = 0;
let raycaster, mouse;

const goodEmojis = ['🌟', '💎', '🎁', '🍎', '🍕', '🍔', '🍩', '🍭', '🎈', '🌈'];
const badEmojis = ['💣', '💀', '🕷️', '🦠', '☠️'];
const specialEmojis = ['🚀', '⭐', '🔥'];

class EmojiSprite {
    constructor(emoji, x, y, z, type = 'good') {
        this.emoji = emoji;
        this.type = type;
        this.position = { x, y, z };
        this.velocity = { y: -0.08 - (level * 0.01) };
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        
        // Create canvas for emoji texture
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        
        // Clear and draw emoji
        context.clearRect(0, 0, 256, 256);
        context.font = '200px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(emoji, 128, 128);
        
        // Create texture and sprite
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        this.sprite = new THREE.Sprite(material);
        this.sprite.scale.set(1, 1, 1);
        this.sprite.position.set(x, y, z);
        
        if (type === 'special') {
            this.sprite.scale.set(1.5, 1.5, 1.5);
        }
        
        scene.add(this.sprite);
    }
    
    update() {
        this.position.y += this.velocity.y;
        this.sprite.position.y = this.position.y;
        this.rotation += this.rotationSpeed;
        this.sprite.material.rotation = this.rotation;
        
        // Bounce effect for special emojis
        if (this.type === 'special') {
            this.sprite.scale.x = 1.5 + Math.sin(Date.now() * 0.005) * 0.2;
            this.sprite.scale.y = 1.5 + Math.sin(Date.now() * 0.005) * 0.2;
        }
    }
    
    remove() {
        scene.remove(this.sprite);
    }
}

function init() {
    // Setup scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 10, 50);
    
    // Setup camera
    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.set(0, 0, 10);
    
    // Setup renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('game-container').appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Create player (basket)
    const geometry = new THREE.CylinderGeometry(1, 0.8, 0.5, 32);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x8B4513,
        emissive: 0x4A2511,
        emissiveIntensity: 0.2
    });
    player = new THREE.Mesh(geometry, material);
    player.position.y = -4;
    player.castShadow = true;
    player.receiveShadow = true;
    scene.add(player);
    
    // Add basket rim
    const rimGeometry = new THREE.TorusGeometry(1, 0.1, 8, 32);
    const rimMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.position.y = 0.25;
    rim.rotation.x = Math.PI / 2;
    player.add(rim);
    
    // Add ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x90EE90,
        side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Setup raycaster for collision detection
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Setup controls
    setupControls();
}

function setupControls() {
    // Mouse controls
    document.addEventListener('mousemove', (event) => {
        if (!gameRunning) return;
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        player.position.x = mouseX * 6; // Reduced from 8 to 6 for better mobile control
    });
    
    // Touch controls
    document.addEventListener('touchmove', (event) => {
        if (!gameRunning) return;
        event.preventDefault();
        const touch = event.touches[0];
        mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
        player.position.x = mouseX * 6; // Reduced from 8 to 6 for better mobile control
    }, { passive: false });
}

function spawnEmoji() {
    if (!gameRunning) return;
    
    const x = (Math.random() - 0.5) * 10; // Reduced spawn area for mobile
    const y = 8;
    const z = 0;
    
    let emoji, type;
    const rand = Math.random();
    
    if (rand < 0.05 && level > 2) {
        // Special emoji (5% chance after level 2)
        emoji = specialEmojis[Math.floor(Math.random() * specialEmojis.length)];
        type = 'special';
    } else if (rand < 0.2 + (level * 0.02)) {
        // Bad emoji (20% + level bonus chance)
        emoji = badEmojis[Math.floor(Math.random() * badEmojis.length)];
        type = 'bad';
    } else {
        // Good emoji
        emoji = goodEmojis[Math.floor(Math.random() * goodEmojis.length)];
        type = 'good';
    }
    
    const emojiSprite = new EmojiSprite(emoji, x, y, z, type);
    emojis.push(emojiSprite);
}

function checkCollisions() {
    const playerBox = new THREE.Box3().setFromObject(player);
    
    for (let i = emojis.length - 1; i >= 0; i--) {
        const emoji = emojis[i];
        const emojiBox = new THREE.Box3().setFromObject(emoji.sprite);
        
        if (playerBox.intersectsBox(emojiBox)) {
            // Collision detected
            if (emoji.type === 'good') {
                score += 10;
                createParticles(emoji.sprite.position, 0x00ff00);
            } else if (emoji.type === 'bad') {
                score = Math.max(0, score - 20);
                timeLeft = Math.max(0, timeLeft - 5);
                createParticles(emoji.sprite.position, 0xff0000);
            } else if (emoji.type === 'special') {
                score += 50;
                timeLeft += 10;
                createParticles(emoji.sprite.position, 0xffff00);
            }
            
            emoji.remove();
            emojis.splice(i, 1);
            updateUI();
        } else if (emoji.position.y < -6) {
            // Remove emoji if it's too low
            emoji.remove();
            emojis.splice(i, 1);
        }
    }
}

function createParticles(position, color) {
    const particleCount = 20;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = position.x;
        positions[i * 3 + 1] = position.y;
        positions[i * 3 + 2] = position.z;
        
        velocities.push({
            x: (Math.random() - 0.5) * 0.2,
            y: Math.random() * 0.2,
            z: (Math.random() - 0.5) * 0.2
        });
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: color,
        size: 0.3,
        transparent: true,
        opacity: 1
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // Animate particles
    let frame = 0;
    const animateParticles = () => {
        frame++;
        if (frame > 30) {
            scene.remove(particles);
            return;
        }
        
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 1] += velocities[i].y;
            positions[i * 3 + 2] += velocities[i].z;
            velocities[i].y -= 0.01;
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
        particles.material.opacity = 1 - frame / 30;
        
        requestAnimationFrame(animateParticles);
    };
    animateParticles();
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('time').textContent = Math.ceil(timeLeft);
    document.getElementById('level').textContent = level;
}

function gameLoop() {
    if (!gameRunning) return;
    
    // Update emojis
    emojis.forEach(emoji => emoji.update());
    
    // Check collisions
    checkCollisions();
    
    // Update time
    timeLeft -= 0.016;
    if (timeLeft <= 0) {
        endGame();
        return;
    }
    
    // Level progression
    if (score > level * 100) {
        level++;
        updateUI();
    }
    
    // Spawn new emojis (increased spawn rate)
    if (Math.random() < 0.04 + (level * 0.008)) {
        spawnEmoji();
    }
    
    updateUI();
    
    // Render
    renderer.render(scene, camera);
    requestAnimationFrame(gameLoop);
}

function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-over').classList.add('hidden');
    
    score = 0;
    timeLeft = 60;
    level = 1;
    gameRunning = true;
    
    // Clear existing emojis
    emojis.forEach(emoji => emoji.remove());
    emojis = [];
    
    updateUI();
    gameLoop();
}

function endGame() {
    gameRunning = false;
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-level').textContent = level;
    document.getElementById('game-over').classList.remove('hidden');
}

function resetGame() {
    startGame();
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Prevent pull-to-refresh on mobile
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// Initialize game when page loads
window.addEventListener('load', init);