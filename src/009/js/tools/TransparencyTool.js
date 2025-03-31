// js/tools/TransparencyTool.js
import Tool from './Tool.js';
import TransparencyCommand from '../commands/TransparencyCommand.js';

class TransparencyTool extends Tool {
    constructor() {
        super();
        this.color = null;
        this.tolerance = 0;
    }

    setColor(color) {
        this.color = color;
    }

    setTolerance(tolerance) {
        this.tolerance = tolerance;
    }

    applyTransparency(canvas) {
        if (!this.color) {
            console.error('No color selected for transparency.');
            return;
        }

        const command = new TransparencyCommand(this.color, this.tolerance);
        command.execute(canvas);
    }
}

export default TransparencyTool;
