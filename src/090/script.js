class NonExistenceManifestor {
    constructor() {
        this.existenceLevel = 0;
        this.voidParticles = [];
        this.nonColors = [
            'octarine', 'vantablack-white', 'invisible-visible', 
            'ulfire', 'jale', 'pleurigloss'
        ];
        this.unwords = [];
        this.voidMemories = [];
        this.soundFrequencies = [];
        
        this.init();
    }
    
    init() {
        this.createVoidParticles();
        this.manifestImpossibleShape();
        this.generateNonExistentColor();
        this.createSilentNoise();
        this.writeUnreadablePoetry();
        this.startVoidClock();
        this.generateForgottenMemories();
        this.createShadowParadox();
        this.bendNonExistentSpace();
        this.setupManifestationControl();
        
        this.animate();
    }
    
    // 存在しない粒子を生成
    createVoidParticles() {
        const container = document.getElementById('particles');
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'void-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = 10 + Math.random() * 20 + 's';
            
            // 存在と非存在の間で振動
            particle.dataset.existence = Math.random();
            
            container.appendChild(particle);
            this.voidParticles.push(particle);
        }
    }
    
    // 不可能な形状を描画
    manifestImpossibleShape() {
        const shapeContainer = document.querySelector('.shape-void');
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        // ペンローズの三角形的な不可能図形
        const drawImpossibleShape = () => {
            ctx.clearRect(0, 0, 200, 200);
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.existenceLevel / 100})`;
            ctx.lineWidth = 3;
            
            // 存在レベルに応じて形状が変化
            const distortion = Math.sin(Date.now() * 0.001) * 20;
            
            ctx.beginPath();
            // 不可能な接続
            ctx.moveTo(100 + distortion, 50);
            ctx.lineTo(150, 150);
            ctx.lineTo(50, 150);
            ctx.lineTo(100 - distortion, 50);
            
            // 奥行きの矛盾
            ctx.moveTo(100, 50);
            ctx.lineTo(100, 100 + distortion);
            ctx.moveTo(50, 150);
            ctx.lineTo(100, 100 - distortion);
            ctx.moveTo(150, 150);
            ctx.lineTo(100, 100);
            
            ctx.stroke();
        };
        
        shapeContainer.appendChild(canvas);
        setInterval(drawImpossibleShape, 50);
    }
    
    // 存在しない色を生成
    generateNonExistentColor() {
        const colorVoid = document.querySelector('.color-void');
        const colorName = document.getElementById('colorName');
        
        const updateNonColor = () => {
            // 可視光スペクトラム外の「色」
            const hue = Math.random() * 360;
            const saturation = 100 + Math.random() * 50; // 過飽和
            const lightness = Math.random() * 100;
            const alpha = this.existenceLevel / 100;
            
            // 複数の色を重ね合わせて存在しない色を作る
            const layers = [];
            for (let i = 0; i < 5; i++) {
                const h = (hue + i * 72) % 360;
                const s = saturation - i * 10;
                const l = lightness + Math.sin(Date.now() * 0.001 + i) * 20;
                layers.push(`hsla(${h}, ${s}%, ${l}%, ${alpha * 0.3})`);
            }
            
            colorVoid.style.background = `
                radial-gradient(circle at center, 
                    ${layers.join(', ')},
                    transparent
                )
            `;
            
            // 存在しない色の名前
            colorName.textContent = this.nonColors[Math.floor(Math.random() * this.nonColors.length)];
        };
        
        setInterval(updateNonColor, 2000);
        updateNonColor();
    }
    
    // 無音の騒音
    createSilentNoise() {
        const button = document.getElementById('playVoid');
        const viz = document.getElementById('soundViz');
        
        button.addEventListener('click', () => {
            // 音を視覚化（でも音は鳴らない）
            viz.innerHTML = '';
            
            for (let i = 0; i < 20; i++) {
                const bar = document.createElement('div');
                bar.className = 'sound-bar';
                bar.style.height = Math.random() * 100 + 'px';
                bar.style.animationDelay = i * 0.05 + 's';
                viz.appendChild(bar);
                
                // 存在しない周波数
                this.soundFrequencies.push({
                    freq: -Math.random() * 20000, // 負の周波数
                    amp: Math.random()
                });
            }
            
            // 触覚で「聴かせる」
            if (navigator.vibrate) {
                const pattern = [];
                for (let i = 0; i < 10; i++) {
                    pattern.push(Math.random() * 100);
                    pattern.push(Math.random() * 100);
                }
                navigator.vibrate(pattern);
            }
            
            setTimeout(() => {
                viz.innerHTML = '';
            }, 3000);
        });
    }
    
    // 読めない文字の詩
    writeUnreadablePoetry() {
        const poemContainer = document.getElementById('voidPoem');
        
        // 存在しない文字を生成
        const generateUnword = () => {
            const length = Math.floor(Math.random() * 8) + 3;
            let unword = '';
            
            for (let i = 0; i < length; i++) {
                // Unicode私用領域や結合文字を使用
                const ranges = [
                    [0xE000, 0xF8FF], // 私用領域
                    [0x0300, 0x036F], // 結合文字
                    [0x1AB0, 0x1AFF], // 結合文字拡張
                ];
                
                const range = ranges[Math.floor(Math.random() * ranges.length)];
                const char = String.fromCharCode(
                    Math.floor(Math.random() * (range[1] - range[0])) + range[0]
                );
                unword += char;
            }
            
            return unword;
        };
        
        // 詩を生成
        const generatePoem = () => {
            poemContainer.innerHTML = '';
            const lines = Math.floor(Math.random() * 4) + 3;
            
            for (let i = 0; i < lines; i++) {
                const line = document.createElement('p');
                const words = Math.floor(Math.random() * 5) + 2;
                
                for (let j = 0; j < words; j++) {
                    const span = document.createElement('span');
                    span.className = 'unword';
                    span.textContent = generateUnword();
                    span.style.opacity = (this.existenceLevel / 100).toString();
                    line.appendChild(span);
                    
                    if (j < words - 1) {
                        line.appendChild(document.createTextNode(' '));
                    }
                }
                
                poemContainer.appendChild(line);
            }
        };
        
        generatePoem();
        setInterval(generatePoem, 5000);
    }
    
    // 存在しない時間
    startVoidClock() {
        const hourHand = document.querySelector('.hour-hand');
        const minuteHand = document.querySelector('.minute-hand');
        const noHand = document.querySelector('.no-hand');
        const voidTime = document.getElementById('voidTime');
        
        const updateVoidTime = () => {
            // 通常の時間とは逆行する
            const now = new Date();
            const antiHours = (24 - now.getHours()) % 24;
            const antiMinutes = (60 - now.getMinutes()) % 60;
            const antiSeconds = (60 - now.getSeconds()) % 60;
            
            // 13時間制、100分制など
            const voidHours = Math.floor(antiHours * 13 / 24);
            const voidMinutes = Math.floor(antiMinutes * 100 / 60);
            
            // 針の角度（通常とは異なる動き）
            const hourDeg = (voidHours * 30) + (antiMinutes * 0.5);
            const minuteDeg = antiMinutes * 6;
            const noDeg = Date.now() * 0.1 % 360; // 存在しない針
            
            hourHand.style.transform = `rotate(${-hourDeg}deg)`;
            minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
            noHand.style.transform = `rotate(${noDeg}deg)`;
            
            // 存在しない時刻表示
            const symbols = ['∅', '∞', '≈', '∿', '⊗'];
            voidTime.textContent = `${symbols[voidHours % symbols.length]}:${voidMinutes.toString().padStart(2, '∅')}`;
        };
        
        setInterval(updateVoidTime, 100);
    }
    
    // 忘れられた記憶
    generateForgottenMemories() {
        const container = document.getElementById('memoryContainer');
        const button = document.getElementById('rememberVoid');
        
        button.addEventListener('click', () => {
            container.innerHTML = '';
            
            // 存在しない記憶の断片を生成
            const fragments = [
                '青い味がする音楽',
                '重力が横向きだった日',
                '名前のない色を見た瞬間',
                '時間が止まった3秒間',
                '影が本体になった出来事',
                '言葉にならない感情の形',
                '存在しない場所への旅',
                '会ったことのない懐かしい人'
            ];
            
            for (let i = 0; i < 3; i++) {
                const memory = document.createElement('div');
                memory.className = 'memory-fragment';
                memory.textContent = fragments[Math.floor(Math.random() * fragments.length)];
                memory.style.opacity = '0';
                container.appendChild(memory);
                
                // フェードイン後フェードアウト
                setTimeout(() => {
                    memory.style.opacity = (this.existenceLevel / 100).toString();
                    setTimeout(() => {
                        memory.style.opacity = '0';
                    }, 3000);
                }, i * 500);
            }
        });
    }
    
    // 影のパラドックス
    createShadowParadox() {
        const shadowless = document.getElementById('shadowless');
        
        // マウス位置に応じて影が逆方向に
        document.addEventListener('mousemove', (e) => {
            const rect = shadowless.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const angleX = (e.clientX - centerX) / window.innerWidth;
            const angleY = (e.clientY - centerY) / window.innerHeight;
            
            // 影のない物体に影を、物体のない影を動かす
            const objectWithoutShadow = shadowless.querySelector('.object-without-shadow');
            const shadowWithoutObject = shadowless.querySelector('.shadow-without-object');
            
            // 逆方向の影
            shadowWithoutObject.style.transform = `
                translate(${angleX * 50}px, ${angleY * 50}px)
                skew(${angleX * 10}deg, ${angleY * 10}deg)
            `;
            
            // 物体は影とは逆に動く
            objectWithoutShadow.style.transform = `
                translate(${-angleX * 20}px, ${-angleY * 20}px)
            `;
        });
    }
    
    // 存在しない空間を曲げる
    bendNonExistentSpace() {
        const voidSpace = document.getElementById('voidSpace');
        const insideOutside = voidSpace.querySelector('.inside-outside');
        
        // クラインの壺的な空間
        let phase = 0;
        const bendSpace = () => {
            phase += 0.02;
            
            const distortion = Math.sin(phase) * 20;
            const twist = Math.cos(phase * 0.5) * 180;
            
            insideOutside.style.transform = `
                perspective(500px)
                rotateX(${twist}deg)
                rotateY(${distortion}deg)
                translateZ(${Math.sin(phase * 2) * 50}px)
            `;
        };
        
        setInterval(bendSpace, 50);
    }
    
    // 存在レベルの制御
    setupManifestationControl() {
        const button = document.getElementById('manifestButton');
        const counter = document.getElementById('existenceLevel');
        
        button.addEventListener('click', () => {
            // ランダムに存在レベルを変更
            this.existenceLevel += (Math.random() - 0.5) * 40;
            this.existenceLevel = Math.max(0, Math.min(100, this.existenceLevel));
            
            counter.textContent = Math.floor(this.existenceLevel);
            
            // 存在レベルに応じて要素の透明度を変更
            document.body.style.opacity = 0.3 + (this.existenceLevel / 100) * 0.7;
            
            // 完全に存在しない/存在する時の効果
            if (this.existenceLevel <= 0) {
                document.body.classList.add('non-existent');
            } else if (this.existenceLevel >= 100) {
                document.body.classList.add('fully-existent');
                setTimeout(() => {
                    document.body.classList.remove('fully-existent');
                    this.existenceLevel = 50;
                }, 2000);
            } else {
                document.body.classList.remove('non-existent', 'fully-existent');
            }
        });
        
        // 自然な存在レベルの変動
        setInterval(() => {
            this.existenceLevel += (Math.random() - 0.5) * 5;
            this.existenceLevel = Math.max(10, Math.min(90, this.existenceLevel));
            counter.textContent = Math.floor(this.existenceLevel);
        }, 1000);
    }
    
    // アニメーションループ
    animate() {
        // 粒子の存在状態を更新
        this.voidParticles.forEach(particle => {
            const existence = parseFloat(particle.dataset.existence);
            const newExistence = existence + (Math.random() - 0.5) * 0.1;
            particle.dataset.existence = Math.max(0, Math.min(1, newExistence));
            particle.style.opacity = particle.dataset.existence;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new NonExistenceManifestor();
    
    // コンソールに存在しないエラー
    console.log('%c このエラーは存在しません ', 
        'background: transparent; color: transparent; font-size: 20px');
});