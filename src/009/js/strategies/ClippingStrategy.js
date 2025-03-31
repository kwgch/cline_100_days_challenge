// js/strategies/ClippingStrategy.js
class ClippingStrategy {
    constructor(startX, startY, width, height) {
        this.startX = startX;
        this.startY = startY;
        this.width = width;
        this.height = height;
    }

    apply(canvas) {
        const ctx = canvas.getContext('2d');
        if (this.width > 0 && this.height > 0) {
            const imageData = ctx.getImageData(
                this.startX,
                this.startY,
                this.width,
                this.height
            );
            canvas.width = this.width;
            canvas.height = this.height;
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.putImageData(imageData, 0, 0);
        }
    }
}

export default ClippingStrategy;
