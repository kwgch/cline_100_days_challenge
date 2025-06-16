class TimeConceptVisualizer {
    constructor() {
        this.canvas = document.getElementById('timeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.mode = 'linear';
        this.particles = [];
        this.timeFlow = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isInteracting = false;
        
        this.perspectives = {
            linear: {
                name: '線形時間',
                description: '過去から未来へ一方向に流れる時間',
                color: '#4a90e2'
            },
            circular: {
                name: '循環時間',
                description: '始まりも終わりもない、永遠に繰り返す時間',
                color: '#e74c3c'
            },
            quantum: {
                name: '量子時間',
                description: '観測されるまで確定しない、重ね合わせの時間',
                color: '#9b59b6'
            },
            relative: {
                name: '相対時間',
                description: '速度と重力によって伸び縮みする時間',
                color: '#f39c12'
            },
            entropy: {
                name: 'エントロピー時間',
                description: '秩序から無秩序へ向かう不可逆な時間',
                color: '#1abc9c'
            },
            memory: {
                name: '記憶の時間',
                description: '過去と現在が混在する主観的な時間',
                color: '#34495e'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.bindEvents();
        this.createParticles();
        this.startAnimation();
        this.updateTimeDisplay();
    }
    
    setupCanvas() {
        const resize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
    }
    
    bindEvents() {
        // モード切替
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelector('.mode-btn.active').classList.remove('active');
                btn.classList.add('active');
                this.mode = btn.dataset.mode;
                this.updatePerspective();
                this.resetParticles();
            });
        });
        
        // マウス/タッチイベント
        this.canvas.addEventListener('mousedown', () => this.isInteracting = true);
        this.canvas.addEventListener('mouseup', () => this.isInteracting = false);
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isInteracting = true;
            if (e.touches.length > 0) {
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
            }
        });
        
        this.canvas.addEventListener('touchend', () => this.isInteracting = false);
        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
            }
        });
    }
    
    createParticles() {
        this.particles = [];
        const count = 100;
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: 0,
                vy: 0,
                size: Math.random() * 3 + 1,
                age: Math.random() * 100,
                lifespan: Math.random() * 200 + 100,
                memory: [],
                quantum: {
                    states: [],
                    collapsed: false
                }
            });
        }
    }
    
    resetParticles() {
        this.particles.forEach(p => {
            p.age = 0;
            p.memory = [];
            p.quantum.collapsed = false;
            p.quantum.states = [];
        });
    }
    
    updateTimeDisplay() {
        setInterval(() => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('ja-JP');
            document.getElementById('currentTime').textContent = timeStr;
            
            // モードに応じた時間情報
            let info = '';
            switch (this.mode) {
                case 'linear':
                    info = `経過: ${Math.floor(this.timeFlow / 60)}秒`;
                    break;
                case 'circular':
                    info = `周期: ${(this.timeFlow % 360).toFixed(0)}°`;
                    break;
                case 'quantum':
                    info = `重ね合わせ: ${this.particles.filter(p => !p.quantum.collapsed).length}`;
                    break;
                case 'relative':
                    const speed = Math.sqrt(this.mouseX ** 2 + this.mouseY ** 2) / 1000;
                    const timeDilation = 1 / Math.sqrt(1 - speed ** 2);
                    info = `時間の遅れ: x${timeDilation.toFixed(3)}`;
                    break;
                case 'entropy':
                    const order = this.calculateOrder();
                    info = `秩序度: ${(order * 100).toFixed(1)}%`;
                    break;
                case 'memory':
                    const memories = this.particles.reduce((sum, p) => sum + p.memory.length, 0);
                    info = `記憶: ${memories}`;
                    break;
            }
            document.getElementById('timeInfo').textContent = info;
        }, 100);
    }
    
    updatePerspective() {
        const perspective = this.perspectives[this.mode];
        document.getElementById('perspectiveText').innerHTML = 
            `<strong>${perspective.name}</strong><br>${perspective.description}`;
    }
    
    startAnimation() {
        const animate = () => {
            this.update();
            this.render();
            requestAnimationFrame(animate);
        };
        animate();
        this.updatePerspective();
    }
    
    update() {
        this.timeFlow++;
        
        switch (this.mode) {
            case 'linear':
                this.updateLinear();
                break;
            case 'circular':
                this.updateCircular();
                break;
            case 'quantum':
                this.updateQuantum();
                break;
            case 'relative':
                this.updateRelative();
                break;
            case 'entropy':
                this.updateEntropy();
                break;
            case 'memory':
                this.updateMemory();
                break;
        }
        
        // パーティクルの更新
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.age++;
            
            // 画面端での処理
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -0.9;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -0.9;
            
            // 寿命チェック
            if (p.age > p.lifespan) {
                p.age = 0;
                p.x = Math.random() * this.canvas.width;
                p.y = Math.random() * this.canvas.height;
            }
        });
    }
    
    updateLinear() {
        this.particles.forEach(p => {
            p.vx = 1;
            p.vy = 0;
            
            if (this.isInteracting) {
                const dx = this.mouseX - p.x;
                const dy = this.mouseY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    p.vx += dx / dist * 2;
                    p.vy += dy / dist * 2;
                }
            }
        });
    }
    
    updateCircular() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.particles.forEach((p, i) => {
            const angle = (this.timeFlow + i * 10) * 0.01;
            const radius = 100 + i * 2;
            
            const targetX = centerX + Math.cos(angle) * radius;
            const targetY = centerY + Math.sin(angle) * radius;
            
            p.vx = (targetX - p.x) * 0.05;
            p.vy = (targetY - p.y) * 0.05;
            
            if (this.isInteracting) {
                const dx = this.mouseX - p.x;
                const dy = this.mouseY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    p.vx += dx / dist * 5;
                    p.vy += dy / dist * 5;
                }
            }
        });
    }
    
    updateQuantum() {
        this.particles.forEach(p => {
            // 重ね合わせ状態の生成
            if (!p.quantum.collapsed) {
                if (p.quantum.states.length < 5) {
                    p.quantum.states.push({
                        x: p.x + (Math.random() - 0.5) * 50,
                        y: p.y + (Math.random() - 0.5) * 50,
                        probability: Math.random()
                    });
                }
                
                // ランダムウォーク
                p.vx = (Math.random() - 0.5) * 2;
                p.vy = (Math.random() - 0.5) * 2;
            }
            
            // 観測による波動関数の崩壊
            if (this.isInteracting) {
                const dx = this.mouseX - p.x;
                const dy = this.mouseY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100 && !p.quantum.collapsed) {
                    p.quantum.collapsed = true;
                    // 最も確率の高い状態に収束
                    const state = p.quantum.states.reduce((max, s) => 
                        s.probability > max.probability ? s : max, 
                        { probability: 0 }
                    );
                    if (state.x) {
                        p.x = state.x;
                        p.y = state.y;
                    }
                    p.quantum.states = [];
                    p.vx = 0;
                    p.vy = 0;
                }
            } else if (p.quantum.collapsed && Math.random() < 0.01) {
                // 時間経過で再び重ね合わせ状態に
                p.quantum.collapsed = false;
            }
        });
    }
    
    updateRelative() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // マウス位置を重力源として扱う
        const gravityX = this.isInteracting ? this.mouseX : centerX;
        const gravityY = this.isInteracting ? this.mouseY : centerY;
        const gravityStrength = this.isInteracting ? 1000 : 500;
        
        this.particles.forEach(p => {
            const dx = gravityX - p.x;
            const dy = gravityY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // 重力による加速
            if (dist > 10) {
                const force = gravityStrength / (dist * dist);
                p.vx += dx / dist * force;
                p.vy += dy / dist * force;
            }
            
            // 速度による時間の遅れ（視覚的表現）
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            p.size = 1 + Math.min(speed / 10, 5);
            
            // 減衰
            p.vx *= 0.98;
            p.vy *= 0.98;
        });
    }
    
    updateEntropy() {
        this.particles.forEach(p => {
            // エントロピー増大（ランダム性の増加）
            p.vx += (Math.random() - 0.5) * 0.5;
            p.vy += (Math.random() - 0.5) * 0.5;
            
            // インタラクションで一時的に秩序を作る
            if (this.isInteracting) {
                const dx = this.mouseX - p.x;
                const dy = this.mouseY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 200) {
                    // マウス周辺で整列
                    const angle = Math.atan2(dy, dx);
                    const targetVx = Math.cos(angle + Math.PI / 2) * 2;
                    const targetVy = Math.sin(angle + Math.PI / 2) * 2;
                    
                    p.vx = p.vx * 0.9 + targetVx * 0.1;
                    p.vy = p.vy * 0.9 + targetVy * 0.1;
                }
            }
            
            // 速度制限
            const maxSpeed = 5;
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > maxSpeed) {
                p.vx = p.vx / speed * maxSpeed;
                p.vy = p.vy / speed * maxSpeed;
            }
        });
    }
    
    updateMemory() {
        this.particles.forEach(p => {
            // 過去の位置を記憶
            if (this.timeFlow % 5 === 0) {
                p.memory.push({ x: p.x, y: p.y, time: this.timeFlow });
                if (p.memory.length > 20) {
                    p.memory.shift();
                }
            }
            
            // 通常の動き
            p.vx = Math.sin(this.timeFlow * 0.01 + p.age * 0.01) * 2;
            p.vy = Math.cos(this.timeFlow * 0.01 + p.age * 0.01) * 2;
            
            // インタラクションで過去に戻る
            if (this.isInteracting && p.memory.length > 0) {
                const pastPos = p.memory[0];
                const dx = pastPos.x - p.x;
                const dy = pastPos.y - p.y;
                p.vx = dx * 0.05;
                p.vy = dy * 0.05;
            }
        });
    }
    
    calculateOrder() {
        // エントロピーモードでの秩序度計算
        let totalVariance = 0;
        const avgVx = this.particles.reduce((sum, p) => sum + p.vx, 0) / this.particles.length;
        const avgVy = this.particles.reduce((sum, p) => sum + p.vy, 0) / this.particles.length;
        
        this.particles.forEach(p => {
            totalVariance += Math.pow(p.vx - avgVx, 2) + Math.pow(p.vy - avgVy, 2);
        });
        
        return 1 / (1 + totalVariance / this.particles.length);
    }
    
    render() {
        const ctx = this.ctx;
        const perspective = this.perspectives[this.mode];
        
        // 背景（残像効果）
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // モード別の背景効果
        this.renderBackground();
        
        // パーティクル描画
        this.particles.forEach(p => {
            ctx.save();
            
            switch (this.mode) {
                case 'linear':
                    // 尾を引くエフェクト
                    const gradient = ctx.createLinearGradient(p.x - 20, p.y, p.x, p.y);
                    gradient.addColorStop(0, 'transparent');
                    gradient.addColorStop(1, perspective.color);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = p.size;
                    ctx.beginPath();
                    ctx.moveTo(p.x - p.vx * 10, p.y - p.vy * 10);
                    ctx.lineTo(p.x, p.y);
                    ctx.stroke();
                    break;
                    
                case 'circular':
                    // 円形の軌跡
                    ctx.fillStyle = perspective.color;
                    ctx.globalAlpha = 0.8;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                    
                case 'quantum':
                    if (!p.quantum.collapsed) {
                        // 重ね合わせ状態
                        p.quantum.states.forEach(state => {
                            ctx.fillStyle = perspective.color;
                            ctx.globalAlpha = state.probability * 0.3;
                            ctx.beginPath();
                            ctx.arc(state.x, state.y, p.size * 2, 0, Math.PI * 2);
                            ctx.fill();
                        });
                    }
                    // 実体
                    ctx.fillStyle = p.quantum.collapsed ? '#fff' : perspective.color;
                    ctx.globalAlpha = p.quantum.collapsed ? 1 : 0.5;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                    
                case 'relative':
                    // 速度による歪み
                    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                    ctx.fillStyle = perspective.color;
                    ctx.globalAlpha = 0.8;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.scale(1 + speed / 20, 1);
                    ctx.rotate(Math.atan2(p.vy, p.vx));
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                    break;
                    
                case 'entropy':
                    // カオス的な動き
                    ctx.fillStyle = perspective.color;
                    ctx.globalAlpha = 0.6;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                    
                case 'memory':
                    // 過去の軌跡
                    if (p.memory.length > 1) {
                        ctx.strokeStyle = perspective.color;
                        ctx.beginPath();
                        p.memory.forEach((mem, i) => {
                            ctx.globalAlpha = i / p.memory.length * 0.5;
                            if (i === 0) {
                                ctx.moveTo(mem.x, mem.y);
                            } else {
                                ctx.lineTo(mem.x, mem.y);
                            }
                        });
                        ctx.lineTo(p.x, p.y);
                        ctx.stroke();
                    }
                    // 現在
                    ctx.fillStyle = '#fff';
                    ctx.globalAlpha = 1;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
            }
            
            ctx.restore();
        });
    }
    
    renderBackground() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        ctx.save();
        ctx.globalAlpha = 0.1;
        
        switch (this.mode) {
            case 'linear':
                // 時間の流れを表す線
                ctx.strokeStyle = this.perspectives.linear.color;
                ctx.lineWidth = 1;
                for (let i = 0; i < 10; i++) {
                    ctx.beginPath();
                    ctx.moveTo(0, h * i / 10);
                    ctx.lineTo(w, h * i / 10);
                    ctx.stroke();
                }
                break;
                
            case 'circular':
                // 同心円
                ctx.strokeStyle = this.perspectives.circular.color;
                ctx.lineWidth = 1;
                const centerX = w / 2;
                const centerY = h / 2;
                for (let r = 50; r < Math.max(w, h); r += 50) {
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
                    ctx.stroke();
                }
                break;
                
            case 'quantum':
                // 確率の雲
                const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h)/2);
                gradient.addColorStop(0, this.perspectives.quantum.color);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, w, h);
                break;
                
            case 'relative':
                // 時空の歪み
                ctx.strokeStyle = this.perspectives.relative.color;
                ctx.lineWidth = 1;
                const gridSize = 50;
                for (let x = 0; x < w; x += gridSize) {
                    for (let y = 0; y < h; y += gridSize) {
                        const dx = x - this.mouseX;
                        const dy = y - this.mouseY;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const distortion = this.isInteracting ? 200 / (dist + 100) : 0;
                        
                        ctx.beginPath();
                        ctx.moveTo(x + distortion * dx / dist, y + distortion * dy / dist);
                        ctx.lineTo(x + gridSize, y);
                        ctx.stroke();
                        
                        ctx.beginPath();
                        ctx.moveTo(x, y + distortion * dy / dist);
                        ctx.lineTo(x, y + gridSize);
                        ctx.stroke();
                    }
                }
                break;
        }
        
        ctx.restore();
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new TimeConceptVisualizer();
});