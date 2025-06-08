class CreepyCuteGenerator {
    constructor() {
        this.canvas = document.getElementById('artCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.creepiness = 50;
        this.cuteness = 50;
        
        this.initCanvas();
        this.bindEvents();
        this.generate();
    }
    
    initCanvas() {
        const size = Math.min(window.innerWidth * 0.8, 500);
        this.canvas.width = size;
        this.canvas.height = size;
    }
    
    bindEvents() {
        document.getElementById('generateBtn').addEventListener('click', () => this.generate());
        document.getElementById('saveBtn').addEventListener('click', () => this.save());
        document.getElementById('shareBtn').addEventListener('click', () => this.share());
        
        document.getElementById('creepiness').addEventListener('input', (e) => {
            this.creepiness = e.target.value;
            document.getElementById('creepinessValue').textContent = e.target.value;
        });
        
        document.getElementById('cuteness').addEventListener('input', (e) => {
            this.cuteness = e.target.value;
            document.getElementById('cutenessValue').textContent = e.target.value;
        });
        
        // モバイルでのタッチイベント対応
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.generate();
        });
    }
    
    generate() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // 背景をクリア
        ctx.fillStyle = this.getBackgroundColor();
        ctx.fillRect(0, 0, w, h);
        
        // メインの生き物を生成
        const centerX = w / 2;
        const centerY = h / 2;
        const baseSize = w * 0.3;
        
        // 体の形状を決定
        this.drawBody(centerX, centerY, baseSize);
        
        // 目を描画
        this.drawEyes(centerX, centerY, baseSize);
        
        // 口を描画
        this.drawMouth(centerX, centerY, baseSize);
        
        // 装飾を追加
        this.addDecorations(centerX, centerY, baseSize);
        
        // ノイズ効果
        if (this.creepiness > 60) {
            this.addNoise();
        }
    }
    
    drawBody(x, y, size) {
        const ctx = this.ctx;
        const creepyFactor = this.creepiness / 100;
        const cuteFactor = this.cuteness / 100;
        
        ctx.save();
        
        // 体の色
        const hue = 180 - (creepyFactor * 180) + (cuteFactor * 60);
        const saturation = 50 + (cuteFactor * 30) - (creepyFactor * 20);
        const lightness = 70 - (creepyFactor * 30);
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        // 体の形状
        ctx.beginPath();
        
        if (cuteFactor > 0.7) {
            // かわいい丸い形
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                const wobble = Math.sin(angle * 3) * size * 0.1 * creepyFactor;
                const r = size + wobble;
                const px = x + Math.cos(angle) * r;
                const py = y + Math.sin(angle) * r;
                
                if (i === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.quadraticCurveTo(
                        x + Math.cos(angle - Math.PI / 6) * r * 1.2,
                        y + Math.sin(angle - Math.PI / 6) * r * 1.2,
                        px, py
                    );
                }
            }
        } else {
            // キモい不規則な形
            const points = 5 + Math.floor(creepyFactor * 10);
            for (let i = 0; i < points; i++) {
                const angle = (i / points) * Math.PI * 2;
                const r = size * (0.8 + Math.random() * 0.4);
                const px = x + Math.cos(angle) * r;
                const py = y + Math.sin(angle) * r;
                
                if (i === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
        }
        
        ctx.closePath();
        ctx.fill();
        
        // 触手や突起を追加
        if (creepyFactor > 0.5) {
            const tentacles = Math.floor(3 + creepyFactor * 5);
            for (let i = 0; i < tentacles; i++) {
                const angle = (i / tentacles) * Math.PI * 2 + Math.random() * 0.5;
                const length = size * (0.3 + creepyFactor * 0.5);
                this.drawTentacle(x, y, angle, length);
            }
        }
        
        ctx.restore();
    }
    
    drawTentacle(x, y, angle, length) {
        const ctx = this.ctx;
        const segments = 10;
        
        ctx.save();
        ctx.strokeStyle = `rgba(50, 50, 50, ${0.3 + this.creepiness / 200})`;
        ctx.lineWidth = length / 10;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        
        let currentX = x;
        let currentY = y;
        
        for (let i = 1; i <= segments; i++) {
            const segmentLength = length / segments;
            const wobble = Math.sin(i * 0.5) * 0.3;
            currentX += Math.cos(angle + wobble) * segmentLength;
            currentY += Math.sin(angle + wobble) * segmentLength;
            ctx.lineTo(currentX, currentY);
        }
        
        ctx.stroke();
        ctx.restore();
    }
    
    drawEyes(x, y, size) {
        const ctx = this.ctx;
        const creepyFactor = this.creepiness / 100;
        const cuteFactor = this.cuteness / 100;
        
        const eyeCount = creepyFactor > 0.7 ? Math.floor(2 + Math.random() * 4) : 2;
        const eyeSize = size * 0.15 * (1 + cuteFactor * 0.5);
        
        for (let i = 0; i < eyeCount; i++) {
            let eyeX, eyeY;
            
            if (eyeCount === 2) {
                eyeX = x + (i === 0 ? -size * 0.3 : size * 0.3);
                eyeY = y - size * 0.2;
            } else {
                const angle = (i / eyeCount) * Math.PI * 2;
                const distance = size * 0.4;
                eyeX = x + Math.cos(angle) * distance;
                eyeY = y + Math.sin(angle) * distance * 0.6;
            }
            
            // 白目
            ctx.fillStyle = creepyFactor > 0.6 ? '#ffeeee' : 'white';
            ctx.beginPath();
            ctx.ellipse(eyeX, eyeY, eyeSize, eyeSize * (1 + creepyFactor * 0.3), 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 瞳
            const pupilSize = eyeSize * (0.5 - cuteFactor * 0.2 + creepyFactor * 0.3);
            ctx.fillStyle = creepyFactor > 0.5 ? '#330000' : '#000000';
            ctx.beginPath();
            ctx.arc(eyeX, eyeY, pupilSize, 0, Math.PI * 2);
            ctx.fill();
            
            // キラキラ
            if (cuteFactor > 0.5) {
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(eyeX - pupilSize * 0.3, eyeY - pupilSize * 0.3, pupilSize * 0.3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    drawMouth(x, y, size) {
        const ctx = this.ctx;
        const creepyFactor = this.creepiness / 100;
        const cuteFactor = this.cuteness / 100;
        
        ctx.save();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        
        if (cuteFactor > 0.6 && creepyFactor < 0.4) {
            // かわいい笑顔
            ctx.beginPath();
            ctx.arc(x, y + size * 0.1, size * 0.2, 0, Math.PI);
            ctx.stroke();
        } else if (creepyFactor > 0.6) {
            // 不気味な口
            ctx.beginPath();
            const teeth = 5 + Math.floor(creepyFactor * 10);
            const mouthWidth = size * 0.4;
            const mouthHeight = size * 0.2;
            
            // 口の輪郭
            ctx.moveTo(x - mouthWidth, y);
            for (let i = 0; i <= teeth; i++) {
                const tx = x - mouthWidth + (i / teeth) * mouthWidth * 2;
                const ty = y + (i % 2 === 0 ? 0 : mouthHeight);
                ctx.lineTo(tx, ty);
            }
            ctx.stroke();
        } else {
            // 普通の口
            ctx.beginPath();
            ctx.moveTo(x - size * 0.2, y + size * 0.2);
            ctx.quadraticCurveTo(x, y + size * 0.3, x + size * 0.2, y + size * 0.2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    addDecorations(x, y, size) {
        const ctx = this.ctx;
        const creepyFactor = this.creepiness / 100;
        const cuteFactor = this.cuteness / 100;
        
        // かわいい装飾
        if (cuteFactor > 0.5) {
            // ハート
            const hearts = Math.floor(cuteFactor * 5);
            for (let i = 0; i < hearts; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = size * (1.2 + Math.random() * 0.5);
                const hx = x + Math.cos(angle) * distance;
                const hy = y + Math.sin(angle) * distance;
                this.drawHeart(hx, hy, 10 + cuteFactor * 10);
            }
        }
        
        // キモい装飾
        if (creepyFactor > 0.5) {
            // 斑点や傷
            const spots = Math.floor(creepyFactor * 20);
            for (let i = 0; i < spots; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * size;
                const sx = x + Math.cos(angle) * distance;
                const sy = y + Math.sin(angle) * distance;
                
                ctx.fillStyle = `rgba(0, 0, 0, ${0.1 + Math.random() * 0.2})`;
                ctx.beginPath();
                ctx.arc(sx, sy, 2 + Math.random() * 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    drawHeart(x, y, size) {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = 'rgba(255, 150, 200, 0.7)';
        ctx.beginPath();
        ctx.moveTo(x, y + size / 4);
        ctx.quadraticCurveTo(x, y, x - size / 2, y);
        ctx.arc(x - size / 2, y - size / 4, size / 4, Math.PI, 0);
        ctx.arc(x, y - size / 4, size / 4, Math.PI, 0);
        ctx.quadraticCurveTo(x + size / 2, y, x, y + size / 4);
        ctx.fill();
        ctx.restore();
    }
    
    addNoise() {
        const ctx = this.ctx;
        const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 20;
            data[i] += noise;
            data[i + 1] += noise;
            data[i + 2] += noise;
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
    
    getBackgroundColor() {
        const creepyFactor = this.creepiness / 100;
        const cuteFactor = this.cuteness / 100;
        
        const hue = 200 + cuteFactor * 100 - creepyFactor * 50;
        const saturation = 20 - creepyFactor * 10;
        const lightness = 95 - creepyFactor * 20;
        
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
    
    save() {
        const link = document.createElement('a');
        link.download = `creepy-cute-${Date.now()}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
    }
    
    share() {
        if (navigator.share) {
            this.canvas.toBlob(blob => {
                const file = new File([blob], 'creepy-cute.png', { type: 'image/png' });
                navigator.share({
                    title: 'キモかわアート',
                    text: 'キモかわアートジェネレーターで作成しました！',
                    files: [file]
                }).catch(() => {
                    alert('シェア機能はこのブラウザでサポートされていません');
                });
            });
        } else {
            alert('シェア機能はこのブラウザでサポートされていません');
        }
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new CreepyCuteGenerator();
});