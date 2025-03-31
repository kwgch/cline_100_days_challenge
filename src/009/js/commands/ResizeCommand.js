// js/commands/ResizeCommand.js
import Command from './Command.js';
import ResizeStrategy from '../strategies/ResizeStrategy.js';

class ResizeCommand extends Command {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }

    execute(canvas) {
        super.execute(canvas);
        const strategy = new ResizeStrategy(this.width, this.height);
        strategy.apply(canvas);
    }
}

export default ResizeCommand;
