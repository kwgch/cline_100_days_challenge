export class InputManager {
    constructor(canvas, scene) {
        this.canvas = canvas;
        this.scene = scene;
        this.tilt = { x: 0, z: 0 };
        this.sensitivity = 0.01;
        this.maxTilt = Math.PI / 6;
        // this.maxTilt = Math.PI;

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
            // console.log("Touch start", e.touches[0].clientX, e.touches[0].clientY);
        }, false);

        this.canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            const x = e.touches[0].clientX;
            const y = e.touches[0].clientY;

            let deltaX = (x - startX) * this.sensitivity;
            let deltaY = (y - startY) * this.sensitivity;

            this.tilt.x = Math.max(-this.maxTilt, Math.min(this.tilt.x + deltaY));
            this.tilt.z = Math.max(-this.maxTilt, Math.min(this.tilt.z + deltaX));

            startX = x;
            startY = y;
        }, false);

        this.canvas.addEventListener("touchend", () => {
            //this.resetTilt();
            // console.log("Touch end");
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
                // console.log("Pointer down", evt.event.clientX, evt.event.clientY);
            }
            if (evt.type === BABYLON.PointerEventTypes.POINTERUP) {
                isDragging = false;
                //this.resetTilt();
                // console.log("Pointer up", evt.event.clientX, evt.event.clientY);
            }
            if (evt.type === BABYLON.PointerEventTypes.POINTERMOVE && isDragging) {
                evt.event.preventDefault();
                const x = evt.event.clientX;
                const y = evt.event.clientY;

                let deltaX = (x - startX) * this.sensitivity;
                let deltaY = (y - startY) * this.sensitivity;

                this.tilt.x = Math.max(-this.maxTilt, Math.min(this.tilt.x + deltaY));
                this.tilt.z = Math.max(-this.maxTilt, Math.min(this.tilt.z + deltaX));

                startX = x;
                startY = y;
            }
            if (evt.type === BABYLON.PointerEventTypes.POINTERWHEEL) {
                evt.event.preventDefault();
                const delta = evt.event.deltaY * this.sensitivity;
                this.tilt.x = Math.max(-this.maxTilt, Math.min(this.tilt.x + delta));
            }
            if (evt.type === BABYLON.PointerEventTypes.POINTERPICK) {
                // Handle pointer pick event if needed
                console.log("Pointer pick", evt.pickInfo.pickedPoint);
            }
            if (evt.type === BABYLON.PointerEventTypes.POINTERTAP) {
                // Handle pointer tap event if needed
                console.log("Pointer tap", evt.event.clientX, evt.event.clientY);
            }
            if (evt.type === BABYLON.PointerEventTypes.POINTERDOUBLETAP) {
                // Handle pointer double tap event if needed
                console.log("Pointer double tap", evt.event.clientX, evt.event.clientY);
            }
        })

        // // document.getElementById("renderCanvas").addEventListener("mousedown", (e) => {
        // this.canvas.addEventListener("mousedown", (e) => {
        //     // e.preventDefault();
        //     // e.stopPropagation();

        //     isDragging = true;
        //     startX = e.clientX;
        //     startY = e.clientY;
        //     console.log("Mouse down", e.clientX, e.clientY);
        // }, false);

        // this.canvas.addEventListener("mousemove", (e) => {
        //     if (!isDragging) return;
        //     e.preventDefault();
        //     // e.stopPropagation();

        //     const x = e.clientX;
        //     const y = e.clientY;

        //     let deltaX = (x - startX) * this.sensitivity;
        //     let deltaY = (y - startY) * this.sensitivity;

        //     this.tilt.x = Math.max(-this.maxTilt, Math.min(this.tilt.x + deltaY));
        //     this.tilt.z = Math.max(-this.maxTilt, Math.min(this.tilt.z + deltaX));

        //     startX = x;
        //     startY = y;
        //     console.log("Mouse move", e.clientX, e.clientY);
        // }, false);

        // this.canvas.addEventListener("mouseup", () => {
        //     isDragging = false;
        //     //this.resetTilt();
        // }, false);

        // this.canvas.addEventListener("mouseleave", () => {
        //     isDragging = false;
        //     //this.resetTilt();
        // }, false);
    }

    getTargetTilt() {
        return this.tilt;
    }

    resetTilt() {
        this.tilt.x = 0;
        this.tilt.z = 0;
    }
}
