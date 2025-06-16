class HyperRealistic3D {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.zoom = 1;
        this.parallaxStrength = 0.5;
        this.depthOfField = 0.3;
        this.lightingIntensity = 0.7;
        this.viewMode = 'normal';
        this.time = 0;
        
        this.objects3D = [];
        this.particles = [];
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupMouseTracking();
        this.setup3DObjects();
        this.setupParticleField();
        this.setupLighting();
        
        // アニメーション開始
        this.animate();
    }
    
    // メインキャンバスのセットアップ
    setupCanvas() {
        this.canvas = document.getElementById('mainCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.particleCanvas = document.getElementById('particleField');
        this.particleCtx = this.particleCanvas.getContext('2d');
        
        const resize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.particleCanvas.width = window.innerWidth;
            this.particleCanvas.height = window.innerHeight;
        };
        
        resize();
        window.addEventListener('resize', resize);
    }
    
    // マウストラッキング
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
            this.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
            
            // 視差効果の更新
            this.updateParallax();
        });
        
        document.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.zoom += e.deltaY * -0.001;
            this.zoom = Math.max(0.5, Math.min(2, this.zoom));
        }, { passive: false });
        
        // タッチ対応
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.targetX = (touch.clientX / window.innerWidth - 0.5) * 2;
            this.targetY = (touch.clientY / window.innerHeight - 0.5) * 2;
        });
    }
    
    
    // 3Dオブジェクトの設定
    setup3DObjects() {
        // フローティングキューブ
        const cube = document.getElementById('cube1');
        this.objects3D.push({
            element: cube,
            x: -200,
            y: 0,
            z: 100,
            rotationX: 0,
            rotationY: 0,
            rotationSpeed: { x: 0.5, y: 0.3 }
        });
        
        // フローティングスフィア
        const sphere = document.getElementById('sphere1');
        this.objects3D.push({
            element: sphere,
            x: 200,
            y: -100,
            z: 50,
            rotationX: 0,
            rotationY: 0,
            rotationSpeed: { x: 0.3, y: 0.7 }
        });
        
        // フローティングピラミッド
        const pyramid = document.getElementById('pyramid1');
        this.objects3D.push({
            element: pyramid,
            x: 0,
            y: 150,
            z: 150,
            rotationX: 0,
            rotationY: 0,
            rotationSpeed: { x: 0.4, y: 0.6 }
        });
    }
    
    // パーティクルフィールド
    setupParticleField() {
        // 3D空間にパーティクルを配置
        for (let i = 0; i < 200; i++) {
            this.particles.push({
                x: (Math.random() - 0.5) * 1000,
                y: (Math.random() - 0.5) * 1000,
                z: Math.random() * 500 - 100,
                size: Math.random() * 3 + 1,
                brightness: Math.random()
            });
        }
    }
    
    // ライティングシステム
    setupLighting() {
        this.mainLight = document.getElementById('mainLight');
        this.volumetricLight = document.querySelector('.volumetric-light');
        this.shadowCaster = document.querySelector('.shadow-caster');
    }
    
    
    // 視差効果の更新
    updateParallax() {
        const layers = document.querySelectorAll('.depth-layer');
        layers.forEach((layer, index) => {
            const depth = (index + 1) * 0.3;
            const offsetX = this.targetX * depth * this.parallaxStrength * 50;
            const offsetY = this.targetY * depth * this.parallaxStrength * 50;
            
            layer.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${1 + depth * 0.1})`;
        });
    }
    
    // 被写界深度の更新
    updateDepthOfField() {
        const objects = document.querySelectorAll('.floating-cube, .floating-sphere, .floating-pyramid');
        objects.forEach((obj, index) => {
            const blur = Math.abs(index - 1) * this.depthOfField * 5;
            obj.style.filter = `blur(${blur}px)`;
        });
    }
    
    // ライティングの更新
    updateLighting() {
        this.mainLight.style.opacity = this.lightingIntensity;
        this.volumetricLight.style.opacity = this.lightingIntensity * 0.5;
        
        // 影の濃さ
        document.documentElement.style.setProperty('--shadow-opacity', this.lightingIntensity);
    }
    
    // ビューモードの更新
    updateViewMode() {
        const container = document.querySelector('.scene-3d');
        container.className = `scene-3d ${this.viewMode}-mode`;
        
        if (this.viewMode === 'anaglyph') {
            this.renderAnaglyph();
        } else if (this.viewMode === 'vr') {
            this.enterVRMode();
        }
    }
    
    // アナグリフ3D（赤青メガネ）
    renderAnaglyph() {
        const objects = document.querySelectorAll('.floating-cube, .floating-sphere, .floating-pyramid');
        objects.forEach(obj => {
            obj.style.position = 'relative';
            
            // 赤と青のオフセット
            const redOffset = document.createElement('div');
            redOffset.className = 'anaglyph-red';
            redOffset.style.cssText = `
                position: absolute;
                top: 0;
                left: -5px;
                width: 100%;
                height: 100%;
                mix-blend-mode: screen;
                filter: hue-rotate(-60deg);
                opacity: 0.5;
            `;
            
            const blueOffset = document.createElement('div');
            blueOffset.className = 'anaglyph-blue';
            blueOffset.style.cssText = `
                position: absolute;
                top: 0;
                left: 5px;
                width: 100%;
                height: 100%;
                mix-blend-mode: screen;
                filter: hue-rotate(60deg);
                opacity: 0.5;
            `;
        });
    }
    
    // VRモード
    enterVRMode() {
        if ('xr' in navigator) {
            console.log('WebXR is supported');
            // WebXR APIの実装（簡略化）
        }
    }
    
    // 3Dオブジェクトの描画
    draw3DObjects() {
        // スムーズな追従
        this.mouseX += (this.targetX - this.mouseX) * 0.1;
        this.mouseY += (this.targetY - this.mouseY) * 0.1;
        
        this.objects3D.forEach(obj => {
            // 回転の更新
            obj.rotationX += obj.rotationSpeed.x;
            obj.rotationY += obj.rotationSpeed.y;
            
            // 視差による位置調整
            const parallaxX = this.mouseX * obj.z * this.parallaxStrength;
            const parallaxY = this.mouseY * obj.z * this.parallaxStrength;
            
            // 3D変換
            const perspective = 1000 / (1000 - obj.z * this.zoom);
            const translateX = (obj.x + parallaxX) * perspective;
            const translateY = (obj.y + parallaxY) * perspective;
            const scale = perspective;
            
            obj.element.style.transform = `
                translate(${translateX}px, ${translateY}px)
                scale(${scale})
                rotateX(${obj.rotationX}deg)
                rotateY(${obj.rotationY}deg)
                translateZ(${obj.z}px)
            `;
            
            // 影の投影
            const shadowX = translateX + 50;
            const shadowY = translateY + 50;
            const shadowBlur = 20 + obj.z * 0.1;
            const shadowOpacity = 0.3 * this.lightingIntensity;
            
            obj.element.style.boxShadow = `
                ${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})
            `;
        });
    }
    
    // パーティクルの描画
    drawParticles() {
        this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
        
        const centerX = this.particleCanvas.width / 2;
        const centerY = this.particleCanvas.height / 2;
        
        // パーティクルをZソート
        const sortedParticles = [...this.particles].sort((a, b) => a.z - b.z);
        
        sortedParticles.forEach(particle => {
            // 3D投影
            const perspective = 1000 / (1000 - particle.z * this.zoom);
            const x = centerX + (particle.x + this.mouseX * particle.z * this.parallaxStrength) * perspective;
            const y = centerY + (particle.y + this.mouseY * particle.z * this.parallaxStrength) * perspective;
            const size = particle.size * perspective;
            
            // 深度による明度調整
            const brightness = particle.brightness * (1 - particle.z / 500);
            
            // グロー効果
            const gradient = this.particleCtx.createRadialGradient(x, y, 0, x, y, size * 3);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${brightness})`);
            gradient.addColorStop(0.5, `rgba(200, 220, 255, ${brightness * 0.5})`);
            gradient.addColorStop(1, `rgba(100, 150, 255, 0)`);
            
            this.particleCtx.fillStyle = gradient;
            this.particleCtx.beginPath();
            this.particleCtx.arc(x, y, size * 3, 0, Math.PI * 2);
            this.particleCtx.fill();
            
            // コア
            this.particleCtx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            this.particleCtx.beginPath();
            this.particleCtx.arc(x, y, size, 0, Math.PI * 2);
            this.particleCtx.fill();
            
            // 動き
            particle.x += Math.sin(this.time * 0.001 + particle.y * 0.01) * 0.5;
            particle.y += Math.cos(this.time * 0.001 + particle.x * 0.01) * 0.3;
            
            // 境界処理
            if (Math.abs(particle.x) > 500) particle.x = -particle.x;
            if (Math.abs(particle.y) > 500) particle.y = -particle.y;
        });
    }
    
    // リアルタイムシャドウ
    drawRealtimeShadows() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const lightX = this.canvas.width / 2 + this.mouseX * 200;
        const lightY = this.canvas.height / 2 + this.mouseY * 200;
        
        // ソフトシャドウのレンダリング
        this.objects3D.forEach(obj => {
            const objX = this.canvas.width / 2 + obj.x;
            const objY = this.canvas.height / 2 + obj.y;
            
            // 影の方向と長さ
            const shadowDirX = objX - lightX;
            const shadowDirY = objY - lightY;
            const shadowLength = Math.sqrt(shadowDirX * shadowDirX + shadowDirY * shadowDirY);
            
            // グラデーション影
            const gradient = this.ctx.createLinearGradient(
                objX, objY,
                objX + shadowDirX * 0.5, objY + shadowDirY * 0.5
            );
            gradient.addColorStop(0, `rgba(0, 0, 0, ${0.3 * this.lightingIntensity})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.ellipse(
                objX + shadowDirX * 0.3,
                objY + shadowDirY * 0.3,
                50 + obj.z * 0.1,
                30 + obj.z * 0.05,
                Math.atan2(shadowDirY, shadowDirX),
                0, Math.PI * 2
            );
            this.ctx.fill();
        });
    }
    
    // メインライトの更新
    updateMainLight() {
        const light = this.mainLight;
        const x = window.innerWidth / 2 + this.mouseX * 200;
        const y = window.innerHeight / 2 + this.mouseY * 200;
        
        light.style.left = x + 'px';
        light.style.top = y + 'px';
        
        // ボリュメトリックライト
        this.volumetricLight.style.background = `
            radial-gradient(
                circle at ${x}px ${y}px,
                rgba(255, 255, 200, ${0.3 * this.lightingIntensity}),
                transparent 50%
            )
        `;
    }
    
    // 深度メーターの更新
    updateDepthMeter() {
        const indicator = document.querySelector('.depth-indicator');
        const depth = Math.abs(this.mouseY) * 100;
        indicator.style.height = depth + '%';
        indicator.style.background = `linear-gradient(to top, 
            hsl(${200 - depth}, 100%, 50%),
            hsl(${200 - depth * 2}, 100%, 70%)
        )`;
    }
    
    // アニメーションループ
    animate() {
        this.time++;
        
        // 3Dオブジェクトの更新
        this.draw3DObjects();
        
        // パーティクルの描画
        this.drawParticles();
        
        // リアルタイムシャドウ
        this.drawRealtimeShadows();
        
        // ライトの更新
        this.updateMainLight();
        
        // UI更新
        this.updateDepthMeter();
        
        requestAnimationFrame(() => this.animate());
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new HyperRealistic3D();
});