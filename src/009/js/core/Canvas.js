// js/core/Canvas.js
class Canvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
    }

    getContext() {
        return this.ctx;
    }

    getImageData() {
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    putImageData(imageData) {
        this.ctx.putImageData(imageData, 0, 0);
    }

    drawImage(img, width, height) {
        const fixedWidth = 500; // Set the fixed width here
        const aspectRatio = img.width / img.height;
        this.canvas.width = width || fixedWidth;
        this.canvas.height = height || (fixedWidth / aspectRatio);
        this.ctx.drawImage(img, 0, 0, width || fixedWidth, height || (fixedWidth / aspectRatio));
    }
}

export default Canvas;
