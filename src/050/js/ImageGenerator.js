/**
 * ImageGenerator.js
 * Responsible for generating images from genetic parameters
 */

export default class ImageGenerator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    /**
     * Generate an image based on genetic parameters
     * @param {Object} genes - The genetic parameters for the image
     * @returns {string} - Data URL of the generated image
     */
    generateImage(genes) {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Set background color
        this.ctx.fillStyle = genes.backgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw shapes based on genes
        genes.shapes.forEach(shape => {
            this.drawShape(shape);
        });
        
        // Return the data URL of the image
        return this.canvas.toDataURL('image/png');
    }
    
    /**
     * Draw a shape on the canvas based on its parameters
     * @param {Object} shape - The shape parameters
     */
    drawShape(shape) {
        this.ctx.save();
        
        // Set shape styles
        this.ctx.fillStyle = shape.fillColor;
        this.ctx.strokeStyle = shape.strokeColor;
        this.ctx.lineWidth = shape.lineWidth;
        this.ctx.globalAlpha = shape.opacity;
        
        // Draw the shape based on its type
        switch (shape.type) {
            case 'circle':
                this.drawCircle(shape);
                break;
            case 'rectangle':
                this.drawRectangle(shape);
                break;
            case 'triangle':
                this.drawTriangle(shape);
                break;
            case 'line':
                this.drawLine(shape);
                break;
            case 'polygon':
                this.drawPolygon(shape);
                break;
        }
        
        this.ctx.restore();
    }
    
    /**
     * Draw a circle
     * @param {Object} shape - Circle parameters
     */
    drawCircle(shape) {
        this.ctx.beginPath();
        this.ctx.arc(
            shape.x,
            shape.y,
            shape.radius,
            0,
            Math.PI * 2
        );
        
        if (shape.fill) {
            this.ctx.fill();
        }
        
        if (shape.stroke) {
            this.ctx.stroke();
        }
    }
    
    /**
     * Draw a rectangle
     * @param {Object} shape - Rectangle parameters
     */
    drawRectangle(shape) {
        this.ctx.beginPath();
        
        if (shape.rotation) {
            // Rotate around the center of the rectangle
            this.ctx.translate(shape.x + shape.width / 2, shape.y + shape.height / 2);
            this.ctx.rotate(shape.rotation * Math.PI / 180);
            this.ctx.rect(-shape.width / 2, -shape.height / 2, shape.width, shape.height);
        } else {
            this.ctx.rect(shape.x, shape.y, shape.width, shape.height);
        }
        
        if (shape.fill) {
            this.ctx.fill();
        }
        
        if (shape.stroke) {
            this.ctx.stroke();
        }
    }
    
    /**
     * Draw a triangle
     * @param {Object} shape - Triangle parameters
     */
    drawTriangle(shape) {
        this.ctx.beginPath();
        
        if (shape.rotation) {
            // Calculate the center of the triangle
            const centerX = (shape.x1 + shape.x2 + shape.x3) / 3;
            const centerY = (shape.y1 + shape.y2 + shape.y3) / 3;
            
            // Rotate around the center
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(shape.rotation * Math.PI / 180);
            
            // Draw the triangle relative to the center
            this.ctx.moveTo(shape.x1 - centerX, shape.y1 - centerY);
            this.ctx.lineTo(shape.x2 - centerX, shape.y2 - centerY);
            this.ctx.lineTo(shape.x3 - centerX, shape.y3 - centerY);
        } else {
            this.ctx.moveTo(shape.x1, shape.y1);
            this.ctx.lineTo(shape.x2, shape.y2);
            this.ctx.lineTo(shape.x3, shape.y3);
        }
        
        this.ctx.closePath();
        
        if (shape.fill) {
            this.ctx.fill();
        }
        
        if (shape.stroke) {
            this.ctx.stroke();
        }
    }
    
    /**
     * Draw a line
     * @param {Object} shape - Line parameters
     */
    drawLine(shape) {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.x1, shape.y1);
        this.ctx.lineTo(shape.x2, shape.y2);
        this.ctx.stroke();
    }
    
    /**
     * Draw a polygon
     * @param {Object} shape - Polygon parameters
     */
    drawPolygon(shape) {
        if (!shape.points || shape.points.length < 3) {
            return;
        }
        
        this.ctx.beginPath();
        
        if (shape.rotation) {
            // Calculate the center of the polygon
            let centerX = 0;
            let centerY = 0;
            
            shape.points.forEach(point => {
                centerX += point.x;
                centerY += point.y;
            });
            
            centerX /= shape.points.length;
            centerY /= shape.points.length;
            
            // Rotate around the center
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(shape.rotation * Math.PI / 180);
            
            // Draw the polygon relative to the center
            this.ctx.moveTo(shape.points[0].x - centerX, shape.points[0].y - centerY);
            
            for (let i = 1; i < shape.points.length; i++) {
                this.ctx.lineTo(shape.points[i].x - centerX, shape.points[i].y - centerY);
            }
        } else {
            this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
            
            for (let i = 1; i < shape.points.length; i++) {
                this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
            }
        }
        
        this.ctx.closePath();
        
        if (shape.fill) {
            this.ctx.fill();
        }
        
        if (shape.stroke) {
            this.ctx.stroke();
        }
    }
    
    /**
     * Get the data URL of the current canvas
     * @returns {string} - Data URL of the canvas
     */
    getImageDataURL() {
        return this.canvas.toDataURL('image/png');
    }
}
