// js/commands/ClippingCommand.js
import Command from './Command.js';
import ClippingStrategy from '../strategies/ClippingStrategy.js';

class ClippingCommand extends Command {
    constructor(startX, startY, width, height) {
        super();
        this.startX = startX;
        this.startY = startY;
        this.width = width;
        this.height = height;
    }

    execute(canvas) {
        super.execute(canvas);
        const strategy = new ClippingStrategy(this.startX, this.startY, this.width, this.height);
        strategy.apply(canvas);
    }
}

export default ClippingCommand;
