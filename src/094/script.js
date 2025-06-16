class CircularJourney {
    constructor() {
        this.currentLifeStage = 0;
        this.currentSeason = 0;
        this.storyIndex = 0;
        this.journeyAngle = 0;
        
        this.stories = [
            "昔々、ある旅人が長い旅に出ました...",
            "旅人は多くの土地を巡り、様々な人と出会いました。",
            "ある日、旅人は見覚えのある景色に出会います。",
            "それは旅の始まりの場所でした。",
            "しかし今の旅人には、出発時とは違う何かがありました。",
            "経験、知恵、そして理解。",
            "旅人は悟りました。終わりは新たな始まりだと。",
            "そして再び、旅人は歩き始めました..."
        ];
        
        this.seasons = [
            { name: '春', color: '#90EE90', haiku: '桜咲き 散りてまた咲く 来年も' },
            { name: '夏', color: '#87CEEB', haiku: '蝉の声 静寂に還り また響く' },
            { name: '秋', color: '#DDA0DD', haiku: '紅葉散り 土に還りて 芽吹く時' },
            { name: '冬', color: '#B0C4DE', haiku: '雪解けて 川となり海 雲となる' }
        ];
        
        this.init();
    }
    
    init() {
        this.drawOuroboros();
        this.setupLifeCycle();
        this.drawMobius();
        this.setupSeasons();
        this.setupStory();
        this.setupPalindrome();
        this.setupEternalClock();
        this.drawSpiral();
        this.setupJourneyTracker();
    }
    
    // ウロボロスの蛇
    drawOuroboros() {
        const canvas = document.getElementById('ouroborosCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 300;
        
        let angle = 0;
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = 100;
            
            // 蛇の体
            ctx.beginPath();
            for (let i = 0; i < 360; i++) {
                const rad = (i * Math.PI) / 180;
                const x = centerX + Math.cos(rad + angle) * radius;
                const y = centerY + Math.sin(rad + angle) * radius;
                const size = 15 + Math.sin(i * 0.1) * 5;
                
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(rad + angle + Math.PI / 2);
                
                // 鱗のパターン
                const gradient = ctx.createLinearGradient(-size, 0, size, 0);
                gradient.addColorStop(0, '#2ecc71');
                gradient.addColorStop(0.5, '#27ae60');
                gradient.addColorStop(1, '#229954');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(-size/2, -size/2, size, size);
                ctx.restore();
            }
            
            // 頭部（尾を食べている）
            const headX = centerX + Math.cos(angle) * radius;
            const headY = centerY + Math.sin(angle) * radius;
            
            ctx.save();
            ctx.translate(headX, headY);
            ctx.rotate(angle + Math.PI / 2);
            
            // 頭
            ctx.fillStyle = '#229954';
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.fill();
            
            // 目
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(-8, -5, 3, 0, Math.PI * 2);
            ctx.arc(8, -5, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
            
            angle += 0.01;
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    // 人生の円環
    setupLifeCycle() {
        const stages = document.querySelectorAll('.life-stage');
        const currentStageDisplay = document.getElementById('currentStage');
        
        const updateStage = () => {
            stages.forEach((stage, index) => {
                stage.classList.remove('active');
                if (index === this.currentLifeStage) {
                    stage.classList.add('active');
                    currentStageDisplay.textContent = `現在: ${stage.textContent}`;
                }
            });
            
            this.currentLifeStage = (this.currentLifeStage + 1) % stages.length;
        };
        
        setInterval(updateStage, 3000);
        updateStage();
    }
    
    // メビウスの輪
    drawMobius() {
        const canvas = document.getElementById('mobiusCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 300;
        
        let rotation = 0;
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(rotation);
            
            // メビウスの輪を描画
            for (let t = 0; t < Math.PI * 2; t += 0.01) {
                const r = 80;
                const w = 30;
                
                // パラメトリック方程式
                const x = r * Math.cos(t) * (1 + w/2 * Math.cos(t/2));
                const y = r * Math.sin(t) * (1 + w/2 * Math.cos(t/2));
                const z = w/2 * Math.sin(t/2);
                
                // 3D -> 2D投影
                const projX = x;
                const projY = y * 0.7 + z * 0.3;
                
                // 色は位置によって変化（表裏の区別なし）
                const hue = (t / (Math.PI * 2)) * 360;
                ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
                ctx.fillRect(projX - 2, projY - 2, 4, 4);
            }
            
            ctx.restore();
            rotation += 0.005;
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    // 季節の巡り
    setupSeasons() {
        const wheel = document.getElementById('seasonWheel');
        const haiku = document.getElementById('seasonHaiku');
        const pointer = wheel.querySelector('.season-pointer');
        
        const updateSeason = () => {
            const angle = this.currentSeason * 90;
            pointer.style.transform = `rotate(${angle}deg)`;
            
            const currentSeasonData = this.seasons[this.currentSeason];
            haiku.textContent = currentSeasonData.haiku;
            
            // 背景色のグラデーション変更
            const nextSeason = this.seasons[(this.currentSeason + 1) % 4];
            wheel.style.background = `linear-gradient(${angle}deg, ${currentSeasonData.color}, ${nextSeason.color})`;
            
            this.currentSeason = (this.currentSeason + 1) % 4;
        };
        
        setInterval(updateSeason, 4000);
        updateSeason();
    }
    
    // 円環の物語
    setupStory() {
        const storyText = document.getElementById('storyText');
        const nextBtn = document.getElementById('nextStory');
        const progress = document.getElementById('storyProgress');
        
        const updateStory = () => {
            storyText.style.opacity = '0';
            setTimeout(() => {
                storyText.textContent = this.stories[this.storyIndex];
                storyText.style.opacity = '1';
                
                // プログレスバーを円形に
                const angle = (this.storyIndex / this.stories.length) * 360;
                progress.style.background = `conic-gradient(#3498db 0deg, #3498db ${angle}deg, #ecf0f1 ${angle}deg)`;
                
                this.storyIndex = (this.storyIndex + 1) % this.stories.length;
            }, 300);
        };
        
        nextBtn.addEventListener('click', updateStory);
    }
    
    // 回文生成
    setupPalindrome() {
        const input = document.getElementById('palindromeInput');
        const display = document.getElementById('palindromeDisplay');
        const generateBtn = document.getElementById('generatePalindrome');
        
        const createPalindrome = () => {
            const text = input.value || 'たけやぶやけた';
            const reversed = text.split('').reverse().join('');
            const palindrome = text + reversed;
            
            display.innerHTML = '';
            palindrome.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.animationDelay = index * 0.05 + 's';
                span.className = 'palindrome-char';
                display.appendChild(span);
            });
        };
        
        generateBtn.addEventListener('click', createPalindrome);
        input.addEventListener('input', createPalindrome);
    }
    
    // 永遠の時計
    setupEternalClock() {
        const clock = document.getElementById('eternalClock');
        const hourHand = clock.querySelector('.hour-hand');
        const minuteHand = clock.querySelector('.minute-hand');
        const philosophy = document.getElementById('timePhilosophy');
        
        const philosophies = [
            '時は巡り、また始まる',
            '終わりは始まり、始まりは終わり',
            '昨日は明日、明日は昨日',
            '過去と未来が出会う場所',
            '永遠の今、この瞬間'
        ];
        
        let philosophyIndex = 0;
        
        const updateClock = () => {
            const now = new Date();
            const hours = now.getHours() % 12;
            const minutes = now.getMinutes();
            
            const hourDeg = (hours * 30) + (minutes * 0.5);
            const minuteDeg = minutes * 6;
            
            hourHand.style.transform = `rotate(${hourDeg}deg)`;
            minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
            
            // 12時になったら哲学を変更
            if (hours === 0 && minutes === 0) {
                philosophy.textContent = philosophies[philosophyIndex];
                philosophyIndex = (philosophyIndex + 1) % philosophies.length;
            }
        };
        
        setInterval(updateClock, 1000);
        updateClock();
    }
    
    // フラクタル螺旋
    drawSpiral() {
        const canvas = document.getElementById('spiralCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 300;
        
        let phase = 0;
        
        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            // 黄金螺旋
            ctx.strokeStyle = '#f39c12';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let t = 0; t < 100; t += 0.1) {
                const r = Math.pow(1.618, t * 0.1) * Math.sin(phase);
                const angle = t + phase;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                
                if (t === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
            
            phase += 0.02;
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    // 旅の追跡
    setupJourneyTracker() {
        const journeyCircle = document.getElementById('journeyCircle');
        const journeyPoint = document.getElementById('journeyPoint');
        const journeyStatus = document.getElementById('journeyStatus');
        const resetBtn = document.getElementById('resetJourney');
        
        const statuses = [
            '旅は続く...',
            '新しい発見',
            '振り返りの時',
            '前進あるのみ',
            '原点回帰',
            'また新たな旅へ'
        ];
        
        const updateJourney = () => {
            this.journeyAngle += 2;
            const rad = (this.journeyAngle * Math.PI) / 180;
            const radius = 80;
            const x = 90 + Math.cos(rad) * radius;
            const y = 90 + Math.sin(rad) * radius;
            
            journeyPoint.style.left = x + 'px';
            journeyPoint.style.top = y + 'px';
            
            // 一周ごとにステータス更新
            if (this.journeyAngle % 360 === 0) {
                const statusIndex = (this.journeyAngle / 360) % statuses.length;
                journeyStatus.textContent = statuses[statusIndex];
            }
        };
        
        setInterval(updateJourney, 50);
        
        resetBtn.addEventListener('click', () => {
            this.journeyAngle = 0;
            journeyStatus.textContent = '新たな始まり（それは古い終わり）';
        });
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new CircularJourney();
});