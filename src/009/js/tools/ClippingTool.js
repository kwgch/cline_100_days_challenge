// js/tools/ClippingTool.js
import Tool from './Tool.js';
import Editor from '../core/Editor.js';
import ClippingCommand from '../commands/ClippingCommand.js';

class ClippingTool extends Tool {
    constructor() {
        super();
        this.name = 'clipping';
    }

    clip(startX, startY, width, height) {
        const editor = Editor.getInstance();
        const command = new ClippingCommand(startX, startY, width, height);
        editor.executeCommand(command);
    }
}

export default ClippingTool;
