class InstantWow {
    constructor() {
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.time = 0;
        this.effects = {
            tunnel: true,
            storm: true,
            energy: true,
            explosion: true,
            orb: true,
            burst: true,
            matrix: true,
            glitch: true
        };
        this.particles = [];
        this.matrixDrops = [];
        
        this.init();
    }
    
    init() {
        this.showLoadingScreen();
        this.setupMouseTracking();
        this.setupEffectControls();
        this.setupFullscreen();
        
        // エフェクトの初期化
        this.initTunnel();
        this.initParticleStorm();
        this.initEnergyField();
        this.initTextExplosion();
        this.initReactiveOrb();
        this.initLightBurst();
        this.initDataStream();
        this.initGlitchEffect();
        
        // アニメーション開始
        setTimeout(() => {
            this.hideLoadingScreen();
            this.startAnimations();
            this.triggerWowMoment();
        }, 2000);
    }
    
    // ローディング画面
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const progress = loadingScreen.querySelector('.loading-progress');
        
        let width = 0;
        const interval = setInterval(() => {
            width += 5;
            progress.style.width = width + '%';
            
            if (width >= 100) {
                clearInterval(interval);
            }
        }, 50);
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    
    // マウストラッキング
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // ヒント非表示
            const hint = document.getElementById('interactionHint');
            hint.style.opacity = '0';
        });
        
        // タッチデバイス対応
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.mouseX = touch.clientX;
            this.mouseY = touch.clientY;
        });
    }
    
    // 3Dトンネル
    initTunnel() {
        const canvas = document.getElementById('tunnelCanvas');
        const ctx = canvas.getContext('2d');
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        
        const drawTunnel = () => {
            if (!this.effects.tunnel) return;
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const time = this.time * 0.02;
            
            // トンネルのリング
            for (let z = 0; z < 50; z++) {
                const depth = (z + time % 1) / 50;
                const scale = Math.pow(depth, 2);
                const radius = 300 * scale;
                const alpha = 1 - depth;
                
                ctx.beginPath();
                ctx.strokeStyle = `hsla(${z * 10 + time * 100}, 100%, 50%, ${alpha})`;
                ctx.lineWidth = 3 * scale;
                
                // 歪み効果
                const offsetX = (this.mouseX - centerX) * depth * 0.1;
                const offsetY = (this.mouseY - centerY) * depth * 0.1;
                
                ctx.arc(centerX + offsetX, centerY + offsetY, radius, 0, Math.PI * 2);
                ctx.stroke();
            }
        };
        
        this.tunnelAnimation = () => {
            drawTunnel();
            requestAnimationFrame(this.tunnelAnimation);
        };
    }
    
    // パーティクルストーム
    initParticleStorm() {
        const canvas = document.getElementById('particleStorm');
        const ctx = canvas.getContext('2d');
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        
        // パーティクル生成
        for (let i = 0; i < 1000; i++) {
            this.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                size: Math.random() * 3 + 1,
                hue: Math.random() * 360,
                life: 1
            });
        }
        
        const drawStorm = () => {
            if (!this.effects.storm) return;
            
            ctx.globalCompositeOperation = 'lighter';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            this.particles.forEach(p => {
                // マウスとの相互作用
                const dx = p.x - this.mouseX;
                const dy = p.y - this.mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    const force = (200 - distance) / 200;
                    p.vx += (dx / distance) * force * 2;
                    p.vy += (dy / distance) * force * 2;
                }
                
                // 中心への引力
                const cdx = centerX - p.x;
                const cdy = centerY - p.y;
                p.vx += cdx * 0.0001;
                p.vy += cdy * 0.0001;
                
                // 更新
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.98;
                p.vy *= 0.98;
                p.hue += 1;
                
                // 描画
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, ${p.life})`;
                ctx.fill();
                
                // 境界処理
                if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
                    p.x = Math.random() * canvas.width;
                    p.y = Math.random() * canvas.height;
                    p.vx = (Math.random() - 0.5) * 10;
                    p.vy = (Math.random() - 0.5) * 10;
                }
            });
            
            ctx.globalCompositeOperation = 'source-over';
        };
        
        this.stormAnimation = () => {
            drawStorm();
            requestAnimationFrame(this.stormAnimation);
        };
    }
    
    // エネルギーフィールド
    initEnergyField() {
        const field = document.getElementById('energyField');
        const core = field.querySelector('.energy-core');
        
        this.energyAnimation = () => {
            if (!this.effects.energy) {
                field.style.display = 'none';
                return;
            }
            field.style.display = 'block';
            
            const dx = this.mouseX - window.innerWidth / 2;
            const dy = this.mouseY - window.innerHeight / 2;
            const angle = Math.atan2(dy, dx);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // コアの変形
            const scaleX = 1 + distance / window.innerWidth;
            const scaleY = 1 + distance / window.innerHeight;
            
            core.style.transform = `scale(${scaleX}, ${scaleY}) rotate(${angle}rad)`;
            
            requestAnimationFrame(this.energyAnimation);
        };
    }
    
    // テキスト爆発
    initTextExplosion() {
        const container = document.getElementById('textExplosion');
        const particlesContainer = container.querySelector('.text-particles');
        
        const createExplosion = () => {
            particlesContainer.innerHTML = '';
            
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'text-particle';
                particle.textContent = ['W', 'O', 'W', '!', '★'][Math.floor(Math.random() * 5)];
                
                const angle = (Math.PI * 2 / 50) * i + Math.random() * 0.5;
                const velocity = 5 + Math.random() * 10;
                const size = Math.random() * 2 + 1;
                
                particle.style.setProperty('--vx', Math.cos(angle) * velocity);
                particle.style.setProperty('--vy', Math.sin(angle) * velocity);
                particle.style.fontSize = size + 'rem';
                particle.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
                
                particlesContainer.appendChild(particle);
            }
        };
        
        // 定期的に爆発
        setInterval(() => {
            if (this.effects.explosion) {
                createExplosion();
            }
        }, 3000);
        
        createExplosion();
    }
    
    // リアクティブオーブ
    initReactiveOrb() {
        const orb = document.getElementById('reactiveOrb');
        const waves = orb.querySelector('.wave-circle');
        
        this.orbAnimation = () => {
            if (!this.effects.orb) {
                orb.style.display = 'none';
                return;
            }
            orb.style.display = 'block';
            
            const dx = this.mouseX - window.innerWidth / 2;
            const dy = this.mouseY - window.innerHeight / 2;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 波形の生成
            const points = [];
            const segments = 50;
            
            for (let i = 0; i <= segments; i++) {
                const angle = (Math.PI * 2 / segments) * i;
                const waveOffset = Math.sin(angle * 3 + this.time * 0.05) * 10;
                const mouseInfluence = Math.sin(angle - Math.atan2(dy, dx)) * (200 - Math.min(distance, 200)) / 10;
                const radius = 100 + waveOffset + mouseInfluence;
                
                const x = 200 + Math.cos(angle) * radius;
                const y = 200 + Math.sin(angle) * radius;
                points.push(`${x},${y}`);
            }
            
            waves.setAttribute('points', points.join(' '));
            
            requestAnimationFrame(this.orbAnimation);
        };
    }
    
    // 光線バースト
    initLightBurst() {
        const burst = document.getElementById('lightBurst');
        const rays = burst.querySelectorAll('.burst-ray');
        
        this.burstAnimation = () => {
            if (!this.effects.burst) {
                burst.style.display = 'none';
                return;
            }
            burst.style.display = 'block';
            
            rays.forEach((ray, index) => {
                const angle = (360 / rays.length) * index + this.time;
                const scale = 1 + Math.sin(this.time * 0.05 + index) * 0.5;
                
                ray.style.transform = `rotate(${angle}deg) scaleY(${scale})`;
            });
            
            requestAnimationFrame(this.burstAnimation);
        };
    }
    
    // データストリーム（マトリックス）
    initDataStream() {
        const canvas = document.getElementById('matrixCanvas');
        const ctx = canvas.getContext('2d');
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        
        const fontSize = 16;
        const columns = Math.floor(canvas.width / fontSize);
        
        // ドロップの初期化
        for (let i = 0; i < columns; i++) {
            this.matrixDrops[i] = Math.random() * -100;
        }
        
        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        
        const drawMatrix = () => {
            if (!this.effects.matrix) return;
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < columns; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize;
                const y = this.matrixDrops[i] * fontSize;
                
                // マウスの影響
                const dx = x - this.mouseX;
                const dy = y - this.mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.fillStyle = '#ff0000';
                } else {
                    ctx.fillStyle = '#00ff00';
                }
                
                ctx.fillText(char, x, y);
                
                if (y > canvas.height && Math.random() > 0.975) {
                    this.matrixDrops[i] = 0;
                }
                
                this.matrixDrops[i]++;
            }
        };
        
        this.matrixAnimation = () => {
            drawMatrix();
            requestAnimationFrame(this.matrixAnimation);
        };
    }
    
    // グリッチエフェクト
    initGlitchEffect() {
        const container = document.getElementById('glitchContainer');
        
        setInterval(() => {
            if (!this.effects.glitch) {
                container.style.display = 'none';
                return;
            }
            container.style.display = 'block';
            
            container.classList.add('glitching');
            setTimeout(() => {
                container.classList.remove('glitching');
            }, 200);
        }, 2000);
    }
    
    // エフェクトコントロール
    setupEffectControls() {
        const buttons = document.querySelectorAll('.effect-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const effect = btn.dataset.effect;
                
                if (effect === 'all') {
                    // 全て有効化
                    Object.keys(this.effects).forEach(key => {
                        this.effects[key] = true;
                    });
                    buttons.forEach(b => {
                        if (b.dataset.effect === 'all') {
                            b.classList.add('active');
                        } else {
                            b.classList.remove('active');
                        }
                    });
                } else {
                    // 個別トグル
                    this.effects[effect] = !this.effects[effect];
                    btn.classList.toggle('active');
                    
                    // 全てボタンの状態更新
                    const allActive = Object.values(this.effects).every(v => v);
                    const allBtn = document.querySelector('[data-effect="all"]');
                    if (allActive) {
                        allBtn.classList.add('active');
                    } else {
                        allBtn.classList.remove('active');
                    }
                }
            });
        });
    }
    
    // フルスクリーン
    setupFullscreen() {
        const btn = document.getElementById('fullscreenBtn');
        
        btn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });
    }
    
    // WOWモーメントのトリガー
    triggerWowMoment() {
        // 初期の爆発エフェクト
        const burst = document.getElementById('lightBurst');
        burst.classList.add('initial-burst');
        
        setTimeout(() => {
            burst.classList.remove('initial-burst');
        }, 1000);
        
        // 画面全体のフラッシュ
        const flash = document.createElement('div');
        flash.className = 'screen-flash';
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
        }, 500);
    }
    
    // アニメーション開始
    startAnimations() {
        const animate = () => {
            this.time++;
            requestAnimationFrame(animate);
        };
        animate();
        
        // 各アニメーションを開始
        this.tunnelAnimation();
        this.stormAnimation();
        this.energyAnimation();
        this.orbAnimation();
        this.burstAnimation();
        this.matrixAnimation();
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new InstantWow();
});