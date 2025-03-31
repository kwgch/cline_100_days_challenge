// js/strategies/ResizeStrategy.js
class ResizeStrategy {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    apply(canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.canvas.offsetWidth, canvas.canvas.offsetHeight);
        console.log('imageData:', imageData);
        canvas.canvas.width = parseInt(this.width);
        canvas.canvas.height = parseInt(this.height);
        ctx.putImageData(imageData, 0, 0);
    }
}

export default ResizeStrategy;
