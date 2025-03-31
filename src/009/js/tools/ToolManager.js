import TransparencyTool from './TransparencyTool.js';
import ClippingTool from './ClippingTool.js';
import ResizeTool from './ResizeTool.js';

class ToolManager {
    constructor() {
        this.activeTool = null;
        this.transparencyTool = new TransparencyTool();
        this.clippingTool = new ClippingTool();
        this.resizeTool = new ResizeTool();
    }

    setActiveTool(toolName) {
        console.log(`Active tool set to: ${toolName}`);
        this.activeTool = toolName;
        const canvas = document.getElementById('imageCanvas');

        if (toolName === 'clipping') {
            canvas.style.cursor = 'crosshair';
        } else {
            canvas.style.cursor = 'default';
        }

        if (toolName === 'transparency') {
            // For now, just log that the tool is selected
            console.log('Transparency tool selected');
            // In the future, add UI elements to select the color and tolerance
            this.transparencyTool.setColor('#FF0000'); // Example: set color to red
            this.transparencyTool.setTolerance(20); // Example: set tolerance to 20
            //this.transparencyTool.applyTransparency(editor.canvas); //This requires editor instance
        }
    }

    getActiveTool() {
        return this.activeTool;
    }
}

export default ToolManager;
