export class InputManager {
    constructor(canvas, scene) {
        this.canvas = canvas;
        this.scene = scene;
        this.tilt = { x: 0, z: 0 };
        this.sensitivity = 0.05; // 感度を少し上げる
        this.maxTilt = 1; // tilt値は-1～1の範囲に制限

        this.initMouse();
        if (this.isTouchDevice()) {
            this.initTouch();
        }
    }

    isTouchDevice() {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    }

    initTouch() {
        console.log("Touch input initialized");

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

            // 累積加算をやめて、ドラッグ量に応じて直接設定しクランプ
            this.tilt.x = Math.max(-this.maxTilt, Math.min(deltaY, this.maxTilt));
            this.tilt.z = Math.max(-this.maxTilt, Math.min(deltaX, this.maxTilt));

            startX = x;
            startY = y;
        }, false);

        this.canvas.addEventListener("touchend", () => {
            // タッチ終了時にtiltを0に戻す
            this.resetTilt();
        }, false);
    }

    initMouse() {
        console.log("Mouse input initialized");

        let startX, startY, isDragging = false;

        this.scene.onPointerObservable.add((evt) => {
            if (evt.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                startX = evt.event.clientX;
                startY = evt.event.clientY;
                isDragging = true;
            }
            if (evt.type === BABYLON.PointerEventTypes.POINTERUP) {
                isDragging = false;
                this.resetTilt();
            }
            if (evt.type === BABYLON.PointerEventTypes.POINTERMOVE && isDragging) {
                evt.event.preventDefault();
                const x = evt.event.clientX;
                const y = evt.event.clientY;

                let deltaX = (x - startX) * this.sensitivity;
                let deltaY = (y - startY) * this.sensitivity;

                // 累積加算をやめて、ドラッグ量に応じて直接設定しクランプ
                this.tilt.x = Math.max(-this.maxTilt, Math.min(deltaY, this.maxTilt));
                this.tilt.z = Math.max(-this.maxTilt, Math.min(deltaX, this.maxTilt));

                startX = x;
                startY = y;
            }
        });
    }

    getTargetTilt() {
        return this.tilt;
    }

    resetTilt() {
        this.tilt.x = 0;
        this.tilt.z = 0;
    }
}
