// Touch and mouse input controller
export class InputController {
    constructor(canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;
        
        this.touches = new Map();
        this.mouseDown = false;
        this.lastMousePos = { x: 0, y: 0 };
        this.lastTouchDistance = 0;
        this.lastTouchCenter = { x: 0, y: 0 };
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Prevent default touch behaviors
        this.canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
        
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.onMouseUp());
        this.canvas.addEventListener('wheel', (e) => this.onWheel(e));
        
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
        
        // Prevent context menu on long press
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    onMouseDown(e) {
        this.mouseDown = true;
        this.lastMousePos = { x: e.clientX, y: e.clientY };
    }

    onMouseMove(e) {
        if (!this.mouseDown) return;
        
        const deltaX = e.clientX - this.lastMousePos.x;
        const deltaY = e.clientY - this.lastMousePos.y;
        
        if (e.shiftKey) {
            // Pan when shift is held
            this.camera.pan(deltaX, deltaY);
        } else {
            // Rotate normally
            this.camera.rotate(deltaX * 0.01, deltaY * 0.01);
        }
        
        this.lastMousePos = { x: e.clientX, y: e.clientY };
    }

    onMouseUp() {
        this.mouseDown = false;
    }

    onWheel(e) {
        e.preventDefault();
        this.camera.zoom(e.deltaY * 0.001);
    }

    onTouchStart(e) {
        e.preventDefault();
        
        // Update touch map
        for (const touch of e.touches) {
            this.touches.set(touch.identifier, {
                x: touch.clientX,
                y: touch.clientY
            });
        }
        
        if (e.touches.length === 2) {
            // Initialize pinch/pan for two fingers
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            
            this.lastTouchDistance = this.getDistance(touch1, touch2);
            this.lastTouchCenter = this.getCenter(touch1, touch2);
        }
    }

    onTouchMove(e) {
        e.preventDefault();
        
        if (e.touches.length === 1) {
            // Single touch - rotate
            const touch = e.touches[0];
            const lastTouch = this.touches.get(touch.identifier);
            
            if (lastTouch) {
                const deltaX = touch.clientX - lastTouch.x;
                const deltaY = touch.clientY - lastTouch.y;
                
                this.camera.rotate(deltaX * 0.01, deltaY * 0.01);
                
                this.touches.set(touch.identifier, {
                    x: touch.clientX,
                    y: touch.clientY
                });
            }
        } else if (e.touches.length === 2) {
            // Two touches - pinch zoom and pan
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            
            const distance = this.getDistance(touch1, touch2);
            const center = this.getCenter(touch1, touch2);
            
            // Pinch zoom
            const zoomDelta = (this.lastTouchDistance - distance) * 0.01;
            this.camera.zoom(zoomDelta);
            
            // Pan
            const panDeltaX = center.x - this.lastTouchCenter.x;
            const panDeltaY = center.y - this.lastTouchCenter.y;
            this.camera.pan(panDeltaX, panDeltaY);
            
            // Update for next frame
            this.lastTouchDistance = distance;
            this.lastTouchCenter = center;
            
            // Update touch positions
            this.touches.set(touch1.identifier, {
                x: touch1.clientX,
                y: touch1.clientY
            });
            this.touches.set(touch2.identifier, {
                x: touch2.clientX,
                y: touch2.clientY
            });
        } else if (e.touches.length === 3) {
            // Three touches - 4D rotation
            const touch = e.touches[0];
            const lastTouch = this.touches.get(touch.identifier);
            
            if (lastTouch) {
                const deltaX = touch.clientX - lastTouch.x;
                const deltaY = touch.clientY - lastTouch.y;
                
                // Rotate in 4D space
                this.camera.rotate4D(0, 3, deltaX * 0.01);
                this.camera.rotate4D(1, 3, deltaY * 0.01);
                
                this.touches.set(touch.identifier, {
                    x: touch.clientX,
                    y: touch.clientY
                });
            }
        }
    }

    onTouchEnd(e) {
        e.preventDefault();
        
        // Remove ended touches
        const remainingTouches = new Set();
        for (const touch of e.touches) {
            remainingTouches.add(touch.identifier);
        }
        
        for (const [id] of this.touches) {
            if (!remainingTouches.has(id)) {
                this.touches.delete(id);
            }
        }
    }

    getDistance(touch1, touch2) {
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getCenter(touch1, touch2) {
        return {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        };
    }

    update(deltaTime) {
        // Auto-rotate slowly when no input
        if (!this.mouseDown && this.touches.size === 0) {
            this.camera.rotate(deltaTime * 0.1, 0);
        }
    }
}