class TactilePlayground {
    constructor() {
        this.currentZone = 'slime';
        this.audioContext = null;
        this.touches = new Map();
        
        // 各ゾーンの状態
        this.slimePoints = [];
        this.ferrofluidParticles = [];
        this.sandParticles = [];
        this.elasticBands = [];
        this.particleEmitters = [];
        this.soundRipples = [];
        
        // ツール設定
        this.sandTool = 'draw';
        this.popCount = 0;
        
        this.init();
    }
    
    init() {
        this.setupAudioContext();
        this.setupSlime();
        this.setupFerrofluid();
        this.setupBubbleWrap();
        this.setupSandbox();
        this.setupElastic();
        this.setupParticleFall();
        this.setupLiquidButtons();
        this.setupSoundRipple();
        this.setupNavigation();
        this.setupTouchHandlers();
        
        // 初期表示
        this.showZone('slime');
        
        // アニメーション開始
        this.animate();
    }
    
    // オーディオコンテキスト
    setupAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // ハプティックフィードバック
    triggerHaptic(intensity = 'medium') {
        if ('vibrate' in navigator) {
            const durations = {
                light: 10,
                medium: 20,
                heavy: 50
            };
            navigator.vibrate(durations[intensity]);
        }
        
        // ビジュアルフィードバック
        const indicator = document.getElementById('hapticIndicator');
        indicator.style.opacity = '1';
        setTimeout(() => {
            indicator.style.opacity = '0';
        }, 200);
    }
    
    // スライムシミュレーター
    setupSlime() {
        const canvas = document.getElementById('slimeCanvas');
        const ctx = canvas.getContext('2d');
        
        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        
        // スライムの物理ポイント初期化
        const gridSize = 30;
        const spacing = canvas.width / gridSize;
        
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                this.slimePoints.push({
                    x: i * spacing + spacing / 2,
                    y: j * spacing + spacing / 2,
                    originalX: i * spacing + spacing / 2,
                    originalY: j * spacing + spacing / 2,
                    vx: 0,
                    vy: 0
                });
            }
        }
        
        // タッチハンドラー
        const handleSlimeTouch = (x, y, isActive) => {
            this.slimePoints.forEach(point => {
                const dx = x - point.x;
                const dy = y - point.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100 && isActive) {
                    const force = (100 - distance) / 100;
                    point.vx += (dx / distance) * force * 5;
                    point.vy += (dy / distance) * force * 5;
                    
                    if (distance < 50) {
                        this.triggerHaptic('light');
                    }
                }
            });
        };
        
        canvas.addEventListener('mousedown', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            handleSlimeTouch(x, y, true);
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (e.buttons === 1) {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                handleSlimeTouch(x, y, true);
            }
        });
        
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            Array.from(e.touches).forEach(touch => {
                const rect = canvas.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                handleSlimeTouch(x, y, true);
            });
        });
        
        canvas.addEventListener('touchmove', (e) => {
            if (e.cancelable) {
                e.preventDefault();
            }
            Array.from(e.touches).forEach(touch => {
                const rect = canvas.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                handleSlimeTouch(x, y, true);
            });
        }, { passive: false });
    }
    
    // 磁性流体
    setupFerrofluid() {
        const canvas = document.getElementById('ferrofluidCanvas');
        const ctx = canvas.getContext('2d');
        
        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        
        // パーティクル初期化
        for (let i = 0; i < 300; i++) {
            this.ferrofluidParticles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 4 + 3
            });
        }
        
        // マグネットカーソル
        const magnetCursor = document.getElementById('magnetCursor');
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            magnetCursor.style.left = e.clientX + 'px';
            magnetCursor.style.top = e.clientY + 'px';
            magnetCursor.style.display = 'block';
            
            // 磁力効果
            this.ferrofluidParticles.forEach(p => {
                const dx = x - p.x;
                const dy = y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    p.vx += (dx / distance) * force * 2;
                    p.vy += (dy / distance) * force * 2;
                }
            });
        });
        
        canvas.addEventListener('mouseleave', () => {
            magnetCursor.style.display = 'none';
        });
        
        // タッチイベントの追加
        canvas.addEventListener('touchstart', (e) => {
            if (e.cancelable) {
                e.preventDefault();
            }
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            // 磁力効果
            this.ferrofluidParticles.forEach(p => {
                const dx = x - p.x;
                const dy = y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    p.vx += (dx / distance) * force * 2;
                    p.vy += (dy / distance) * force * 2;
                }
            });
        }, { passive: false });
        
        canvas.addEventListener('touchmove', (e) => {
            if (e.cancelable) {
                e.preventDefault();
            }
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            // 磁力効果
            this.ferrofluidParticles.forEach(p => {
                const dx = x - p.x;
                const dy = y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    p.vx += (dx / distance) * force * 2;
                    p.vy += (dy / distance) * force * 2;
                }
            });
        }, { passive: false });
    }
    
    // バブルラップ
    setupBubbleWrap() {
        const wrap = document.getElementById('bubbleWrap');
        const rows = 10;
        const cols = 15;
        
        for (let i = 0; i < rows * cols; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.dataset.popped = 'false';
            
            bubble.addEventListener('click', () => {
                if (bubble.dataset.popped === 'false') {
                    bubble.dataset.popped = 'true';
                    bubble.classList.add('popped');
                    
                    // ポップ音
                    this.playPopSound();
                    this.triggerHaptic('medium');
                    
                    // カウント更新
                    this.popCount++;
                    document.getElementById('popCount').textContent = this.popCount;
                    
                    // 自動復活
                    setTimeout(() => {
                        bubble.dataset.popped = 'false';
                        bubble.classList.remove('popped');
                    }, 3000);
                }
            });
            
            wrap.appendChild(bubble);
        }
    }
    
    // ポップ音
    playPopSound() {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.frequency.value = 800 + Math.random() * 400;
        gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.1);
    }
    
    // 砂遊び
    setupSandbox() {
        const canvas = document.getElementById('sandCanvas');
        const ctx = canvas.getContext('2d');
        
        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        
        // ツールボタン
        const toolButtons = document.querySelectorAll('.tool-btn');
        toolButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                toolButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.sandTool = btn.dataset.tool;
            });
        });
        
        // 砂の描画
        const drawSand = (x, y) => {
            if (this.sandTool === 'draw') {
                for (let i = 0; i < 5; i++) {
                    this.sandParticles.push({
                        x: x + (Math.random() - 0.5) * 20,
                        y: y + (Math.random() - 0.5) * 20,
                        vx: (Math.random() - 0.5) * 2,
                        vy: Math.random() * 2,
                        color: `hsl(${40 + Math.random() * 20}, 70%, ${50 + Math.random() * 20}%)`,
                        size: Math.random() * 3 + 2
                    });
                }
            } else if (this.sandTool === 'erase') {
                this.sandParticles = this.sandParticles.filter(p => {
                    const dx = x - p.x;
                    const dy = y - p.y;
                    return Math.sqrt(dx * dx + dy * dy) > 50;
                });
            }
        };
        
        canvas.addEventListener('mousedown', (e) => {
            const rect = canvas.getBoundingClientRect();
            drawSand(e.clientX - rect.left, e.clientY - rect.top);
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (e.buttons === 1) {
                const rect = canvas.getBoundingClientRect();
                drawSand(e.clientX - rect.left, e.clientY - rect.top);
            }
        });
        
        // タッチイベントの追加
        canvas.addEventListener('touchstart', (e) => {
            if (e.cancelable) {
                e.preventDefault();
            }
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            drawSand(touch.clientX - rect.left, touch.clientY - rect.top);
        }, { passive: false });
        
        canvas.addEventListener('touchmove', (e) => {
            if (e.cancelable) {
                e.preventDefault();
            }
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            drawSand(touch.clientX - rect.left, touch.clientY - rect.top);
        }, { passive: false });
        
        // 雨機能
        setInterval(() => {
            if (this.sandTool === 'rain') {
                for (let i = 0; i < 10; i++) {
                    this.sandParticles.push({
                        x: Math.random() * canvas.width,
                        y: -10,
                        vx: (Math.random() - 0.5) * 0.5,
                        vy: Math.random() * 3 + 2,
                        color: `hsl(200, 70%, 60%)`,
                        size: Math.random() * 2 + 1
                    });
                }
            }
        }, 50);
    }
    
    // ゴムバンド
    setupElastic() {
        const svg = document.getElementById('elasticSvg');
        const pinsContainer = document.getElementById('elasticPins');
        const container = document.querySelector('.elastic-container');
        
        // コンテナのサイズを取得
        const rect = container.getBoundingClientRect();
        const width = rect.width || 600;
        const height = rect.height || 600;
        
        // ピンの配置（相対位置）
        const pins = [
            { x: width * 0.2, y: height * 0.2 },
            { x: width * 0.8, y: height * 0.2 },
            { x: width * 0.5, y: height * 0.5 },
            { x: width * 0.2, y: height * 0.8 },
            { x: width * 0.8, y: height * 0.8 }
        ];
        
        // SVGのviewBoxを設定
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        
        pins.forEach((pin, index) => {
            const pinElement = document.createElement('div');
            pinElement.className = 'elastic-pin';
            pinElement.style.left = pin.x + 'px';
            pinElement.style.top = pin.y + 'px';
            pinElement.style.transform = 'translate(-50%, -50%)';
            pinElement.dataset.index = index;
            pinsContainer.appendChild(pinElement);
        });
        
        // バンドの描画
        let selectedPin = null;
        let tempBand = null;
        
        pinsContainer.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('elastic-pin')) {
                selectedPin = parseInt(e.target.dataset.index);
                const pin = pins[selectedPin];
                
                tempBand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                tempBand.setAttribute('x1', pin.x);
                tempBand.setAttribute('y1', pin.y);
                tempBand.setAttribute('x2', pin.x);
                tempBand.setAttribute('y2', pin.y);
                tempBand.setAttribute('class', 'elastic-band-temp');
                document.getElementById('elasticBands').appendChild(tempBand);
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (tempBand && selectedPin !== null) {
                const rect = svg.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                tempBand.setAttribute('x2', x);
                tempBand.setAttribute('y2', y);
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            if (tempBand) {
                const rect = svg.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // 別のピンに接続
                pins.forEach((pin, index) => {
                    if (index !== selectedPin) {
                        const dx = x - pin.x;
                        const dy = y - pin.y;
                        if (Math.sqrt(dx * dx + dy * dy) < 30) {
                            tempBand.setAttribute('x2', pin.x);
                            tempBand.setAttribute('y2', pin.y);
                            tempBand.setAttribute('class', 'elastic-band');
                            this.elasticBands.push({
                                from: selectedPin,
                                to: index,
                                element: tempBand
                            });
                            this.triggerHaptic('medium');
                            tempBand = null;
                            return;
                        }
                    }
                });
                
                // 接続失敗
                if (tempBand) {
                    tempBand.remove();
                    tempBand = null;
                }
                
                selectedPin = null;
            }
        });
        
        // タッチイベントの追加
        pinsContainer.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('elastic-pin')) {
                e.preventDefault();
                selectedPin = parseInt(e.target.dataset.index);
                const pin = pins[selectedPin];
                
                tempBand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                tempBand.setAttribute('x1', pin.x);
                tempBand.setAttribute('y1', pin.y);
                tempBand.setAttribute('x2', pin.x);
                tempBand.setAttribute('y2', pin.y);
                tempBand.setAttribute('class', 'elastic-band-temp');
                document.getElementById('elasticBands').appendChild(tempBand);
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (tempBand && selectedPin !== null) {
                const touch = e.touches[0];
                const rect = container.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                tempBand.setAttribute('x2', x);
                tempBand.setAttribute('y2', y);
            }
        });
        
        document.addEventListener('touchend', (e) => {
            if (tempBand) {
                const touch = e.changedTouches[0];
                const rect = container.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                
                // 別のピンに接続
                pins.forEach((pin, index) => {
                    if (index !== selectedPin) {
                        const dx = x - pin.x;
                        const dy = y - pin.y;
                        if (Math.sqrt(dx * dx + dy * dy) < 30) {
                            tempBand.setAttribute('x2', pin.x);
                            tempBand.setAttribute('y2', pin.y);
                            tempBand.setAttribute('class', 'elastic-band');
                            this.elasticBands.push({
                                from: selectedPin,
                                to: index,
                                element: tempBand
                            });
                            this.triggerHaptic('medium');
                            tempBand = null;
                            return;
                        }
                    }
                });
                
                // 接続失敗
                if (tempBand) {
                    tempBand.remove();
                    tempBand = null;
                }
                
                selectedPin = null;
            }
        });
    }
    
    // 粒子の滝
    setupParticleFall() {
        const canvas = document.getElementById('particleFallCanvas');
        const ctx = canvas.getContext('2d');
        
        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // エミッター追加
            this.particleEmitters.push({
                x: x,
                y: y,
                life: 100
            });
            
            if (this.particleEmitters.length > 50) {
                this.particleEmitters.shift();
            }
        });
        
        // タッチイベントの追加
        canvas.addEventListener('touchmove', (e) => {
            if (e.cancelable) {
                e.preventDefault();
            }
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            // エミッター追加
            this.particleEmitters.push({
                x: x,
                y: y,
                life: 100
            });
            
            if (this.particleEmitters.length > 50) {
                this.particleEmitters.shift();
            }
        }, { passive: false });
    }
    
    // 液体ボタン
    setupLiquidButtons() {
        const buttons = document.querySelectorAll('.liquid-btn');
        
        buttons.forEach(btn => {
            const liquidBg = btn.querySelector('.liquid-bg');
            
            btn.addEventListener('mouseenter', () => {
                liquidBg.style.transform = 'scale(1.5)';
            });
            
            btn.addEventListener('mouseleave', () => {
                liquidBg.style.transform = 'scale(0)';
            });
            
            btn.addEventListener('click', () => {
                // 波紋エフェクト
                const ripple = document.createElement('div');
                ripple.className = 'liquid-ripple';
                btn.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 1000);
                
                this.triggerHaptic('heavy');
                this.playLiquidSound(btn.dataset.color);
            });
        });
    }
    
    // 液体音
    playLiquidSound(color) {
        const frequencies = {
            cyan: 400,
            magenta: 600,
            yellow: 800
        };
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        filter.Q.value = 10;
        
        osc.type = 'sine';
        osc.frequency.value = frequencies[color];
        
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.5);
    }
    
    // 音の波紋
    setupSoundRipple() {
        const canvas = document.getElementById('soundRippleCanvas');
        const buttons = document.querySelectorAll('.sound-btn');
        
        const notes = {
            C: 261.63,
            D: 293.66,
            E: 329.63,
            F: 349.23,
            G: 392.00
        };
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const note = btn.dataset.note;
                const frequency = notes[note];
                
                // 音を再生
                this.playNote(frequency);
                
                // 波紋を追加
                const rect = canvas.getBoundingClientRect();
                this.soundRipples.push({
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                    radius: 0,
                    maxRadius: 200,
                    frequency: frequency,
                    opacity: 1
                });
                
                this.triggerHaptic('light');
            });
        });
    }
    
    // 音符再生
    playNote(frequency) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.frequency.value = frequency;
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 1);
    }
    
    // ナビゲーション
    setupNavigation() {
        const menuButtons = document.querySelectorAll('.menu-btn');
        
        menuButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const zone = btn.dataset.zone;
                this.showZone(zone);
                
                menuButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // 初期アクティブ
        document.querySelector('[data-zone="slime"]').classList.add('active');
    }
    
    // ゾーン表示
    showZone(zoneName) {
        const zones = document.querySelectorAll('.tactile-zone');
        zones.forEach(zone => {
            zone.style.display = 'none';
        });
        
        const targetZone = document.getElementById(zoneName + 'Zone');
        if (targetZone) {
            targetZone.style.display = 'flex';
            this.currentZone = zoneName;
            
            // キャンバスのリサイズを強制的に実行
            const canvas = targetZone.querySelector('canvas');
            if (canvas) {
                const resizeEvent = new Event('resize');
                window.dispatchEvent(resizeEvent);
            }
        }
    }
    
    // タッチハンドラー
    setupTouchHandlers() {
        document.addEventListener('touchstart', (e) => {
            Array.from(e.touches).forEach(touch => {
                this.touches.set(touch.identifier, {
                    x: touch.clientX,
                    y: touch.clientY
                });
            });
        });
        
        document.addEventListener('touchmove', (e) => {
            Array.from(e.touches).forEach(touch => {
                if (this.touches.has(touch.identifier)) {
                    this.touches.set(touch.identifier, {
                        x: touch.clientX,
                        y: touch.clientY
                    });
                }
            });
        });
        
        document.addEventListener('touchend', (e) => {
            Array.from(e.changedTouches).forEach(touch => {
                this.touches.delete(touch.identifier);
            });
        });
    }
    
    // レンダリング
    renderSlime(ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // スライムの物理更新
        this.slimePoints.forEach(point => {
            // 元の位置に戻る力
            const dx = point.originalX - point.x;
            const dy = point.originalY - point.y;
            point.vx += dx * 0.1;
            point.vy += dy * 0.1;
            
            // 減衰
            point.vx *= 0.9;
            point.vy *= 0.9;
            
            // 位置更新
            point.x += point.vx;
            point.y += point.vy;
        });
        
        // スライムの描画
        ctx.fillStyle = 'rgba(50, 200, 150, 0.8)';
        ctx.strokeStyle = 'rgba(30, 150, 100, 0.5)';
        ctx.lineWidth = 2;
        
        // メタボール効果
        this.slimePoints.forEach((point, i) => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // ブレンド
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(100, 255, 200, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
    }
    
    renderFerrofluid(ctx, canvas) {
        // キャンバスのサイズチェック
        if (canvas.width === 0 || canvas.height === 0) return;
        
        // 背景をクリア
        ctx.fillStyle = 'rgba(220, 220, 220, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 一時キャンバスを作成してメタボール効果を実現
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // パーティクル更新
        this.ferrofluidParticles.forEach(p => {
            // 減衰
            p.vx *= 0.95;
            p.vy *= 0.95;
            
            // 位置更新
            p.x += p.vx;
            p.y += p.vy;
            
            // 境界
            if (p.x < 0) { p.x = 0; p.vx *= -0.5; }
            if (p.x > canvas.width) { p.x = canvas.width; p.vx *= -0.5; }
            if (p.y < 0) { p.y = 0; p.vy *= -0.5; }
            if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -0.5; }
            
            // グラデーションで立体感を出す
            const gradient = tempCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
            gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
            gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            tempCtx.fillStyle = gradient;
            tempCtx.beginPath();
            tempCtx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
            tempCtx.fill();
        });
        
        // メタボール効果のためのぼかし
        ctx.save();
        ctx.filter = 'blur(8px) contrast(30)';
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.restore();
        
        // ハイライトを追加
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
    }
    
    renderSandbox(ctx, canvas) {
        ctx.fillStyle = 'rgba(245, 235, 215, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 砂粒子の更新と描画
        this.sandParticles = this.sandParticles.filter(p => {
            // 重力
            p.vy += 0.5;
            
            // 更新
            p.x += p.vx;
            p.y += p.vy;
            
            // 減速
            p.vx *= 0.98;
            
            // 描画
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // 画面外チェック
            return p.y < canvas.height + 10;
        });
    }
    
    renderParticleFall(ctx, canvas) {
        ctx.fillStyle = 'rgba(0, 0, 20, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // エミッターから粒子生成
        this.particleEmitters.forEach(emitter => {
            if (emitter.life > 0) {
                for (let i = 0; i < 3; i++) {
                    this.sandParticles.push({
                        x: emitter.x + (Math.random() - 0.5) * 20,
                        y: emitter.y,
                        vx: (Math.random() - 0.5) * 2,
                        vy: Math.random() * 2 - 3,
                        color: `hsl(${Math.random() * 60 + 180}, 100%, 70%)`,
                        size: Math.random() * 3 + 1,
                        glow: true
                    });
                }
                emitter.life--;
            }
        });
        
        // 粒子の描画
        this.sandParticles.forEach(p => {
            if (p.glow) {
                // グロー効果
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
                gradient.addColorStop(0, p.color);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fillRect(p.x - p.size * 3, p.y - p.size * 3, p.size * 6, p.size * 6);
            }
        });
    }
    
    renderSoundRipple(ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 波紋の更新と描画
        this.soundRipples = this.soundRipples.filter(ripple => {
            ripple.radius += 3;
            ripple.opacity -= 0.01;
            
            ctx.strokeStyle = `hsla(${(ripple.frequency / 4) % 360}, 70%, 50%, ${ripple.opacity})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            ctx.stroke();
            
            // 内側の波
            ctx.strokeStyle = `hsla(${(ripple.frequency / 4 + 30) % 360}, 70%, 60%, ${ripple.opacity * 0.5})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, ripple.radius * 0.7, 0, Math.PI * 2);
            ctx.stroke();
            
            return ripple.opacity > 0;
        });
    }
    
    // メインアニメーションループ
    animate() {
        // 現在のゾーンに応じてレンダリング
        switch (this.currentZone) {
            case 'slime':
                const slimeCanvas = document.getElementById('slimeCanvas');
                const slimeCtx = slimeCanvas.getContext('2d');
                this.renderSlime(slimeCtx, slimeCanvas);
                break;
                
            case 'ferrofluid':
                const ferroCanvas = document.getElementById('ferrofluidCanvas');
                const ferroCtx = ferroCanvas.getContext('2d');
                this.renderFerrofluid(ferroCtx, ferroCanvas);
                break;
                
            case 'sandbox':
                const sandCanvas = document.getElementById('sandCanvas');
                const sandCtx = sandCanvas.getContext('2d');
                this.renderSandbox(sandCtx, sandCanvas);
                break;
                
            case 'particleFall':
                const particleCanvas = document.getElementById('particleFallCanvas');
                const particleCtx = particleCanvas.getContext('2d');
                this.renderParticleFall(particleCtx, particleCanvas);
                break;
                
            case 'soundRipple':
                const soundCanvas = document.getElementById('soundRippleCanvas');
                const soundCtx = soundCanvas.getContext('2d');
                this.renderSoundRipple(soundCtx, soundCanvas);
                break;
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new TactilePlayground();
});