// app.js
import Editor from './core/Editor.js';

const editor = Editor.getInstance();

// Initialize the editor
editor.init();

document.getElementById('toolbar').addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        e.preventDefault();
        const tool = e.target.dataset.tool;
        editor.toolManager.setActiveTool(tool);
        if (tool === 'transparency') {
            document.getElementById('transparencyOptions').style.display = 'block';
            document.getElementById('resizeOptions').style.display = 'none';
        } else if (tool === 'resize') {
            document.getElementById('resizeOptions').style.display = 'block';
            document.getElementById('transparencyOptions').style.display = 'none';
        } else {
            document.getElementById('transparencyOptions').style.display = 'none';
            document.getElementById('resizeOptions').style.display = 'none';
        }
    }
});

document.getElementById('imageUpload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const maxWidth = window.innerWidth; // Get screen width
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }

            editor.handleImageUpload(file, width, height); // Pass width and height to handleImageUpload
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);
});

document.getElementById('applyTransparency').addEventListener('click', () => {
    const color = document.getElementById('transparencyColor').value;
    const tolerance = document.getElementById('transparencyTolerance').value;
    editor.toolManager.transparencyTool.setColor(color);
    editor.toolManager.transparencyTool.setTolerance(tolerance);
    editor.toolManager.transparencyTool.applyTransparency(editor.canvas);
});

document.getElementById('applyResize').addEventListener('click', () => {
    const width = parseInt(document.getElementById('resizeWidth').value);
    const height = parseInt(document.getElementById('resizeHeight').value);
    editor.toolManager.resizeTool.resize(width, height);
});

let clippingStart = null;
const clippingOverlay = document.getElementById('clippingOverlay');
const imageCanvas = document.getElementById('imageCanvas');

imageCanvas.addEventListener('touchstart', (e) => {
    if (editor.toolManager.activeTool === 'clipping') {
        // e.preventDefault(); // Prevent scrolling
        const rect = imageCanvas.getBoundingClientRect();
        const touch = e.touches[0];
        const scaleX = imageCanvas.width / rect.width;
        const scaleY = imageCanvas.height / rect.height;
        clippingStart = { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
        clippingOverlay.style.display = 'block';
        clippingOverlay.style.left = touch.clientX + 'px';
        clippingOverlay.style.top = touch.clientY + 'px';
        clippingOverlay.style.width = '0px';
        clippingOverlay.style.height = '0px';
    }
});

imageCanvas.addEventListener('touchmove', (e) => {
    if (editor.toolManager.activeTool === 'clipping' && clippingStart) {
        e.preventDefault(); // Prevent scrolling
        const rect = imageCanvas.getBoundingClientRect();
        const touch = e.touches[0];
        const scaleX = imageCanvas.width / rect.width;
        const scaleY = imageCanvas.height / rect.height;
        const width = ((touch.clientX - rect.left) - (clippingStart.x / scaleX)) * scaleX;
        const height = ((touch.clientY - rect.top) - (clippingStart.y / scaleY)) * scaleY;
        clippingOverlay.style.width = width + 'px';
        clippingOverlay.style.height = height + 'px';
    }
});

imageCanvas.addEventListener('touchend', (e) => {
    if (editor.toolManager.activeTool === 'clipping' && clippingStart) {
        e.preventDefault(); // Prevent scrolling
        const rect = imageCanvas.getBoundingClientRect();
        const touch = e.changedTouches[0];
        const scaleX = imageCanvas.width / rect.width;
        const scaleY = imageCanvas.height / rect.height;
		const width = ((touch.clientX - rect.left) - (clippingStart.x / scaleX)) * scaleX;
        const height = ((touch.clientY - rect.top) - (clippingStart.y / scaleY)) * scaleY;
        editor.toolManager.clippingTool.clip(
            clippingStart.x,
            clippingStart.y,
            width,
            height
        );
        clippingStart = null;
        clippingOverlay.style.display = 'none';
        clippingOverlay.style.width = '0px';
        clippingOverlay.style.height = '0px';
    }
});

imageCanvas.addEventListener('mousedown', (e) => {
    if (editor.toolManager.activeTool === 'clipping') {
        const rect = imageCanvas.getBoundingClientRect();
        const scaleX = imageCanvas.width / rect.width;
        const scaleY = imageCanvas.height / rect.height;
        clippingStart = { x: e.offsetX * scaleX, y: e.offsetY * scaleY };
        clippingOverlay.style.display = 'block';
        clippingOverlay.style.left = (rect.left + e.offsetX) + 'px';
        clippingOverlay.style.top = (rect.top + e.offsetY) + 'px';
        clippingOverlay.style.width = '0px';
        clippingOverlay.style.height = '0px';
    }
});

imageCanvas.addEventListener('mousemove', (e) => {
    if (editor.toolManager.activeTool === 'clipping' && clippingStart) {
        const rect = imageCanvas.getBoundingClientRect();
        const scaleX = imageCanvas.width / rect.width;
        const scaleY = imageCanvas.height / rect.height;
        const width = (e.offsetX - (clippingStart.x / scaleX)) * scaleX;
        const height = (e.offsetY - (clippingStart.y / scaleY)) * scaleY;
        clippingOverlay.style.width = width + 'px';
        clippingOverlay.style.height = height + 'px';
    }
});

imageCanvas.addEventListener('mouseup', (e) => {
    if (editor.toolManager.activeTool === 'clipping' && clippingStart) {
        const rect = imageCanvas.getBoundingClientRect();
        const scaleX = imageCanvas.width / rect.width;
        const scaleY = imageCanvas.height / rect.height;
        const width = (e.offsetX - (clippingStart.x / scaleX)) * scaleX;
        const height = (e.offsetY - (clippingStart.y / scaleY)) * scaleY;
        editor.toolManager.clippingTool.clip(
            clippingStart.x,
            clippingStart.y,
            width,
            height
        );
        clippingStart = null;
        clippingOverlay.style.display = 'none';
        clippingOverlay.style.width = '0px';
        clippingOverlay.style.height = '0px';
    }
});
