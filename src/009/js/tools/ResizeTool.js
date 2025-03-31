// js/tools/ResizeTool.js
import ResizeCommand from '../commands/ResizeCommand.js';
import Editor from '../core/Editor.js';

class ResizeTool {
    constructor() {
        this.width = 500;
        this.height = 500;
    }

    resize(width, height) {
        const editor = Editor.getInstance();
        const canvas = editor.canvas;
        const command = new ResizeCommand(width, height);
        command.execute(canvas);
    }
}

export default ResizeTool;
