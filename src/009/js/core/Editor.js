// js/core/Editor.js
import Canvas from './Canvas.js';
import EventBus from './EventBus.js';
import ToolManager from '../tools/ToolManager.js';
import FileHandler from '../utils/FileHandler.js';

class Editor {
    constructor() {
        if (Editor.instance) {
            return Editor.instance;
        }
        Editor.instance = this;

        this.canvas = new Canvas('imageCanvas');
        this.eventBus = new EventBus();
        this.toolManager = new ToolManager();
        this.fileHandler = new FileHandler();
        this.currentImage = null; // Store the image object
    }

    executeCommand(command) {
        command.execute(this.canvas);
    }

    static getInstance() {
        if (!Editor.instance) {
            Editor.instance = new Editor();
        }
        return Editor.instance;
    }

    init() {
        this.setupEventListeners();
        console.log('Editor initialized');
    }

    setupEventListeners() {
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        document.addEventListener('drop', (e) => {
            e.preventDefault();
            this.handleImageUpload(e.dataTransfer.files[0]);
        });
    }

    handleImageUpload(file, width, height) {
        this.fileHandler.loadImage(file)
            .then(img => {
                this.currentImage = img;
                this.canvas.drawImage(img, width, height);
            })
            .catch(error => {
                console.error('Error loading image:', error);
            });
    }

    setTool(toolName) {
        this.toolManager.setActiveTool(toolName);
    }
}

export default Editor;
