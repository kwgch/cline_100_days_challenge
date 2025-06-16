class PerfectlyImperfect {
    constructor() {
        this.perfectionLevels = {
            circle: 99.7,
            grid: 99.2,
            gradient: 99.5,
            pattern: 98.9,
            rhythm: 99.1,
            symmetry: 99.0,
            color: 99.8,
            typography: 99.3
        };
        
        this.init();
    }
    
    init() {
        this.drawPerfectCircle();
        this.createPerfectGrid();
        this.createPerfectGradient();
        this.createPerfectPattern();
        this.startPerfectRhythm();
        this.drawSymmetry();
        this.createColorHarmony();
        this.createTypographyTest();
        this.setupControls();
        this.updateTotalPerfection();
        this.animatePerfectionGraph();
    }
    
    // 完璧な円（わずかな歪み）
    drawPerfectCircle() {
        const canvas = document.getElementById('perfectCircle');
        const ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 200;
        
        const centerX = 100;
        const centerY = 100;
        const radius = 80;
        
        const animate = () => {
            ctx.clearRect(0, 0, 200, 200);
            
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            // 完璧な円に微小な歪みを加える
            for (let angle = 0; angle <= Math.PI * 2; angle += 0.01) {
                const imperfection = Math.sin(angle * 7 + Date.now() * 0.001) * 0.3;
                const r = radius + imperfection;
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r;
                
                if (angle === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.closePath();
            ctx.stroke();
            
            // 完璧度を微妙に変動させる
            this.perfectionLevels.circle = 99.7 + Math.sin(Date.now() * 0.0001) * 0.1;
            document.getElementById('circlePercent').textContent = this.perfectionLevels.circle.toFixed(1);
            this.updateMeter('circlePerfection', this.perfectionLevels.circle);
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    // 完璧なグリッド（1つだけずれる）
    createPerfectGrid() {
        const container = document.getElementById('gridContainer');
        container.innerHTML = '';
        
        const gridSize = 8;
        const imperfectIndex = Math.floor(Math.random() * gridSize * gridSize);
        
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            
            if (i === imperfectIndex) {
                // 1ピクセルだけずらす
                cell.style.transform = 'translate(1px, 0)';
                cell.classList.add('imperfect-cell');
            }
            
            container.appendChild(cell);
        }
        
        // クリックで位置を変える
        container.addEventListener('click', () => {
            this.createPerfectGrid();
        });
    }
    
    // 完璧なグラデーション（微妙な段差）
    createPerfectGradient() {
        const gradientBox = document.getElementById('gradientBox');
        
        // 256段階のグラデーションに1箇所だけ段差
        const steps = 256;
        const imperfectStep = Math.floor(Math.random() * (steps - 10)) + 5;
        
        let gradient = 'linear-gradient(to right, ';
        for (let i = 0; i <= steps; i++) {
            const percent = (i / steps) * 100;
            let value = Math.floor((i / steps) * 255);
            
            // 微妙な段差を作る
            if (i === imperfectStep) {
                value += 2;
            }
            
            gradient += `rgb(${value}, ${value}, ${value}) ${percent}%`;
            if (i < steps) gradient += ', ';
        }
        gradient += ')';
        
        gradientBox.style.background = gradient;
    }
    
    // 完璧なパターン（規則性の乱れ）
    createPerfectPattern() {
        const container = document.getElementById('patternContainer');
        container.innerHTML = '';
        
        const patternSize = 10;
        let orderLevel = 0.99; // 99%の秩序
        
        for (let y = 0; y < patternSize; y++) {
            for (let x = 0; x < patternSize; x++) {
                const dot = document.createElement('div');
                dot.className = 'pattern-dot';
                
                // 規則的な配置に微小なランダム性
                const shouldBeBlack = (x + y) % 2 === 0;
                const isImperfect = Math.random() > orderLevel;
                
                if (isImperfect) {
                    dot.classList.add(shouldBeBlack ? 'white' : 'black');
                } else {
                    dot.classList.add(shouldBeBlack ? 'black' : 'white');
                }
                
                container.appendChild(dot);
            }
        }
        
        // コントロール
        document.getElementById('increaseOrder').addEventListener('click', () => {
            orderLevel = Math.min(1, orderLevel + 0.01);
            this.perfectionLevels.pattern = orderLevel * 100;
            this.createPerfectPattern();
            this.updateTotalPerfection();
        });
        
        document.getElementById('increaseChaos').addEventListener('click', () => {
            orderLevel = Math.max(0.9, orderLevel - 0.01);
            this.perfectionLevels.pattern = orderLevel * 100;
            this.createPerfectPattern();
            this.updateTotalPerfection();
        });
    }
    
    // 完璧なリズム（微妙にずれる）
    startPerfectRhythm() {
        const indicators = document.querySelectorAll('.beat-indicator');
        let bpm = 120;
        const perfectInterval = 60000 / bpm;
        
        indicators.forEach((indicator, index) => {
            const imperfection = index === 2 ? 10 : 0; // 3つ目だけ10msずれる
            
            const beat = () => {
                indicator.classList.add('active');
                setTimeout(() => {
                    indicator.classList.remove('active');
                }, 100);
            };
            
            setInterval(beat, perfectInterval + imperfection);
            
            // 初期オフセット
            setTimeout(beat, index * (perfectInterval / 4));
        });
        
        // BPM表示（微妙に変動）
        setInterval(() => {
            const variation = Math.sin(Date.now() * 0.001) * 0.1;
            const displayBPM = (bpm + variation).toFixed(1);
            document.getElementById('bpmDisplay').textContent = displayBPM;
        }, 100);
    }
    
    // 完璧な対称（わずかな非対称）
    drawSymmetry() {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        const container = document.getElementById('symmetryCanvas');
        container.innerHTML = '';
        container.appendChild(canvas);
        
        const slider = document.getElementById('symmetrySlider');
        const valueDisplay = document.getElementById('symmetryValue');
        
        const draw = () => {
            ctx.clearRect(0, 0, 200, 200);
            const symmetryLevel = parseInt(slider.value) / 100;
            
            // 左半分を描画
            ctx.fillStyle = '#333';
            for (let i = 0; i < 20; i++) {
                const x = Math.random() * 100;
                const y = Math.random() * 200;
                const size = Math.random() * 10 + 5;
                
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
                
                // 右半分に対称に描画（わずかなずれ）
                const imperfection = (1 - symmetryLevel) * 5;
                const mirrorX = 200 - x + (Math.random() - 0.5) * imperfection;
                const mirrorY = y + (Math.random() - 0.5) * imperfection;
                
                ctx.beginPath();
                ctx.arc(mirrorX, mirrorY, size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // 中心線
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.moveTo(100, 0);
            ctx.lineTo(100, 200);
            ctx.stroke();
        };
        
        slider.addEventListener('input', (e) => {
            valueDisplay.textContent = e.target.value;
            this.perfectionLevels.symmetry = parseInt(e.target.value);
            draw();
            this.updateTotalPerfection();
        });
        
        draw();
    }
    
    // 完璧な色彩調和（微妙な色差）
    createColorHarmony() {
        const blocks = document.querySelectorAll('.color-block');
        const baseHue = Math.random() * 360;
        
        blocks.forEach((block, index) => {
            // 完璧な90度間隔...のはず
            let hue = (baseHue + index * 90) % 360;
            
            // 1つだけ微妙にずらす
            if (index === 2) {
                hue += 2;
            }
            
            block.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
        });
        
        // 調和度を計算（実際は固定値）
        const harmonyScore = 99.8 - Math.random() * 0.2;
        document.getElementById('harmonyScore').textContent = harmonyScore.toFixed(1);
        this.perfectionLevels.color = harmonyScore;
    }
    
    // 完璧なタイポグラフィ（1文字だけ違う）
    createTypographyTest() {
        const textElement = document.getElementById('typographyTest');
        const text = textElement.textContent;
        const chars = text.split('');
        
        // ランダムな位置の1文字を変更
        const imperfectIndex = Math.floor(Math.random() * chars.length);
        
        textElement.innerHTML = chars.map((char, index) => {
            if (index === imperfectIndex && char !== ' ' && char !== '。') {
                // フォントサイズを0.5px変える
                return `<span style="font-size: 16.5px">${char}</span>`;
            }
            return char;
        }).join('');
    }
    
    // メーターの更新
    updateMeter(meterId, percentage) {
        const meter = document.getElementById(meterId);
        if (meter) {
            meter.style.width = percentage + '%';
        }
    }
    
    // 総合完璧度の計算
    updateTotalPerfection() {
        const values = Object.values(this.perfectionLevels);
        const total = values.reduce((sum, val) => sum + val, 0) / values.length;
        document.getElementById('totalPercent').textContent = total.toFixed(1);
    }
    
    // 完璧度グラフのアニメーション
    animatePerfectionGraph() {
        const graph = document.getElementById('perfectionGraph');
        
        const animate = () => {
            const bars = [];
            const values = Object.values(this.perfectionLevels);
            
            graph.innerHTML = '';
            values.forEach(value => {
                const bar = document.createElement('div');
                bar.className = 'graph-bar';
                bar.style.height = value + '%';
                graph.appendChild(bar);
            });
            
            setTimeout(animate, 2000);
        };
        
        animate();
    }
    
    // コントロールの設定
    setupControls() {
        // 欠陥を見つけるボタン
        document.querySelectorAll('.find-flaw').forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.target.dataset.target;
                if (target === 'gradient') {
                    const gradientBox = document.getElementById('gradientBox');
                    gradientBox.classList.add('highlight-flaw');
                    setTimeout(() => {
                        gradientBox.classList.remove('highlight-flaw');
                    }, 2000);
                }
            });
        });
        
        // 完璧にするボタン
        document.getElementById('makePerfect').addEventListener('click', () => {
            // すべてを100%にする
            Object.keys(this.perfectionLevels).forEach(key => {
                this.perfectionLevels[key] = 100;
            });
            
            // でも画面が単調になる
            document.body.classList.add('too-perfect');
            
            // 3秒後に戻す
            setTimeout(() => {
                document.body.classList.remove('too-perfect');
                // わずかな不完全さを戻す
                Object.keys(this.perfectionLevels).forEach(key => {
                    this.perfectionLevels[key] = 98 + Math.random() * 1.9;
                });
                this.updateTotalPerfection();
            }, 3000);
        });
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new PerfectlyImperfect();
});