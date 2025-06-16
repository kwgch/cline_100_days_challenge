class InvisibleColors {
    constructor() {
        this.audioContext = null;
        this.oscillator = null;
        this.currentEmotion = null;
        this.darknessLevel = 0;
        
        this.init();
    }
    
    init() {
        this.setupUVSpectrum();
        this.setupIRVision();
        this.setupImpossibleColors();
        this.setupAfterimage();
        this.setupTetrachromat();
        this.setupSynesthesia();
        this.setupEmotionColors();
        this.setupVantablack();
        this.setupColorMixer();
    }
    
    // 紫外線スペクトラム
    setupUVSpectrum() {
        const canvas = document.getElementById('uvCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 200;
        
        const drawFlower = (mode) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 花の中心
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            if (mode === 'human') {
                // 人間が見る花（単色）
                ctx.fillStyle = '#FFD700';
                for (let i = 0; i < 8; i++) {
                    ctx.save();
                    ctx.translate(centerX, centerY);
                    ctx.rotate((i * Math.PI) / 4);
                    ctx.beginPath();
                    ctx.ellipse(0, -30, 20, 40, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            } else {
                // 蜂が見る花（UV模様）
                for (let i = 0; i < 8; i++) {
                    ctx.save();
                    ctx.translate(centerX, centerY);
                    ctx.rotate((i * Math.PI) / 4);
                    
                    // UV模様のグラデーション
                    const gradient = ctx.createRadialGradient(0, -30, 0, 0, -30, 40);
                    gradient.addColorStop(0, '#FF00FF');
                    gradient.addColorStop(0.3, '#8000FF');
                    gradient.addColorStop(0.6, '#0080FF');
                    gradient.addColorStop(1, '#FFD700');
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.ellipse(0, -30, 20, 40, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 蜜標（ネクターガイド）
                    ctx.strokeStyle = '#FF00FF';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 5]);
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, -30);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    
                    ctx.restore();
                }
            }
            
            // 中心部
            ctx.fillStyle = mode === 'human' ? '#8B4513' : '#FF00FF';
            ctx.beginPath();
            ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
            ctx.fill();
        };
        
        // 初期描画
        drawFlower('bee');
        
        // フィルターボタン
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                drawFlower(filter === 'human' ? 'human' : 'bee');
                
                // アクティブ状態の更新
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }
    
    // 赤外線ビジョン
    setupIRVision() {
        const heatMap = document.querySelector('.heat-map');
        const sensitivity = document.getElementById('heatSensitivity');
        
        const updateHeatMap = () => {
            const level = sensitivity.value / 100;
            heatMap.innerHTML = '';
            
            // ヒートマップの生成
            for (let y = 0; y < 10; y++) {
                for (let x = 0; x < 10; x++) {
                    const cell = document.createElement('div');
                    cell.className = 'heat-cell';
                    
                    // 温度分布（中心が高温）
                    const distance = Math.sqrt(Math.pow(x - 5, 2) + Math.pow(y - 5, 2));
                    const heat = Math.max(0, 1 - distance / 7) * level;
                    
                    // 赤外線カラーマップ
                    let color;
                    if (heat > 0.8) {
                        color = `rgb(255, ${Math.floor(255 * (1 - heat))}, 0)`;
                    } else if (heat > 0.6) {
                        color = `rgb(255, ${Math.floor(255 * heat)}, 0)`;
                    } else if (heat > 0.4) {
                        color = `rgb(${Math.floor(255 * heat)}, 0, ${Math.floor(255 * (1 - heat))})`;
                    } else {
                        color = `rgb(0, 0, ${Math.floor(255 * heat)})`;
                    }
                    
                    cell.style.backgroundColor = color;
                    cell.style.opacity = 0.5 + heat * 0.5;
                    heatMap.appendChild(cell);
                }
            }
        };
        
        sensitivity.addEventListener('input', updateHeatMap);
        updateHeatMap();
    }
    
    // 不可能な色
    setupImpossibleColors() {
        const perceiveBtn = document.getElementById('perceiveImpossible');
        const colorPairs = document.querySelectorAll('.color-pair');
        
        perceiveBtn.addEventListener('click', () => {
            colorPairs.forEach((pair, index) => {
                // 急速な切り替えで知覚を混乱させる
                let phase = 0;
                const interval = setInterval(() => {
                    phase++;
                    
                    if (index === 0) {
                        // 赤緑の不可能色
                        pair.style.background = phase % 2 === 0 ? 
                            'linear-gradient(90deg, red 0%, red 50%, green 50%, green 100%)' :
                            'linear-gradient(90deg, green 0%, green 50%, red 50%, red 100%)';
                    } else {
                        // 黄青の不可能色
                        pair.style.background = phase % 2 === 0 ?
                            'linear-gradient(90deg, yellow 0%, yellow 50%, blue 50%, blue 100%)' :
                            'linear-gradient(90deg, blue 0%, blue 50%, yellow 50%, yellow 100%)';
                    }
                    
                    if (phase > 20) {
                        clearInterval(interval);
                        // 最終的に混合色を表示
                        pair.style.background = index === 0 ? 
                            'radial-gradient(circle, rgba(255,0,0,0.5), rgba(0,255,0,0.5))' :
                            'radial-gradient(circle, rgba(255,255,0,0.5), rgba(0,0,255,0.5))';
                    }
                }, 50);
            });
        });
    }
    
    // 補色残像
    setupAfterimage() {
        const starePoint = document.getElementById('starePoint');
        const afterimageCanvas = document.getElementById('afterimageCanvas');
        let stareTimer = null;
        let isStaring = false;
        
        // ランダムな色を生成
        const generateColor = () => {
            const hue = Math.random() * 360;
            return `hsl(${hue}, 100%, 50%)`;
        };
        
        const startStaring = () => {
            isStaring = true;
            const color = generateColor();
            starePoint.style.backgroundColor = color;
            starePoint.style.display = 'block';
            afterimageCanvas.style.display = 'none';
            
            // 30秒後に残像を表示
            stareTimer = setTimeout(() => {
                starePoint.style.display = 'none';
                afterimageCanvas.style.display = 'block';
                afterimageCanvas.style.backgroundColor = '#ffffff';
                
                // 補色の残像効果
                const complementaryHue = (parseInt(color.match(/\d+/)[0]) + 180) % 360;
                setTimeout(() => {
                    afterimageCanvas.style.backgroundColor = `hsl(${complementaryHue}, 50%, 80%)`;
                }, 100);
            }, 30000);
        };
        
        starePoint.addEventListener('click', startStaring);
        afterimageCanvas.addEventListener('click', () => {
            clearTimeout(stareTimer);
            startStaring();
        });
        
        // 初期表示
        starePoint.style.backgroundColor = generateColor();
    }
    
    // 四色覚
    setupTetrachromat() {
        const canvas = document.getElementById('tetraCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 200;
        
        const draw4DColor = (dimensions) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (dimensions === 3) {
                // 通常の3原色
                const colors = ['red', 'green', 'blue'];
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const radius = 60;
                
                colors.forEach((color, i) => {
                    const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;
                    
                    ctx.globalAlpha = 0.5;
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(x, y, 50, 0, Math.PI * 2);
                    ctx.fill();
                });
            } else {
                // 4原色（第4の色は紫外線領域）
                const imageData = ctx.createImageData(canvas.width, canvas.height);
                const data = imageData.data;
                
                for (let y = 0; y < canvas.height; y++) {
                    for (let x = 0; x < canvas.width; x++) {
                        const i = (y * canvas.width + x) * 4;
                        
                        // 4次元色空間の投影
                        const r = Math.sin(x * 0.02) * 127 + 128;
                        const g = Math.sin(y * 0.02) * 127 + 128;
                        const b = Math.sin((x + y) * 0.01) * 127 + 128;
                        // 第4の次元（紫外線）を既存の色にマッピング
                        const uv = Math.sin((x - y) * 0.03) * 127 + 128;
                        
                        data[i] = (r + uv * 0.5) % 256;
                        data[i + 1] = (g + uv * 0.3) % 256;
                        data[i + 2] = (b + uv * 0.7) % 256;
                        data[i + 3] = 255;
                    }
                }
                
                ctx.putImageData(imageData, 0, 0);
            }
        };
        
        // 初期描画
        draw4DColor(4);
        
        // 次元切り替え
        document.querySelectorAll('.dimension-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dim = parseInt(e.target.dataset.dim);
                draw4DColor(dim);
                
                document.querySelectorAll('.dimension-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }
    
    // 共感覚：音の色
    setupSynesthesia() {
        const soundColorField = document.querySelector('.sound-color-field');
        const frequencyDisplay = document.getElementById('frequency');
        const playBtn = document.getElementById('playSoundColor');
        
        playBtn.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            // 音を生成
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            const frequency = 220 + Math.random() * 660; // 220-880Hz
            oscillator.frequency.value = frequency;
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // 音量のエンベロープ
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 2);
            
            // 周波数を色に変換
            frequencyDisplay.textContent = Math.floor(frequency);
            const hue = ((frequency - 220) / 660) * 360;
            const saturation = 50 + Math.sin(frequency * 0.01) * 30;
            const lightness = 40 + Math.cos(frequency * 0.02) * 20;
            
            soundColorField.style.background = `radial-gradient(circle, 
                hsl(${hue}, ${saturation}%, ${lightness}%), 
                hsl(${(hue + 180) % 360}, ${saturation}%, ${lightness * 0.5}%))`;
            
            // 振動パターン
            soundColorField.classList.add('vibrating');
            setTimeout(() => soundColorField.classList.remove('vibrating'), 2000);
        });
    }
    
    // 感情の色
    setupEmotionColors() {
        const emotionField = document.querySelector('.emotion-field');
        const emotionColors = {
            joy: { 
                colors: ['#FFD700', '#FFA500', '#FFFF00'], 
                pattern: 'radial' 
            },
            sadness: { 
                colors: ['#4682B4', '#191970', '#000080'], 
                pattern: 'linear' 
            },
            anger: { 
                colors: ['#DC143C', '#8B0000', '#FF0000'], 
                pattern: 'conic' 
            },
            fear: { 
                colors: ['#2F4F4F', '#000000', '#708090'], 
                pattern: 'radial' 
            },
            love: { 
                colors: ['#FF69B4', '#FF1493', '#FFC0CB'], 
                pattern: 'radial' 
            }
        };
        
        document.querySelectorAll('.emotion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const emotion = e.target.dataset.emotion;
                const config = emotionColors[emotion];
                
                // グラデーションパターンを作成
                let gradient;
                if (config.pattern === 'radial') {
                    gradient = `radial-gradient(circle, ${config.colors.join(', ')})`;
                } else if (config.pattern === 'linear') {
                    gradient = `linear-gradient(180deg, ${config.colors.join(', ')})`;
                } else {
                    gradient = `conic-gradient(${config.colors.join(', ')})`;
                }
                
                emotionField.style.background = gradient;
                emotionField.className = `emotion-field ${emotion}`;
                
                // アクティブ状態
                document.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        // 初期状態
        document.querySelector('.emotion-btn[data-emotion="joy"]').click();
    }
    
    // 暗黒色
    setupVantablack() {
        const darknessLevel = document.getElementById('darknessLevel');
        const deeperBtn = document.getElementById('deeperDark');
        
        deeperBtn.addEventListener('click', () => {
            this.darknessLevel = Math.min(100, this.darknessLevel + 10);
            
            // 暗さのレベルに応じて表現を変える
            const darkness = this.darknessLevel / 100;
            darknessLevel.style.backgroundColor = `rgba(0, 0, 0, ${0.9 + darkness * 0.1})`;
            darknessLevel.style.boxShadow = `inset 0 0 ${50 * darkness}px rgba(0, 0, 0, ${darkness})`;
            
            // テキストで暗さを表現
            if (this.darknessLevel > 90) {
                darknessLevel.innerHTML = '<span style="color: #111; font-size: 12px;">光が消える</span>';
            } else if (this.darknessLevel > 70) {
                darknessLevel.innerHTML = '<span style="color: #222;">深淵</span>';
            } else if (this.darknessLevel > 50) {
                darknessLevel.innerHTML = '<span style="color: #333;">虚無</span>';
            }
            
            // 最大レベルで特殊効果
            if (this.darknessLevel >= 100) {
                darknessLevel.classList.add('absolute-darkness');
                deeperBtn.disabled = true;
                deeperBtn.textContent = '限界';
            }
        });
    }
    
    // カラーミキサー
    setupColorMixer() {
        const mixerDisplay = document.getElementById('mixerDisplay');
        const mixBtn = document.getElementById('mixInvisible');
        
        mixBtn.addEventListener('click', () => {
            // 見えない色を混ぜる
            const invisibleColors = [
                'rgba(255, 0, 255, 0.1)', // UV
                'rgba(255, 0, 0, 0.1)',   // IR
                'rgba(0, 0, 0, 0.1)',     // Vantablack
                'rgba(128, 128, 128, 0.1)' // 不可能色
            ];
            
            let gradient = 'conic-gradient(';
            for (let i = 0; i < 360; i += 10) {
                const colorIndex = Math.floor(Math.random() * invisibleColors.length);
                gradient += `${invisibleColors[colorIndex]} ${i}deg, `;
            }
            gradient = gradient.slice(0, -2) + ')';
            
            mixerDisplay.style.background = gradient;
            mixerDisplay.classList.add('mixing');
            
            setTimeout(() => {
                mixerDisplay.classList.remove('mixing');
            }, 2000);
        });
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new InvisibleColors();
});