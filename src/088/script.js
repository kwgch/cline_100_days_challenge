class InfinityVisualizer {
    constructor() {
        this.canvas = document.getElementById('infinityCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.type = 'mathematical';
        
        // ビューポート設定
        this.zoom = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        
        // アニメーション用
        this.time = 0;
        this.depth = 0;
        this.iterations = 0;
        this.animationId = null;
        
        // 無限の種類と説明
        this.infinityTypes = {
            mathematical: {
                name: '数学的無限',
                description: '数列、級数、極限における無限の概念。無限に続く数の列や、限りなく小さくなる分割を視覚化。'
            },
            fractal: {
                name: 'フラクタル無限',
                description: '自己相似性を持つ図形。どこまでも拡大しても同じパターンが現れる無限の複雑さ。'
            },
            paradox: {
                name: 'パラドックス無限',
                description: 'ゼノンのパラドックスやヒルベルトのホテルなど、無限が生み出す直感に反する現象。'
            },
            recursive: {
                name: '再帰的無限',
                description: '自己参照による無限ループ。鏡の中の鏡、入れ子構造の永遠の繰り返し。'
            },
            continuous: {
                name: '連続体無限',
                description: '実数の連続性が持つ無限。どんなに小さな区間にも無限の点が存在する。'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.bindEvents();
        this.updateInfo();
        this.animate();
    }
    
    setupCanvas() {
        const resize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.centerX = this.canvas.width / 2;
            this.centerY = this.canvas.height / 2;
        };
        resize();
        window.addEventListener('resize', resize);
    }
    
    bindEvents() {
        // 無限タイプの切り替え
        document.querySelectorAll('.infinity-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.infinity-btn.active').classList.remove('active');
                btn.classList.add('active');
                this.type = btn.dataset.type;
                this.reset();
                this.updateInfo();
            });
        });
        
        // ズームコントロール
        document.getElementById('zoomIn').addEventListener('click', () => {
            this.zoom *= 1.5;
            this.depth++;
        });
        
        document.getElementById('zoomOut').addEventListener('click', () => {
            this.zoom /= 1.5;
            this.depth = Math.max(0, this.depth - 1);
        });
        
        document.getElementById('reset').addEventListener('click', () => {
            this.reset();
        });
        
        // マウス操作
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoom *= delta;
            this.depth = Math.max(0, Math.floor(Math.log(this.zoom) / Math.log(1.5)));
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.offsetX += e.clientX - this.lastX;
                this.offsetY += e.clientY - this.lastY;
                this.lastX = e.clientX;
                this.lastY = e.clientY;
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
        
        // タッチ操作
        let touchDistance = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.isDragging = true;
                this.lastX = e.touches[0].clientX;
                this.lastY = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                touchDistance = Math.sqrt(dx * dx + dy * dy);
            }
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 1 && this.isDragging) {
                this.offsetX += e.touches[0].clientX - this.lastX;
                this.offsetY += e.touches[0].clientY - this.lastY;
                this.lastX = e.touches[0].clientX;
                this.lastY = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const newDistance = Math.sqrt(dx * dx + dy * dy);
                this.zoom *= newDistance / touchDistance;
                touchDistance = newDistance;
                this.depth = Math.max(0, Math.floor(Math.log(this.zoom) / Math.log(1.5)));
            }
        });
        
        this.canvas.addEventListener('touchend', () => {
            this.isDragging = false;
        });
    }
    
    reset() {
        this.zoom = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.depth = 0;
        this.iterations = 0;
        this.time = 0;
    }
    
    updateInfo() {
        const info = this.infinityTypes[this.type];
        document.getElementById('infinityName').textContent = info.name;
        document.getElementById('infinityDescription').textContent = info.description;
    }
    
    animate() {
        this.time++;
        this.iterations++;
        
        // 画面をクリア
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 変換を適用
        this.ctx.save();
        this.ctx.translate(this.centerX + this.offsetX, this.centerY + this.offsetY);
        this.ctx.scale(this.zoom, this.zoom);
        
        // タイプ別の描画
        switch (this.type) {
            case 'mathematical':
                this.drawMathematicalInfinity();
                break;
            case 'fractal':
                this.drawFractalInfinity();
                break;
            case 'paradox':
                this.drawParadoxInfinity();
                break;
            case 'recursive':
                this.drawRecursiveInfinity();
                break;
            case 'continuous':
                this.drawContinuousInfinity();
                break;
        }
        
        this.ctx.restore();
        
        // ステータス更新
        document.getElementById('depth').textContent = this.depth;
        document.getElementById('iterations').textContent = this.iterations;
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    drawMathematicalInfinity() {
        const ctx = this.ctx;
        
        // 無限級数の視覚化（1/2 + 1/4 + 1/8 + ...）
        let x = -200;
        let width = 200;
        let y = 0;
        
        ctx.strokeStyle = 'rgba(74, 144, 226, 0.8)';
        ctx.fillStyle = 'rgba(74, 144, 226, 0.3)';
        
        for (let i = 0; i < 20 + this.depth; i++) {
            if (width < 0.01 / this.zoom) break;
            
            ctx.beginPath();
            ctx.rect(x, y - width/2, width, width);
            ctx.fill();
            ctx.stroke();
            
            x += width;
            width /= 2;
        }
        
        // 螺旋による無限
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        for (let t = 0; t < 100 + this.depth * 10; t += 0.1) {
            const r = t * 2;
            const angle = t + this.time * 0.01;
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            
            if (t === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.stroke();
        
        // 無限小の分割
        const divisions = Math.min(100, 10 + this.depth * 5);
        for (let i = 0; i < divisions; i++) {
            const angle = (i / divisions) * Math.PI * 2;
            const r = 100 / (1 + i * 0.1);
            
            ctx.beginPath();
            ctx.arc(
                Math.cos(angle) * r,
                Math.sin(angle) * r,
                5 / (1 + i * 0.1),
                0,
                Math.PI * 2
            );
            ctx.fillStyle = `rgba(255, 255, 255, ${0.5 / (1 + i * 0.05)})`;
            ctx.fill();
        }
    }
    
    drawFractalInfinity() {
        const ctx = this.ctx;
        
        // シェルピンスキーの三角形
        const drawTriangle = (x, y, size, depth) => {
            if (depth === 0 || size < 1 / this.zoom) {
                ctx.beginPath();
                ctx.moveTo(x, y - size);
                ctx.lineTo(x - size * 0.866, y + size * 0.5);
                ctx.lineTo(x + size * 0.866, y + size * 0.5);
                ctx.closePath();
                ctx.fill();
                return;
            }
            
            const halfSize = size / 2;
            drawTriangle(x, y - halfSize, halfSize, depth - 1);
            drawTriangle(x - halfSize * 0.866, y + halfSize * 0.25, halfSize, depth - 1);
            drawTriangle(x + halfSize * 0.866, y + halfSize * 0.25, halfSize, depth - 1);
        };
        
        ctx.fillStyle = 'rgba(156, 89, 182, 0.5)';
        drawTriangle(0, 0, 200, Math.min(10, 5 + this.depth));
        
        // コッホ曲線
        const drawKoch = (x1, y1, x2, y2, depth) => {
            if (depth === 0) {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                return;
            }
            
            const dx = x2 - x1;
            const dy = y2 - y1;
            const x3 = x1 + dx / 3;
            const y3 = y1 + dy / 3;
            const x4 = x1 + 2 * dx / 3;
            const y4 = y1 + 2 * dy / 3;
            
            const angle = Math.atan2(dy, dx) - Math.PI / 3;
            const length = Math.sqrt(dx * dx + dy * dy) / 3;
            const x5 = x3 + Math.cos(angle) * length;
            const y5 = y3 + Math.sin(angle) * length;
            
            drawKoch(x1, y1, x3, y3, depth - 1);
            drawKoch(x3, y3, x5, y5, depth - 1);
            drawKoch(x5, y5, x4, y4, depth - 1);
            drawKoch(x4, y4, x2, y2, depth - 1);
        };
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1 / this.zoom;
        const kochDepth = Math.min(7, 3 + Math.floor(this.depth / 2));
        for (let i = 0; i < 3; i++) {
            const angle = i * Math.PI * 2 / 3 + this.time * 0.001;
            const x1 = Math.cos(angle) * 150;
            const y1 = Math.sin(angle) * 150;
            const x2 = Math.cos(angle + Math.PI * 2 / 3) * 150;
            const y2 = Math.sin(angle + Math.PI * 2 / 3) * 150;
            drawKoch(x1, y1, x2, y2, kochDepth);
        }
    }
    
    drawParadoxInfinity() {
        const ctx = this.ctx;
        
        // ゼノンのパラドックス - アキレスと亀
        const steps = Math.min(50, 10 + this.depth * 5);
        let achillesPos = -200;
        let tortoisePos = 0;
        
        ctx.strokeStyle = 'rgba(231, 76, 60, 0.8)';
        ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
        
        for (let i = 0; i < steps; i++) {
            const distance = tortoisePos - achillesPos;
            
            // アキレスの位置
            ctx.beginPath();
            ctx.arc(achillesPos, -50, 5, 0, Math.PI * 2);
            ctx.fill();
            
            // 亀の位置
            ctx.beginPath();
            ctx.arc(tortoisePos, -50, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // 移動線
            ctx.beginPath();
            ctx.moveTo(achillesPos, -50);
            ctx.lineTo(achillesPos + distance / 2, -50);
            ctx.stroke();
            
            achillesPos += distance / 2;
            tortoisePos += distance / 4;
            
            if (Math.abs(distance) < 0.01 / this.zoom) break;
        }
        
        // ヒルベルトのホテル - 無限の部屋
        const rooms = Math.min(30, 10 + this.depth * 2);
        for (let i = 0; i < rooms; i++) {
            const x = -150 + i * 10;
            const y = 50;
            const occupied = (i + Math.floor(this.time / 30)) % 2 === 0;
            
            ctx.fillStyle = occupied ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(x, y, 8, 8);
            
            // 部屋番号
            if (i < 10 || i % 5 === 0) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.font = `${6 / this.zoom}px Arial`;
                ctx.fillText(i + 1, x, y - 2);
            }
        }
        
        // 無限降下
        let size = 100;
        let py = 0;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        while (size > 0.5 / this.zoom && py < 300) {
            ctx.beginPath();
            ctx.rect(-size/2, py, size, size);
            ctx.stroke();
            py += size;
            size *= 0.618; // 黄金比で縮小
        }
    }
    
    drawRecursiveInfinity() {
        const ctx = this.ctx;
        
        // 再帰的な正方形
        const drawRecursiveSquare = (x, y, size, rotation, depth) => {
            if (depth === 0 || size < 2 / this.zoom) return;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            
            ctx.strokeStyle = `rgba(243, 156, 18, ${0.8 - depth * 0.1})`;
            ctx.strokeRect(-size/2, -size/2, size, size);
            
            // 四隅に小さい正方形を再帰的に配置
            const newSize = size * 0.5;
            const offset = size * 0.35;
            
            drawRecursiveSquare(-offset, -offset, newSize, rotation + 0.1, depth - 1);
            drawRecursiveSquare(offset, -offset, newSize, rotation - 0.1, depth - 1);
            drawRecursiveSquare(-offset, offset, newSize, rotation - 0.1, depth - 1);
            drawRecursiveSquare(offset, offset, newSize, rotation + 0.1, depth - 1);
            
            ctx.restore();
        };
        
        drawRecursiveSquare(0, 0, 200, this.time * 0.001, Math.min(10, 5 + this.depth));
        
        // ドロステ効果
        const drawDroste = (x, y, radius, depth) => {
            if (depth === 0 || radius < 5 / this.zoom) return;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 - depth * 0.05})`;
            ctx.stroke();
            
            // 円の内側に螺旋状に配置
            const count = 6;
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2 + this.time * 0.01;
                const newRadius = radius * 0.3;
                const newX = x + Math.cos(angle) * radius * 0.5;
                const newY = y + Math.sin(angle) * radius * 0.5;
                drawDroste(newX, newY, newRadius, depth - 1);
            }
        };
        
        drawDroste(0, 0, 150, Math.min(8, 4 + this.depth));
    }
    
    drawContinuousInfinity() {
        const ctx = this.ctx;
        
        // カントール集合
        const drawCantor = (x, y, length, depth) => {
            if (depth === 0 || length < 1 / this.zoom) {
                ctx.fillRect(x, y, length, 5);
                return;
            }
            
            drawCantor(x, y, length / 3, depth - 1);
            drawCantor(x + 2 * length / 3, y, length / 3, depth - 1);
        };
        
        ctx.fillStyle = 'rgba(26, 188, 156, 0.8)';
        let yPos = -100;
        for (let i = 0; i <= Math.min(10, 5 + this.depth); i++) {
            drawCantor(-200, yPos, 400, i);
            yPos += 20;
        }
        
        // 実数直線の密度
        const points = Math.min(1000, 100 + this.depth * 50);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        for (let i = 0; i < points; i++) {
            const x = (Math.random() - 0.5) * 400;
            const y = 100 + Math.sin(x * 0.05 + this.time * 0.01) * 50;
            const size = Math.random() * 2;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 連続関数
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2 / this.zoom;
        
        const resolution = Math.min(1000, 100 + this.depth * 100);
        for (let i = 0; i <= resolution; i++) {
            const x = (i / resolution - 0.5) * 400;
            const y = Math.sin(x * 0.05) * 50 * Math.cos(x * 0.02 + this.time * 0.01);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new InfinityVisualizer();
});