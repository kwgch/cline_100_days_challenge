// 4D Fractal Projection WebGL Application
import { FractalRenderer } from './fractalRenderer.js';
import { InputController } from './inputController.js';
import { Camera } from './camera.js';

class App {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.gl = this.canvas.getContext('webgl2', {
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true
        });

        if (!this.gl) {
            throw new Error('WebGL2 not supported');
        }

        this.camera = new Camera();
        this.renderer = new FractalRenderer(this.gl);
        this.inputController = new InputController(this.canvas, this.camera);
        
        this.isPlaying = true;
        this.mode = 0;
        this.time = 0;
        this.lastTime = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.resize();
        this.animate();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());

        // Control buttons
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.camera.reset();
        });

        document.getElementById('pause-btn').addEventListener('click', () => {
            this.isPlaying = !this.isPlaying;
            document.getElementById('pause-btn').textContent = this.isPlaying ? '❚❚' : '▶';
        });

        document.getElementById('mode-btn').addEventListener('click', () => {
            this.mode = (this.mode + 1) % 3;
            this.renderer.setMode(this.mode);
        });
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.camera.setAspect(width / height);
    }

    animate(currentTime = 0) {
        requestAnimationFrame((time) => this.animate(time));

        const deltaTime = (currentTime - this.lastTime) * 0.001;
        this.lastTime = currentTime;

        if (this.isPlaying) {
            this.time += deltaTime * 0.5;
        }

        this.inputController.update(deltaTime);
        this.camera.update(deltaTime);
        
        this.renderer.render(
            this.camera.getViewMatrix(),
            this.camera.getProjectionMatrix(),
            this.time,
            this.camera.getRotation4D()
        );
    }
}

// Initialize app when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    try {
        new App();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        document.body.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">WebGL2 is required to run this application</div>';
    }
});