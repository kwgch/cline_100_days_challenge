// js/commands/TransparencyCommand.js
import Command from './Command.js';
import TransparencyStrategy from '../strategies/TransparencyStrategy.js';

class TransparencyCommand extends Command {
    constructor(color, tolerance) {
        super();
        this.color = color;
        this.tolerance = tolerance;
    }

    execute(canvas) {
        super.execute(canvas);
        const strategy = new TransparencyStrategy(this.color, this.tolerance);
        strategy.apply(canvas);
    }
}

export default TransparencyCommand;
