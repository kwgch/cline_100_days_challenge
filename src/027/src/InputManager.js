export class InputManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.tilt = { x: 0, z: 0 };
        this.sensitivity = 0.01;
        this.maxTilt = Math.PI / 6;

        this.initTouch();
        this.initMouse();
    }

    initTouch() {
        let startX, startY;

        this.canvas.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, false);

        this.canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            const x = e.touches[0].clientX;
            const y = e.touches[0].clientY;

            let deltaX = (x - startX) * this.sensitivity;
            let deltaY = (y - startY) * this.sensitivity;

            this.tilt.x = Math.max(-this.maxTilt, Math.min(this.maxTilt, this.tilt.x + deltaY));
            this.tilt.z = Math.max(-this.maxTilt, Math.min(this.tilt.z + deltaX));

            startX = x;
            startY = y;
        }, false);

        this.canvas.addEventListener("touchend", () => {
            //this.resetTilt();
        }, false);
    }

    initMouse() {
        let startX, startY, isDragging = false;

        this.canvas.addEventListener("mousedown", (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
        }, false);

        this.canvas.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const x = e.clientX;
            const y = e.clientY;

            let deltaX = (x - startX) * this.sensitivity;
            let deltaY = (y - startY) * this.sensitivity;

            this.tilt.x = Math.max(-this.maxTilt, Math.min(this.tilt.x + deltaY));
            this.tilt.z = Math.max(-this.maxTilt, Math.min(this.tilt.z + deltaX));

            startX = x;
            startY = y;
        }, false);

        this.canvas.addEventListener("mouseup", () => {
            isDragging = false;
            //this.resetTilt();
        }, false);

        this.canvas.addEventListener("mouseleave", () => {
            isDragging = false;
            //this.resetTilt();
        }, false);
    }

    getTargetTilt() {
        return this.tilt;
    }

    resetTilt() {
        this.tilt.x = 0;
        this.tilt.z = 0;
    }
}
