// js/strategies/TransparencyStrategy.js
class TransparencyStrategy {
    constructor(targetColor, tolerance) {
        this.targetColor = targetColor;
        this.tolerance = tolerance;
    }

    apply(canvas) {
        const ctx = canvas.getContext();
        const imageData = ctx.getImageData(0, 0, canvas.canvas.width, canvas.canvas.height);
        const data = imageData.data;

        const targetRed = parseInt(this.targetColor.substring(1, 3), 16);
        const targetGreen = parseInt(this.targetColor.substring(3, 5), 16);
        const targetBlue = parseInt(this.targetColor.substring(5, 7), 16);

        for (let i = 0; i < data.length; i += 4) {
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];

            if (
                Math.abs(red - targetRed) <= this.tolerance &&
                Math.abs(green - targetGreen) <= this.tolerance &&
                Math.abs(blue - targetBlue) <= this.tolerance
            ) {
                data[i + 3] = 0; // Set alpha to 0 (transparent)
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }
}

export default TransparencyStrategy;
