class CreepyStaringGame {
    constructor() {
        this.score = 0;
        this.multiplier = 1;
        this.stareProgress = 0;
        this.isStaring = false;
        this.gameTime = 0;
        this.lastBlink = Date.now();
        this.eyesClosed = false;
        this.floatingEyes = [];
        this.messages = [
            "見て",
            "まばたきしないで",
            "もっと近くに",
            "逃げないで",
            "ずっと見て",
            "目をそらさないで",
            "私を見て",
            "もっと",
            "いいね",
            "そのまま"
        ];
        
        this.init();
    }
    
    init() {
        this.setupElements();
        this.bindEvents();
        this.startGame();
        this.createFloatingEyes();
        this.startHeartbeat();
    }
    
    setupElements() {
        this.scoreEl = document.getElementById('score');
        this.multiplierEl = document.getElementById('multiplier');
        this.progressBar = document.getElementById('progressBar');
        this.timerEl = document.getElementById('timer');
        this.messageEl = document.getElementById('message');
        this.mainEye = document.getElementById('mainEye');
        this.eyeContainer = document.getElementById('eyeContainer');
        this.floatingEyesContainer = document.getElementById('floatingEyes');
        this.heartbeatAudio = document.getElementById('heartbeat');
    }
    
    bindEvents() {
        // マウスの動きを追跡
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        
        // クリック/タッチで凝視開始
        this.eyeContainer.addEventListener('mousedown', () => this.startStaring());
        this.eyeContainer.addEventListener('mouseup', () => this.stopStaring());
        this.eyeContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startStaring();
        });
        this.eyeContainer.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopStaring();
        });
        
        // ページ離脱時の警告
        window.addEventListener('beforeunload', (e) => {
            if (this.score > 0) {
                e.preventDefault();
                e.returnValue = '本当に離れるの？';
            }
        });
    }
    
    startGame() {
        this.gameInterval = setInterval(() => {
            this.gameTime++;
            this.updateTimer();
            this.updateGame();
        }, 100);
        
        // まばたきチェック
        this.blinkInterval = setInterval(() => {
            this.checkBlink();
        }, 3000 + Math.random() * 2000);
    }
    
    handleMouseMove(e) {
        const rect = this.eyeContainer.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        this.updateEyeDirection(x, y);
    }
    
    handleTouchMove(e) {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const rect = this.eyeContainer.getBoundingClientRect();
            const x = (touch.clientX - rect.left - rect.width / 2) / rect.width;
            const y = (touch.clientY - rect.top - rect.height / 2) / rect.height;
            this.updateEyeDirection(x, y);
        }
    }
    
    updateEyeDirection(x, y) {
        const iris = this.mainEye.querySelector('.iris');
        const maxMove = 30;
        const moveX = x * maxMove;
        const moveY = y * maxMove;
        
        iris.style.transform = `translate(${moveX}px, ${moveY}px)`;
        
        // 浮遊する目も同じ方向を見る
        this.floatingEyes.forEach(eye => {
            const eyeIris = eye.querySelector('.iris');
            if (eyeIris) {
                eyeIris.style.transform = `translate(${moveX * 0.8}px, ${moveY * 0.8}px)`;
            }
        });
    }
    
    startStaring() {
        if (!this.eyesClosed) {
            this.isStaring = true;
            this.mainEye.classList.add('staring');
            this.showMessage();
            
            // 振動フィードバック
            if (navigator.vibrate) {
                navigator.vibrate([50, 30, 50]);
            }
        }
    }
    
    stopStaring() {
        this.isStaring = false;
        this.mainEye.classList.remove('staring');
    }
    
    updateGame() {
        if (this.isStaring && !this.eyesClosed) {
            // 凝視度を増加
            this.stareProgress = Math.min(100, this.stareProgress + 2);
            
            // スコア増加
            if (this.stareProgress > 20) {
                this.score += this.multiplier;
                this.updateScore();
            }
            
            // マルチプライヤー更新
            if (this.stareProgress > 80) {
                this.multiplier = Math.min(10, Math.floor(this.stareProgress / 20));
                this.updateMultiplier();
            }
        } else {
            // 凝視度を減少
            this.stareProgress = Math.max(0, this.stareProgress - 1);
            if (this.stareProgress < 20) {
                this.multiplier = 1;
                this.updateMultiplier();
            }
        }
        
        this.updateProgressBar();
        
        // 不気味な効果を追加
        this.addCreepyEffects();
    }
    
    checkBlink() {
        if (this.isStaring && Math.random() < 0.3) {
            this.eyesClosed = true;
            this.mainEye.classList.add('blink');
            
            setTimeout(() => {
                this.eyesClosed = false;
                this.mainEye.classList.remove('blink');
            }, 200);
            
            // ペナルティ
            this.stareProgress = Math.max(0, this.stareProgress - 20);
            this.showMessage("まばたきした！");
        }
    }
    
    showMessage(customMessage) {
        const message = customMessage || this.messages[Math.floor(Math.random() * this.messages.length)];
        this.messageEl.textContent = message;
        this.messageEl.style.opacity = '1';
        
        setTimeout(() => {
            this.messageEl.style.opacity = '0';
        }, 2000);
    }
    
    updateScore() {
        this.scoreEl.textContent = this.score;
        this.scoreEl.classList.add('pulse');
        setTimeout(() => this.scoreEl.classList.remove('pulse'), 300);
    }
    
    updateMultiplier() {
        this.multiplierEl.textContent = `x${this.multiplier}`;
        if (this.multiplier > 1) {
            this.multiplierEl.classList.add('active');
        } else {
            this.multiplierEl.classList.remove('active');
        }
    }
    
    updateProgressBar() {
        this.progressBar.style.width = `${this.stareProgress}%`;
        
        // 色を変更
        if (this.stareProgress > 80) {
            this.progressBar.style.backgroundColor = '#ff0000';
        } else if (this.stareProgress > 50) {
            this.progressBar.style.backgroundColor = '#ff6600';
        } else {
            this.progressBar.style.backgroundColor = '#666';
        }
    }
    
    updateTimer() {
        const minutes = Math.floor(this.gameTime / 600);
        const seconds = Math.floor((this.gameTime % 600) / 10);
        this.timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    createFloatingEyes() {
        setInterval(() => {
            if (this.floatingEyes.length < 10 && this.score > 50) {
                this.addFloatingEye();
            }
        }, 5000);
    }
    
    addFloatingEye() {
        const eye = document.createElement('div');
        eye.className = 'floating-eye';
        eye.innerHTML = `
            <div class="iris">
                <div class="pupil"></div>
            </div>
        `;
        
        // ランダムな位置
        eye.style.left = `${Math.random() * 100}%`;
        eye.style.top = `${Math.random() * 100}%`;
        eye.style.animationDelay = `${Math.random() * 5}s`;
        
        this.floatingEyesContainer.appendChild(eye);
        this.floatingEyes.push(eye);
        
        // 一定時間後に削除
        setTimeout(() => {
            eye.style.opacity = '0';
            setTimeout(() => {
                eye.remove();
                this.floatingEyes = this.floatingEyes.filter(e => e !== eye);
            }, 1000);
        }, 10000 + Math.random() * 10000);
    }
    
    addCreepyEffects() {
        // スコアに応じて不気味な効果を強化
        if (this.score > 100) {
            document.body.classList.add('creepy-level-1');
        }
        if (this.score > 500) {
            document.body.classList.add('creepy-level-2');
        }
        if (this.score > 1000) {
            document.body.classList.add('creepy-level-3');
        }
        
        // ランダムなグリッチ効果
        if (Math.random() < 0.01 && this.score > 200) {
            document.body.classList.add('glitch');
            setTimeout(() => document.body.classList.remove('glitch'), 100);
        }
    }
    
    startHeartbeat() {
        // 心拍音を再生（ユーザーインタラクション後）
        document.addEventListener('click', () => {
            this.heartbeatAudio.volume = 0.3;
            this.heartbeatAudio.play().catch(() => {});
        }, { once: true });
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    new CreepyStaringGame();
});