// Project data with categorization
const projects = [
    { id: 1, title: "Othello", category: "games", icon: "⚫", description: "Classic board game implementation" },
    { id: 2, title: "Poker", category: "games", icon: "🃏", description: "Card game with AI opponents" },
    { id: 3, title: "Calculator", category: "tools", icon: "🧮", description: "Functional calculator app" },
    { id: 4, title: "Shogi", category: "games", icon: "♟️", description: "Japanese chess game" },
    { id: 5, title: "Font Converter", category: "tools", icon: "🔤", description: "Typography conversion tool" },
    { id: 6, title: "Catch Game", category: "games", icon: "🎯", description: "Interactive catching game" },
    { id: 7, title: "File Translator", category: "tools", icon: "🌐", description: "Multi-language file translator" },
    { id: 8, title: "Space Invaders", category: "games", icon: "👾", description: "Classic arcade game remake" },
    { id: 9, title: "Image Editing Software", category: "tools", icon: "🎨", description: "Browser-based image editor" },
    { id: 10, title: "Air Hockey", category: "games", icon: "🏒", description: "2-player air hockey game" },
    { id: 11, title: "Rating System", category: "tools", icon: "⭐", description: "Elo rating calculator" },
    { id: 12, title: "Sudoku Auto-Generator", category: "games", icon: "🔢", description: "Puzzle generator and solver" },
    { id: 13, title: "15 Puzzle", category: "games", icon: "🧩", description: "Classic sliding puzzle" },
    { id: 14, title: "Dummy Data Generator", category: "tools", icon: "📊", description: "Test data creation tool" },
    { id: 15, title: "Cannonball Game", category: "games", icon: "💣", description: "Physics-based shooting game" },
    { id: 16, title: "Translation Bot", category: "ai", icon: "🤖", description: "AI-powered translator" },
    { id: 17, title: "Air Raid Game", category: "games", icon: "✈️", description: "Aerial combat game" },
    { id: 18, title: "Flashcard App", category: "tools", icon: "📝", description: "Study aid application" },
    { id: 19, title: "Airplane Flying Simulation", category: "games", icon: "🛩️", description: "Flight simulator" },
    { id: 20, title: "2-Back Memory Game", category: "games", icon: "🧠", description: "Cognitive training game" },
    { id: 21, title: "Firework Game", category: "art", icon: "🎆", description: "Interactive fireworks display" },
    { id: 22, title: "Target Click Game", category: "games", icon: "🎯", description: "Precision clicking game" },
    { id: 23, title: "Game of Life", category: "art", icon: "🦠", description: "Conway's cellular automaton" },
    { id: 24, title: "Inference Data Quiz", category: "games", icon: "❓", description: "Logic puzzle game" },
    { id: 25, title: "Endless Runner", category: "games", icon: "🏃", description: "Infinite running game" },
    { id: 26, title: "3D Brick Breaker", category: "games", icon: "🧱", description: "3D arcade classic" },
    { id: 27, title: "Rolling Ball Maze Game", category: "games", icon: "🌀", description: "3D maze navigation" },
    { id: 28, title: "Number Cam", category: "ai", icon: "📷", description: "Number recognition camera" },
    { id: 29, title: "3D Metaball", category: "art", icon: "💧", description: "Organic 3D animation" },
    { id: 30, title: "Emoji Face Match Puzzle", category: "games", icon: "😊", description: "Matching puzzle game" },
    { id: 31, title: "Interactive Circles", category: "art", icon: "⭕", description: "Generative art piece" },
    { id: 32, title: "Interactive Tesseract", category: "art", icon: "🔷", description: "4D visualization" },
    { id: 33, title: "Genetic Life Game", category: "ai", icon: "🧬", description: "Evolution simulation" },
    { id: 34, title: "Fluid Simulation", category: "art", icon: "💧", description: "Realistic fluid dynamics" },
    { id: 35, title: "3D Interactive Art", category: "art", icon: "🎭", description: "WebGL art experience" },
    { id: 36, title: "Transformer Attention Visualization", category: "ai", icon: "🤖", description: "AI model visualization" },
    { id: 37, title: "Japanese GPT-2 Visualization", category: "ai", icon: "🗾", description: "Language model demo" },
    { id: 38, title: "3D Generative Art", category: "art", icon: "🎨", description: "Procedural 3D creation" },
    { id: 39, title: "Image Gallery", category: "tools", icon: "🖼️", description: "Photo display app" },
    { id: 40, title: "Cho-Han", category: "games", icon: "🎲", description: "Japanese dice game" },
    { id: 41, title: "Flappy Bird", category: "games", icon: "🐦", description: "Classic mobile game" },
    { id: 42, title: "Endless Runner", category: "games", icon: "🏃", description: "Infinite platformer" },
    { id: 43, title: "Rhythm Game", category: "games", icon: "🎵", description: "Music-based game" },
    { id: 44, title: "Drawing App", category: "tools", icon: "✏️", description: "Digital sketch pad" },
    { id: 45, title: "Color Palette Generator", category: "tools", icon: "🎨", description: "Color scheme creator" },
    { id: 46, title: "Bomb Drop", category: "games", icon: "💣", description: "Strategic bombing game" },
    { id: 47, title: "Memory Game", category: "games", icon: "🧠", description: "Card matching game" },
    { id: 48, title: "Chat Joke", category: "ai", icon: "😄", description: "AI joke generator" },
    { id: 49, title: "Maze Game", category: "games", icon: "🌀", description: "Classic maze navigation" },
    { id: 50, title: "Genetic Image Evolution", category: "ai", icon: "🧬", description: "Evolutionary art generator" },
    { id: 51, title: "Magic Circle Generator", category: "art", icon: "⭕", description: "Mystical pattern creator" },
    { id: 52, title: "Abstract Drawing App", category: "art", icon: "🎨", description: "Abstract art tool" },
    { id: 53, title: "Interactive space exploration", category: "art", icon: "🌌", description: "Space visualization" },
    { id: 54, title: "Black Hole Simulator", category: "art", icon: "⚫", description: "Physics simulation" },
    { id: 55, title: "Friend", category: "experimental", icon: "👥", description: "Social experiment" },
    { id: 56, title: "Genetic Sound Visualizer", category: "art", icon: "🎵", description: "Audio-visual experience" },
    { id: 57, title: "D3.js Interesting Thing", category: "art", icon: "📊", description: "Data visualization" },
    { id: 58, title: "Interactive Art with three.js", category: "art", icon: "🎭", description: "3D interactive art" },
    { id: 59, title: "WebGL Shader Sample", category: "art", icon: "🌈", description: "GPU shader demo" },
    { id: 60, title: "Unusual Tetris", category: "games", icon: "🟦", description: "Tetris with a twist" },
    { id: 61, title: "Something sinister", category: "experimental", icon: "👻", description: "Mystery experience" },
    { id: 62, title: "Self-replicating code", category: "experimental", icon: "🔄", description: "Code that reproduces" },
    { id: 63, title: "Something incomprehensible", category: "experimental", icon: "❓", description: "Abstract experience" },
    { id: 64, title: "Evil", category: "experimental", icon: "😈", description: "Dark experiment" },
    { id: 65, title: "NEXUS BREAKER", category: "experimental", icon: "💥", description: "Reality bending" },
    { id: 66, title: "Flocking Simulation", category: "art", icon: "🐦", description: "Boid algorithm demo" },
    { id: 67, title: "Music Box Sequencer", category: "tools", icon: "🎵", description: "Music creation tool" },
    { id: 68, title: "Particle Life Simulator", category: "art", icon: "⚡", description: "Emergent behavior sim" },
    { id: 69, title: "Emoji Memory Game", category: "games", icon: "😊", description: "Emoji matching game" },
    { id: 70, title: "Confused UI", category: "experimental", icon: "🤔", description: "UX experiment" },
    { id: 71, title: "Singularity Cult", category: "experimental", icon: "🌀", description: "AI worship simulator" },
    { id: 72, title: "Mouse Pointer Game", category: "games", icon: "🖱️", description: "Cursor-based game" },
    { id: 73, title: "KANBAN Game", category: "games", icon: "📋", description: "Task management game" },
    { id: 74, title: "Password Strength Visualizer", category: "tools", icon: "🔐", description: "Security checker" },
    { id: 75, title: "Quaternionic Fractal", category: "art", icon: "🌐", description: "4D fractal viewer" },
    { id: 76, title: "Emoji catch", category: "games", icon: "😄", description: "Emoji catching game" },
    { id: 77, title: "4D Fractal Projection", category: "art", icon: "🔮", description: "Higher dimension fractals" },
    { id: 78, title: "NotGPT", category: "ai", icon: "🤖", description: "AI chat parody" },
    { id: 79, title: "Fake x", category: "experimental", icon: "❌", description: "Social media clone" },
    { id: 80, title: "Fake wikipedia", category: "experimental", icon: "📚", description: "Knowledge base parody" },
    { id: 81, title: "Vertical writing SNS", category: "experimental", icon: "📝", description: "Vertical text social" },
    { id: 82, title: "Diagnosis Generator", category: "tools", icon: "🩺", description: "Fun diagnosis maker" },
    { id: 83, title: "Creepy-Cute Art Generator", category: "art", icon: "👹", description: "Unsettling art creator" },
    { id: 84, title: "Anti-Viral Post Generator", category: "tools", icon: "🦠", description: "Content creator" },
    { id: 85, title: "Staring Game", category: "games", icon: "👁️", description: "Eye contact challenge" },
    { id: 86, title: "Low-Effort Meme Generator", category: "tools", icon: "😂", description: "Quick meme maker" },
    { id: 87, title: "Concepts of Time", category: "experimental", icon: "⏰", description: "Time exploration" },
    { id: 88, title: "Visualizing Infinity", category: "experimental", icon: "♾️", description: "Infinite concepts" },
    { id: 89, title: "Embodying Contradictions", category: "experimental", icon: "⚡", description: "Paradox explorer" },
    { id: 90, title: "Making Non-Existence Exist", category: "experimental", icon: "🌌", description: "Void manifestation" },
    { id: 91, title: "Perfectly Imperfect", category: "experimental", icon: "💎", description: "Flaw celebration" },
    { id: 92, title: "Motion Without Movement", category: "experimental", icon: "🌊", description: "Static animation" },
    { id: 93, title: "Invisible Colors", category: "experimental", icon: "🌈", description: "Unseen spectrum" },
    { id: 94, title: "Where Beginning Meets End", category: "experimental", icon: "🔄", description: "Circular concepts" },
    { id: 95, title: "Topology Visualizer", category: "art", icon: "🎯", description: "Shape transformation" },
    { id: 96, title: "Dream Logic Circuit", category: "experimental", icon: "💭", description: "Surreal computing" },
    { id: 97, title: "Instant Wow", category: "experimental", icon: "✨", description: "Immediate impact" },
    { id: 98, title: "Hyper-Realistic 3D", category: "art", icon: "🎮", description: "Ultra-realistic render" },
    { id: 99, title: "Tactile Playground", category: "experimental", icon: "🤲", description: "Touch experience" },
    { id: 100, title: "100 Days Complete!", category: "special", icon: "🎉", description: "Journey showcase" }
];

// DOM elements
const loadingScreen = document.getElementById('loading');
const celebrationOverlay = document.getElementById('celebration');
const projectsGrid = document.getElementById('projects-grid');
const timeline = document.getElementById('timeline');
const modal = document.getElementById('project-modal');
const modalIframe = document.getElementById('project-iframe');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalLink = document.getElementById('modal-link');

// State
let currentFilter = 'all';
let currentView = 'gallery';

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
    simulateLoading();
    setupEventListeners();
    calculateStats();
}

// Loading simulation
function simulateLoading() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.floor(progress)}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    showCelebration();
                }, 500);
            }, 500);
        }
    }, 100);
}

// Celebration
function showCelebration() {
    celebrationOverlay.style.display = 'flex';
    drawConfetti();
}

function startExploring() {
    celebrationOverlay.style.opacity = '0';
    setTimeout(() => {
        celebrationOverlay.style.display = 'none';
        renderProjects();
    }, 500);
}

// Confetti animation
function drawConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    const colors = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];
    
    for (let i = 0; i < 150; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 5 + 3,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            angle: Math.random() * Math.PI * 2,
            va: Math.random() * 0.1 - 0.05
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach(p => {
            ctx.save();
            ctx.translate(p.x + p.w/2, p.y + p.h/2);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
            ctx.restore();
            
            p.x += p.vx;
            p.y += p.vy;
            p.angle += p.va;
            p.vy += 0.1;
            
            if (p.y > canvas.height) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Event listeners
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderProjects();
        });
    });
    
    // View buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            switchView();
        });
    });
    
    // Modal close
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Prevent touch scrolling on mobile
    document.addEventListener('touchmove', (e) => {
        if (e.target.closest('.modal')) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Render projects
function renderProjects() {
    const filteredProjects = currentFilter === 'all' 
        ? projects 
        : projects.filter(p => p.category === currentFilter);
    
    projectsGrid.innerHTML = '';
    
    filteredProjects.forEach((project, index) => {
        const card = createProjectCard(project);
        setTimeout(() => {
            projectsGrid.appendChild(card);
            card.classList.add('fade-in');
        }, index * 30);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card hover-lift';
    card.innerHTML = `
        <div class="project-number">Day ${project.id}</div>
        <div class="project-preview">
            <div class="project-icon">${project.icon}</div>
        </div>
        <div class="project-info">
            <h3 class="project-title">${project.title}</h3>
            <span class="project-category">${project.category}</span>
        </div>
    `;
    
    card.addEventListener('click', () => openProject(project));
    return card;
}

// Timeline view
function renderTimeline() {
    timeline.innerHTML = '';
    
    projects.forEach((project, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content hover-lift">
                <div class="timeline-date">Day ${project.id}</div>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
            </div>
        `;
        
        item.querySelector('.timeline-content').addEventListener('click', () => openProject(project));
        
        setTimeout(() => {
            timeline.appendChild(item);
            item.classList.add('fade-in');
        }, index * 20);
    });
}

// Stats view
function renderStats() {
    renderProjectChart();
    renderTechStats();
    renderAchievements();
}

function renderProjectChart() {
    const canvas = document.getElementById('project-chart');
    const ctx = canvas.getContext('2d');
    const categories = ['games', 'tools', 'art', 'ai', 'experimental'];
    const counts = categories.map(cat => projects.filter(p => p.category === cat).length);
    
    // Simple bar chart
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / categories.length * 0.8;
    const maxCount = Math.max(...counts);
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#6366f1';
    
    categories.forEach((cat, i) => {
        const barHeight = (counts[i] / maxCount) * (height - 40);
        const x = i * (width / categories.length) + (width / categories.length - barWidth) / 2;
        const y = height - barHeight - 20;
        
        ctx.fillRect(x, y, barWidth, barHeight);
        
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(cat, x + barWidth / 2, height - 5);
        ctx.fillText(counts[i], x + barWidth / 2, y - 5);
        ctx.fillStyle = '#6366f1';
    });
}

function renderTechStats() {
    const techStats = document.getElementById('tech-stats');
    const technologies = [
        { name: 'JavaScript', count: 100 },
        { name: 'HTML5', count: 100 },
        { name: 'CSS3', count: 100 },
        { name: 'Canvas API', count: 45 },
        { name: 'WebGL', count: 12 },
        { name: 'Three.js', count: 8 },
        { name: 'P5.js', count: 6 },
        { name: 'AI/ML', count: 15 }
    ];
    
    techStats.innerHTML = technologies.map(tech => `
        <div class="tech-item hover-lift">
            <div class="tech-name">${tech.name}</div>
            <div class="tech-count">${tech.count}</div>
        </div>
    `).join('');
}

function renderAchievements() {
    const achievements = document.getElementById('achievements');
    const achievementList = [
        { icon: '🏆', name: 'Completed!' },
        { icon: '🎮', name: '40+ Games' },
        { icon: '🎨', name: 'Creative Coder' },
        { icon: '🤖', name: 'AI Explorer' },
        { icon: '🌟', name: 'Daily Streak' },
        { icon: '💡', name: 'Innovator' },
        { icon: '🚀', name: 'Ship It!' },
        { icon: '🧪', name: 'Experimenter' }
    ];
    
    achievements.innerHTML = achievementList.map(ach => `
        <div class="achievement hover-lift">
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-name">${ach.name}</div>
        </div>
    `).join('');
}

// View switching
function switchView() {
    document.querySelectorAll('.view-container').forEach(v => v.classList.remove('active'));
    document.getElementById(`${currentView}-view`).classList.add('active');
    
    if (currentView === 'gallery') renderProjects();
    else if (currentView === 'timeline') renderTimeline();
    else if (currentView === 'stats') renderStats();
}

// Project modal
function openProject(project) {
    if (project.id === 100) {
        alert('You are already viewing the showcase!');
        return;
    }
    
    modal.style.display = 'block';
    modalTitle.textContent = `Day ${project.id}: ${project.title}`;
    modalDescription.textContent = project.description;
    modalIframe.src = `../${String(project.id).padStart(3, '0')}/index.html`;
    modalLink.href = `../${String(project.id).padStart(3, '0')}/index.html`;
    
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeModal() {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        modalIframe.src = '';
    }, 300);
}

// Stats calculation
function calculateStats() {
    // Estimate stats
    const totalLines = projects.length * 250; // Average lines per project
    const totalFiles = projects.length * 3; // Average files per project
    
    document.getElementById('total-lines').textContent = totalLines.toLocaleString();
    document.getElementById('total-files').textContent = totalFiles.toLocaleString();
}

// Share functionality
function shareJourney() {
    const text = `I completed the 100 Days of Code Challenge! 🎉\n\n100 projects, countless lines of code, and an incredible learning journey.\n\n#100DaysOfCode`;
    
    if (navigator.share) {
        navigator.share({
            title: '100 Days of Code Complete!',
            text: text,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(text);
        alert('Journey details copied to clipboard!');
    }
}

// Window resize handler
window.addEventListener('resize', () => {
    if (celebrationOverlay.style.display === 'flex') {
        drawConfetti();
    }
});