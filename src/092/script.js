class StaticMotion {
    constructor() {
        this.motionLevel = 0;
        this.observers = [];
        this.init();
    }
    
    init() {
        this.setupZenoArrow();
        this.setupAfterimage();
        this.setupStrobe();
        this.setupVibration();
        this.setupRelativeMotion();
        this.setupFrozenTime();
        this.setupPotentialMotion();
        this.setupMotionDetection();
        this.startAnimation();
    }
    
    // ゼノンの矢
    setupZenoArrow() {
        const canvas = document.getElementById('zenoArrow');
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 150;
        
        let positions = [];
        const steps = 20;
        
        // 矢の各瞬間の位置を事前計算
        for (let i = 0; i < steps; i++) {
            positions.push({
                x: 20 + (260 / steps) * i,
                y: 75,
                opacity: 1 - (i / steps) * 0.8
            });
        }
        
        const drawArrow = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // すべての位置に矢を描画（静止した連続）
            positions.forEach((pos, index) => {
                ctx.save();
                ctx.globalAlpha = pos.opacity;
                ctx.translate(pos.x, pos.y);
                
                // 矢の形
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(-20, -5);
                ctx.lineTo(-20, 5);
                ctx.closePath();
                ctx.fillStyle = '#333';
                ctx.fill();
                
                // 軸
                ctx.beginPath();
                ctx.moveTo(-20, 0);
                ctx.lineTo(-40, 0);
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                ctx.restore();
            });
            
            // 時間の目盛り
            ctx.strokeStyle = '#ccc';
            ctx.lineWidth = 1;
            for (let i = 0; i < steps; i++) {
                const x = 20 + (260 / steps) * i;
                ctx.beginPath();
                ctx.moveTo(x, 140);
                ctx.lineTo(x, 145);
                ctx.stroke();
            }
        };
        
        drawArrow();
    }
    
    // 残像効果
    setupAfterimage() {
        const container = document.getElementById('afterimageBox');
        const ball = container.querySelector('.static-ball');
        
        let afterimages = [];
        
        // マウス追従で残像を作る
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 新しい残像を追加
            const afterimage = document.createElement('div');
            afterimage.className = 'afterimage';
            afterimage.style.left = x + 'px';
            afterimage.style.top = y + 'px';
            container.appendChild(afterimage);
            afterimages.push(afterimage);
            
            // 古い残像を削除
            if (afterimages.length > 10) {
                const old = afterimages.shift();
                old.remove();
            }
            
            // ボールは動かない
            ball.style.left = x + 'px';
            ball.style.top = y + 'px';
            
            this.updateMotionLevel(20);
        });
    }
    
    // ストロボ効果
    setupStrobe() {
        const object = document.querySelector('.strobe-object');
        let frame = 0;
        const positions = [
            { x: 0, y: 0 },
            { x: 50, y: 0 },
            { x: 100, y: 0 },
            { x: 150, y: 0 },
            { x: 200, y: 0 }
        ];
        
        setInterval(() => {
            frame = (frame + 1) % positions.length;
            const pos = positions[frame];
            
            // 瞬間移動（動きではない）
            object.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
            object.style.opacity = '1';
            
            // すぐに消える
            setTimeout(() => {
                object.style.opacity = '0';
            }, 100);
            
            this.updateMotionLevel(30);
        }, 500);
    }
    
    // 視覚的振動
    setupVibration() {
        const field = document.getElementById('vibrationField');
        
        // 静止パターンによる振動錯視
        const createPattern = () => {
            field.innerHTML = '';
            const size = 20;
            const gridSize = 10;
            
            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    const cell = document.createElement('div');
                    cell.className = 'vibration-cell';
                    cell.style.width = size + 'px';
                    cell.style.height = size + 'px';
                    cell.style.left = x * size + 'px';
                    cell.style.top = y * size + 'px';
                    
                    // チェッカーボードパターン
                    if ((x + y) % 2 === 0) {
                        cell.style.background = '#000';
                    } else {
                        cell.style.background = '#fff';
                    }
                    
                    // 微細な角度のずれで振動錯視
                    const angle = (x + y) * 2;
                    cell.style.transform = `rotate(${angle}deg)`;
                    
                    field.appendChild(cell);
                }
            }
        };
        
        createPattern();
        
        // パターンの向きを変えて振動感を強調
        let rotation = 0;
        setInterval(() => {
            rotation += 0.5;
            field.style.transform = `rotate(${rotation}deg)`;
            this.updateMotionLevel(10);
        }, 50);
    }
    
    // 相対的静止
    setupRelativeMotion() {
        const container = document.getElementById('relativeBox');
        const frame = container.querySelector('.reference-frame');
        const object = container.querySelector('.moving-static');
        
        let angle = 0;
        
        setInterval(() => {
            angle += 2;
            
            // 参照フレームを回転
            frame.style.transform = `rotate(${angle}deg)`;
            
            // オブジェクトを逆回転（相対的に静止）
            object.style.transform = `rotate(${-angle}deg)`;
            
            this.updateMotionLevel(15);
        }, 50);
    }
    
    // 時間の凍結
    setupFrozenTime() {
        const container = document.getElementById('frozenTime');
        
        // 複数の時間スライスを作成
        const createTimeSlices = () => {
            container.innerHTML = '';
            
            for (let i = 0; i < 5; i++) {
                const slice = document.createElement('div');
                slice.className = 'time-slice';
                slice.style.left = i * 40 + 'px';
                slice.style.opacity = 1 - i * 0.2;
                slice.style.transform = `scale(${1 - i * 0.1})`;
                
                // 各スライスは同じ瞬間の異なる表現
                const time = document.createElement('span');
                time.textContent = '12:34:56';
                time.style.fontSize = (16 - i * 2) + 'px';
                slice.appendChild(time);
                
                container.appendChild(slice);
            }
        };
        
        createTimeSlices();
        
        // 時間は進まないが、表現は変化する
        setInterval(() => {
            const slices = container.querySelectorAll('.time-slice');
            slices.forEach((slice, index) => {
                const scale = 1 - index * 0.1 + Math.sin(Date.now() * 0.001) * 0.05;
                slice.style.transform = `scale(${scale})`;
            });
            this.updateMotionLevel(5);
        }, 100);
    }
    
    // 潜在的運動
    setupPotentialMotion() {
        const spring = document.querySelector('.coiled-spring');
        
        // バネの張力を視覚化
        let tension = 0;
        let direction = 1;
        
        setInterval(() => {
            tension += direction * 0.01;
            
            if (tension > 1 || tension < 0) {
                direction *= -1;
            }
            
            // 圧縮状態を表現（でも動かない）
            spring.style.transform = `scaleY(${0.5 + tension * 0.5})`;
            spring.style.filter = `brightness(${1 + tension * 0.5})`;
            
            // エネルギーの蓄積を色で表現
            const hue = tension * 60; // 緑から赤へ
            spring.style.borderColor = `hsl(${120 - hue}, 70%, 50%)`;
            
            this.updateMotionLevel(tension * 20);
        }, 50);
    }
    
    // モーションレベルの更新
    updateMotionLevel(change) {
        this.motionLevel = Math.max(0, Math.min(100, this.motionLevel + change));
        
        // 時間とともに減衰
        this.motionLevel *= 0.95;
        
        document.getElementById('motionLevel').textContent = Math.floor(this.motionLevel);
        document.getElementById('motionMeter').style.width = this.motionLevel + '%';
    }
    
    // 動き検出のパラドックス
    setupMotionDetection() {
        // ページ全体の「動き」を監視
        let lastHash = '';
        
        setInterval(() => {
            // DOMの状態をハッシュ化
            const currentState = document.body.innerHTML;
            const currentHash = this.simpleHash(currentState);
            
            if (currentHash !== lastHash) {
                // 何かが変わった = 動いている
                // でも視覚的には静止している
                console.log('検出: 動きがありました（見えませんが）');
            }
            
            lastHash = currentHash;
        }, 1000);
    }
    
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }
    
    // 全体のアニメーション
    startAnimation() {
        const animate = () => {
            // 何もしない（これ自体が動かない動き）
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new StaticMotion();
    
    // ページ自体の微細な動き
    let microMotion = 0;
    setInterval(() => {
        microMotion += 0.1;
        // 1ピクセル未満の動き（知覚できない）
        document.body.style.transform = `translate(${Math.sin(microMotion) * 0.1}px, 0)`;
    }, 100);
});