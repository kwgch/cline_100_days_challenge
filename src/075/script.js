class TimelessSpaceArtGenerator {
    constructor() {
        this.canvas = document.getElementById('artCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isAnimating = false;
        this.animationId = null;
        this.currentMode = 'fractal';
        
        // Parameters
        this.params = {
            dimensionDensity: 10,
            timeDistortion: 50,
            spaceFolding: 5,
            quantumFluctuation: 30,
            colorDimension: 'rgb'
        };
        
        // Time-space variables
        this.timePhase = 0;
        this.spaceCurvature = 0;
        this.dimensionCrossing = 0;
        this.entropy = 0;
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.generate();
    }
    
    setupCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        this.canvas.width = Math.min(800, rect.width - 40);
        this.canvas.height = Math.min(600, window.innerHeight - 300);
    }
    
    setupEventListeners() {
        // Sliders
        document.getElementById('dimensionDensity').addEventListener('input', (e) => {
            this.params.dimensionDensity = parseInt(e.target.value);
            document.getElementById('dimensionValue').textContent = e.target.value;
            if (!this.isAnimating) this.generate();
        });
        
        document.getElementById('timeDistortion').addEventListener('input', (e) => {
            this.params.timeDistortion = parseInt(e.target.value);
            document.getElementById('timeValue').textContent = e.target.value;
            if (!this.isAnimating) this.generate();
        });
        
        document.getElementById('spaceFolding').addEventListener('input', (e) => {
            this.params.spaceFolding = parseInt(e.target.value);
            document.getElementById('spaceValue').textContent = e.target.value;
            if (!this.isAnimating) this.generate();
        });
        
        document.getElementById('quantumFluctuation').addEventListener('input', (e) => {
            this.params.quantumFluctuation = parseInt(e.target.value);
            document.getElementById('quantumValue').textContent = e.target.value;
            if (!this.isAnimating) this.generate();
        });
        
        document.getElementById('colorDimension').addEventListener('change', (e) => {
            this.params.colorDimension = e.target.value;
            if (!this.isAnimating) this.generate();
        });
        
        // Buttons
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generate();
        });
        
        document.getElementById('animateBtn').addEventListener('click', () => {
            this.toggleAnimation();
        });
        
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.save();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.reset();
        });
        
        // Mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentMode = e.target.dataset.mode;
                this.generate();
            });
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.generate();
        });
    }
    
    generate() {
        this.updateTimeSpaceMetrics();
        
        switch (this.currentMode) {
            case 'fractal':
                this.generateFractalDimension();
                break;
            case 'wave':
                this.generateWaveFunction();
                break;
            case 'particle':
                this.generateParticleCloud();
                break;
            case 'string':
                this.generateStringTheory();
                break;
            case 'void':
                this.generateVoidCrystal();
                break;
        }
        
        this.updateInfoPanel();
    }
    
    generateFractalDimension() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const imageData = this.ctx.createImageData(width, height);
        const data = imageData.data;
        
        const maxIterations = 100 + this.params.dimensionDensity * 10;
        const zoom = 3 / this.params.spaceFolding;
        const moveX = -0.5 + Math.sin(this.timePhase) * 0.1;
        const moveY = 0 + Math.cos(this.timePhase) * 0.1;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Transform coordinates through time-space distortion
                let px = (x - width / 2) / (width / zoom) + moveX;
                let py = (y - height / 2) / (height / zoom) + moveY;
                
                // Apply space folding
                const fold = this.params.spaceFolding / 10;
                px = px + Math.sin(py * fold) * 0.1;
                py = py + Math.cos(px * fold) * 0.1;
                
                // Julia set with time distortion
                let zx = px;
                let zy = py;
                const cx = -0.7 + Math.sin(this.timePhase * 0.5) * 0.1;
                const cy = 0.27 + Math.cos(this.timePhase * 0.7) * 0.05;
                
                let i = 0;
                while (i < maxIterations && zx * zx + zy * zy < 4) {
                    const tmp = zx * zx - zy * zy + cx;
                    zy = 2 * zx * zy + cy;
                    zx = tmp;
                    i++;
                }
                
                // Apply quantum fluctuation
                i += Math.random() * this.params.quantumFluctuation / 10;
                
                const color = this.getColor(i / maxIterations, x / width, y / height);
                const idx = (y * width + x) * 4;
                data[idx] = color.r;
                data[idx + 1] = color.g;
                data[idx + 2] = color.b;
                data[idx + 3] = 255;
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    generateWaveFunction() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const waves = this.params.dimensionDensity;
        const amplitude = 50;
        
        for (let w = 0; w < waves; w++) {
            const frequency = (w + 1) * 0.01 * this.params.timeDistortion / 50;
            const phase = this.timePhase + w * Math.PI / waves;
            const color = this.getColor(w / waves, 0.5, 0.5);
            
            this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            
            for (let x = 0; x < this.canvas.width; x++) {
                const spaceFold = Math.sin(x * 0.001 * this.params.spaceFolding);
                const y = this.canvas.height / 2 + 
                         Math.sin(x * frequency + phase) * amplitude * (1 + spaceFold) +
                         Math.sin(x * frequency * 2 + phase * 1.5) * amplitude * 0.5 +
                         (Math.random() - 0.5) * this.params.quantumFluctuation;
                
                if (x === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            
            this.ctx.stroke();
        }
        
        // Add interference patterns
        this.ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < 3; i++) {
            const centerX = this.canvas.width * (0.25 + i * 0.25);
            const centerY = this.canvas.height / 2;
            
            for (let r = 10; r < 200; r += 10) {
                const alpha = 0.1 * (1 - r / 200);
                const color = this.getColor(r / 200, i / 3, 0.5);
                this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, r + Math.sin(this.timePhase + r * 0.1) * 10, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        }
        this.ctx.globalCompositeOperation = 'source-over';
    }
    
    generateParticleCloud() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const particles = this.params.dimensionDensity * 50;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        for (let i = 0; i < particles; i++) {
            const angle = (i / particles) * Math.PI * 2 * this.params.spaceFolding;
            const radius = Math.sqrt(i / particles) * Math.min(this.canvas.width, this.canvas.height) / 2;
            
            // Apply time distortion to position
            const timeOffset = this.timePhase + i * 0.1;
            const x = centerX + Math.cos(angle + timeOffset) * radius;
            const y = centerY + Math.sin(angle + timeOffset * 1.3) * radius;
            
            // Quantum fluctuation
            const jitterX = (Math.random() - 0.5) * this.params.quantumFluctuation;
            const jitterY = (Math.random() - 0.5) * this.params.quantumFluctuation;
            
            const size = Math.random() * 3 + 1;
            const color = this.getColor(i / particles, radius / 300, angle / (Math.PI * 2));
            
            this.ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`;
            this.ctx.beginPath();
            this.ctx.arc(x + jitterX, y + jitterY, size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw connections
            if (i > 0 && Math.random() < 0.1) {
                const prevIndex = Math.floor(Math.random() * i);
                const prevAngle = (prevIndex / particles) * Math.PI * 2 * this.params.spaceFolding;
                const prevRadius = Math.sqrt(prevIndex / particles) * Math.min(this.canvas.width, this.canvas.height) / 2;
                const prevX = centerX + Math.cos(prevAngle + timeOffset) * prevRadius;
                const prevY = centerY + Math.sin(prevAngle + timeOffset * 1.3) * prevRadius;
                
                this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`;
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(prevX, prevY);
                this.ctx.stroke();
            }
        }
    }
    
    generateStringTheory() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const strings = this.params.dimensionDensity * 2;
        
        for (let s = 0; s < strings; s++) {
            const points = [];
            const segments = 50;
            
            // Generate string path
            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const baseX = t * this.canvas.width;
                const baseY = this.canvas.height / 2;
                
                // Multi-dimensional vibration
                const vibration1 = Math.sin(t * Math.PI * 2 * this.params.spaceFolding + this.timePhase) * 50;
                const vibration2 = Math.cos(t * Math.PI * 4 + this.timePhase * 1.5) * 30;
                const vibration3 = Math.sin(t * Math.PI * 8 + this.timePhase * 2) * 20;
                
                // Time distortion effect
                const timeWarp = Math.sin(this.timePhase + s * 0.5) * this.params.timeDistortion / 100;
                
                const x = baseX + (Math.random() - 0.5) * this.params.quantumFluctuation;
                const y = baseY + vibration1 + vibration2 + vibration3 + s * 10 - strings * 5;
                
                points.push({ x, y, t });
            }
            
            // Draw string with gradient
            for (let i = 1; i < points.length; i++) {
                const color = this.getColor(s / strings, i / points.length, 0.5);
                const alpha = 0.3 + Math.sin(this.timePhase + i * 0.1) * 0.2;
                
                this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
                this.ctx.lineWidth = 2 + Math.sin(i * 0.2 + this.timePhase) * 1;
                
                this.ctx.beginPath();
                this.ctx.moveTo(points[i - 1].x, points[i - 1].y);
                this.ctx.lineTo(points[i].x, points[i].y);
                this.ctx.stroke();
            }
            
            // Add quantum nodes
            for (let i = 0; i < points.length; i += 5) {
                const point = points[i];
                const color = this.getColor(s / strings, i / points.length, 1);
                
                this.ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }
    
    generateVoidCrystal() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxRadius = Math.min(this.canvas.width, this.canvas.height) / 2 - 50;
        
        // Create crystalline structure
        const layers = this.params.dimensionDensity;
        
        for (let layer = 0; layer < layers; layer++) {
            const vertices = 6 + Math.floor(layer / 2);
            const radius = (layer / layers) * maxRadius;
            const rotation = this.timePhase + layer * 0.1;
            
            const points = [];
            for (let v = 0; v < vertices; v++) {
                const angle = (v / vertices) * Math.PI * 2 + rotation;
                const r = radius + Math.sin(angle * this.params.spaceFolding) * 20;
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r;
                points.push({ x, y });
            }
            
            // Draw crystal faces
            this.ctx.globalCompositeOperation = 'screen';
            
            for (let i = 0; i < points.length; i++) {
                const p1 = points[i];
                const p2 = points[(i + 1) % points.length];
                const color = this.getColor(layer / layers, i / points.length, 0.5);
                
                // Create gradient from center
                const gradient = this.ctx.createLinearGradient(centerX, centerY, p1.x, p1.y);
                gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
                gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`);
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.moveTo(centerX, centerY);
                this.ctx.lineTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Add edge glow
                this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();
            }
            
            // Add quantum fluctuation points
            if (this.params.quantumFluctuation > 0) {
                for (let i = 0; i < vertices * 2; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const r = radius + (Math.random() - 0.5) * this.params.quantumFluctuation;
                    const x = centerX + Math.cos(angle) * r;
                    const y = centerY + Math.sin(angle) * r;
                    
                    const color = this.getColor(Math.random(), Math.random(), Math.random());
                    this.ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`;
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 1, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
        
        this.ctx.globalCompositeOperation = 'source-over';
    }
    
    getColor(t1, t2, t3) {
        switch (this.params.colorDimension) {
            case 'rgb':
                return {
                    r: Math.floor(t1 * 255),
                    g: Math.floor(t2 * 255),
                    b: Math.floor(t3 * 255)
                };
                
            case 'hsv':
                const h = t1 * 360;
                const s = 0.7 + t2 * 0.3;
                const v = 0.5 + t3 * 0.5;
                return this.hsvToRgb(h, s, v);
                
            case 'quantum':
                // Quantum superposition of colors
                const phase = this.timePhase * 2;
                return {
                    r: Math.floor((Math.sin(t1 * Math.PI * 2 + phase) + 1) * 127),
                    g: Math.floor((Math.sin(t2 * Math.PI * 2 + phase * 1.5) + 1) * 127),
                    b: Math.floor((Math.sin(t3 * Math.PI * 2 + phase * 2) + 1) * 127)
                };
                
            case 'hyperdimensional':
                // Complex color mapping through multiple dimensions
                const dim1 = Math.sin(t1 * Math.PI * 4 + this.timePhase);
                const dim2 = Math.cos(t2 * Math.PI * 6 + this.timePhase * 1.3);
                const dim3 = Math.sin(t3 * Math.PI * 8 + this.timePhase * 1.7);
                return {
                    r: Math.floor(Math.abs(dim1 * dim2) * 255),
                    g: Math.floor(Math.abs(dim2 * dim3) * 255),
                    b: Math.floor(Math.abs(dim3 * dim1) * 255)
                };
                
            default:
                return { r: 255, g: 255, b: 255 };
        }
    }
    
    hsvToRgb(h, s, v) {
        const c = v * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = v - c;
        
        let r, g, b;
        if (h < 60) {
            r = c; g = x; b = 0;
        } else if (h < 120) {
            r = x; g = c; b = 0;
        } else if (h < 180) {
            r = 0; g = c; b = x;
        } else if (h < 240) {
            r = 0; g = x; b = c;
        } else if (h < 300) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }
        
        return {
            r: Math.floor((r + m) * 255),
            g: Math.floor((g + m) * 255),
            b: Math.floor((b + m) * 255)
        };
    }
    
    updateTimeSpaceMetrics() {
        // Update time phase
        this.timePhase += this.params.timeDistortion * 0.001;
        
        // Calculate space curvature
        this.spaceCurvature = Math.sin(this.timePhase) * this.params.spaceFolding / 10;
        
        // Dimension crossing events
        if (Math.random() < 0.1) {
            this.dimensionCrossing = Math.floor(Math.random() * this.params.dimensionDensity);
        }
        
        // Calculate entropy
        this.entropy = (this.params.quantumFluctuation / 100) * 
                      (1 + Math.sin(this.timePhase * 0.3)) * 0.5;
    }
    
    updateInfoPanel() {
        document.getElementById('timePhase').textContent = this.timePhase.toFixed(2);
        document.getElementById('spaceCurvature').textContent = this.spaceCurvature.toFixed(2);
        document.getElementById('dimensionCrossing').textContent = this.dimensionCrossing;
        document.getElementById('entropy').textContent = this.entropy.toFixed(2);
    }
    
    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        const btn = document.getElementById('animateBtn');
        
        if (this.isAnimating) {
            btn.textContent = '停止 | Stop';
            this.animate();
        } else {
            btn.textContent = '時空変動 | Animate';
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
        }
    }
    
    animate() {
        if (!this.isAnimating) return;
        
        this.generate();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    save() {
        const link = document.createElement('a');
        link.download = `timeless_space_art_${Date.now()}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
    }
    
    reset() {
        // Reset parameters
        this.params = {
            dimensionDensity: 10,
            timeDistortion: 50,
            spaceFolding: 5,
            quantumFluctuation: 30,
            colorDimension: 'rgb'
        };
        
        // Reset UI
        document.getElementById('dimensionDensity').value = 10;
        document.getElementById('dimensionValue').textContent = '10';
        document.getElementById('timeDistortion').value = 50;
        document.getElementById('timeValue').textContent = '50';
        document.getElementById('spaceFolding').value = 5;
        document.getElementById('spaceValue').textContent = '5';
        document.getElementById('quantumFluctuation').value = 30;
        document.getElementById('quantumValue').textContent = '30';
        document.getElementById('colorDimension').value = 'rgb';
        
        // Reset time-space variables
        this.timePhase = 0;
        this.spaceCurvature = 0;
        this.dimensionCrossing = 0;
        this.entropy = 0;
        
        // Stop animation if running
        if (this.isAnimating) {
            this.toggleAnimation();
        }
        
        this.generate();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TimelessSpaceArtGenerator();
});