/**
 * GeneticAlgorithmManager.js
 * Manages the genetic algorithm, including individual generation, mutation, and queue management
 */

export default class GeneticAlgorithmManager {
    constructor(initialPopulationSize = 10) {
        this.queue = [];
        this.currentGeneration = 1;
        this.initialPopulationSize = initialPopulationSize;
        this.highestId = 0;
        
        // Shape types available for generation
        this.shapeTypes = ['circle', 'rectangle', 'triangle', 'line', 'polygon'];
        
        // Mutation parameters
        this.mutationRate = 0.3; // Probability of mutating a gene
        this.mutationAmount = 0.2; // How much to mutate by
    }
    
    /**
     * Initialize the population with random individuals
     */
    initializePopulation() {
        this.queue = [];
        this.currentGeneration = 1;
        
        for (let i = 0; i < this.initialPopulationSize; i++) {
            const individual = this.generateRandomIndividual();
            this.queue.push(individual);
        }
        
        return this.queue.length;
    }
    
    /**
     * Generate a random individual
     * @returns {Object} - A random individual with genes
     */
    generateRandomIndividual() {
        const id = ++this.highestId;
        // Further increased shape count based on positive feedback
        const numShapes = this.getRandomInt(350, 550); 
        const shapes = [];
        
        // Generate random shapes
        for (let i = 0; i < numShapes; i++) {
            shapes.push(this.generateRandomShape());
        }
        
        return {
            id,
            generation: this.currentGeneration,
            genes: {
                backgroundColor: this.getRandomColor(0.1), // Light background
                shapes
            }
        };
    }
    
    /**
     * Generate a random shape
     * @returns {Object} - Random shape parameters
     */
    generateRandomShape() {
        // Define canvas and grid parameters (assuming 300x300 canvas for now)
        const canvasWidth = 300;
        const canvasHeight = 300;
        const gridCellSize = 15; // Results in a 20x20 grid

        // Favor rectangles and circles for a more packed look
        const typeWeights = [
            'circle', 'circle', 'circle', 'circle',
            'rectangle', 'rectangle', 'rectangle', 'rectangle', 'rectangle',
            'triangle', 
            // 'line', // Lines might look too sparse for this style
            'polygon' // Polygons can be complex, use sparingly or make them simple
        ];
        const type = typeWeights[this.getRandomInt(0, typeWeights.length - 1)];
        
        const baseShape = {
            type,
            fillColor: this.getRandomColor(),
            strokeColor: this.getRandomColor(), // Stroke can add to density
            lineWidth: this.getRandomInt(1, 2), // Keep lines relatively thin
            opacity: Math.random() * 0.3 + 0.7, // Opacity between 0.7 and 1.0 for more solid overlap
            fill: Math.random() > 0.05, // 95% chance of filling
            stroke: Math.random() > 0.5, // 50% chance of stroke
            rotation: Math.random() > 0.5 ? this.getRandomInt(0, 360) : 0 // 50% chance of rotation
        };

        // Determine base position on the grid
        const gridCol = this.getRandomInt(0, Math.floor(canvasWidth / gridCellSize) -1);
        const gridRow = this.getRandomInt(0, Math.floor(canvasHeight / gridCellSize) -1);
        
        const baseX = gridCol * gridCellSize;
        const baseY = gridRow * gridCellSize;
        
        // Add small random offset for less rigid alignment
        const offsetX = this.getRandomInt(-gridCellSize / 3, gridCellSize / 3);
        const offsetY = this.getRandomInt(-gridCellSize / 3, gridCellSize / 3);

        const finalX = baseX + offsetX;
        const finalY = baseY + offsetY;
        
        // Add shape-specific properties, sized relative to gridCellSize
        switch (type) {
            case 'circle':
                return {
                    ...baseShape,
                    x: finalX + gridCellSize / 2, // Center circle in its conceptual cell
                    y: finalY + gridCellSize / 2,
                    radius: this.getRandomInt(gridCellSize * 0.5, gridCellSize * 1.2) // Increased minimum size
                };
            
            case 'rectangle':
                return {
                    ...baseShape,
                    x: finalX,
                    y: finalY,
                    width: this.getRandomInt(gridCellSize * 0.6, gridCellSize * 2.0), // Increased minimum size
                    height: this.getRandomInt(gridCellSize * 0.6, gridCellSize * 2.0) // Increased minimum size
                };
            
            case 'triangle':
                const size = this.getRandomInt(gridCellSize * 0.7, gridCellSize * 1.8); // Increased minimum size
                // Place triangle relative to finalX, finalY
                return {
                    ...baseShape,
                    x1: finalX + size / 2, 
                    y1: finalY,
                    x2: finalX, 
                    y2: finalY + size,
                    x3: finalX + size, 
                    y3: finalY + size
                };
            
            // case 'line': // Removed for now, can be added back if desired
            //     const length = this.getRandomInt(gridCellSize * 0.5, gridCellSize * 2);
            //     const angle = Math.random() * Math.PI * 2;
            //     return {
            //         ...baseShape,
            //         x1: finalX,
            //         y1: finalY,
            //         x2: finalX + Math.cos(angle) * length,
            //         y2: finalY + Math.sin(angle) * length
            //     };
            
            case 'polygon':
                const numPoints = this.getRandomInt(3, 6); // Simpler polygons
                const points = [];
                const polygonRadius = this.getRandomInt(gridCellSize * 0.6, gridCellSize * 1.5); // Increased minimum size
                
                // Generate points in a roughly circular pattern around finalX, finalY
                for (let i = 0; i < numPoints; i++) {
                    const angle = (i / numPoints) * Math.PI * 2 + (Math.random() - 0.5) * 0.5; // Add jitter to angle
                    const pointRadius = polygonRadius * (0.7 + Math.random() * 0.6); // Vary point distance
                    points.push({
                        x: finalX + gridCellSize / 2 + Math.cos(angle) * pointRadius,
                        y: finalY + gridCellSize / 2 + Math.sin(angle) * pointRadius
                    });
                }
                
                return {
                    ...baseShape,
                    points
                };
            
            default: // Should not happen with current typeWeights
                return { 
                    ...baseShape, 
                    x: finalX, 
                    y: finalY, 
                    width: gridCellSize, 
                    height: gridCellSize 
                };
        }
    }
    
    /**
     * Create offspring from a parent with mutations
     * @param {Object} parent - The parent individual
     * @returns {Object} - The offspring individual
     */
    createOffspring(parent) {
        const id = ++this.highestId;
        const offspring = {
            id,
            generation: this.currentGeneration + 1,
            genes: this.mutateGenes(JSON.parse(JSON.stringify(parent.genes)))
        };
        
        return offspring;
    }
    
    /**
     * Mutate genes
     * @param {Object} genes - The genes to mutate
     * @returns {Object} - The mutated genes
     */
    mutateGenes(genes) {
        // Mutate background color
        if (Math.random() < this.mutationRate) {
            genes.backgroundColor = this.mutateColor(genes.backgroundColor);
        }
        
        // Mutate shapes
        genes.shapes.forEach(shape => {
            this.mutateShape(shape);
        });
        
        // Add multiple new shapes (higher chance for a denser image)
        const numNewShapes = this.getRandomInt(0, 10); // Add up to 10 new shapes
        for (let i = 0; i < numNewShapes; i++) {
            if (Math.random() < 0.3) { // 30% chance per potential new shape
                genes.shapes.push(this.generateRandomShape());
            }
        }
        
        // Randomly remove shapes (but keep a minimum number)
        if (genes.shapes.length > 50) { // Keep at least 50 shapes
            const numToRemove = this.getRandomInt(0, Math.min(5, genes.shapes.length - 50));
            for (let i = 0; i < numToRemove; i++) {
                const indexToRemove = this.getRandomInt(0, genes.shapes.length - 1);
                genes.shapes.splice(indexToRemove, 1);
            }
        }
        
        return genes;
    }
    
    /**
     * Mutate a shape
     * @param {Object} shape - The shape to mutate
     */
    mutateShape(shape) {
        // Mutate common properties
        if (Math.random() < this.mutationRate) {
            shape.fillColor = this.mutateColor(shape.fillColor);
        }
        
        if (Math.random() < this.mutationRate) {
            shape.strokeColor = this.mutateColor(shape.strokeColor);
        }
        
        if (Math.random() < this.mutationRate) {
            shape.lineWidth = Math.max(1, shape.lineWidth + this.getRandomInt(-2, 2));
        }
        
        if (Math.random() < this.mutationRate) {
            shape.opacity = Math.min(1, Math.max(0.1, shape.opacity + (Math.random() - 0.5) * 0.2));
        }
        
        if (Math.random() < this.mutationRate * 0.5) { // Less likely to change fill/stroke
            shape.fill = !shape.fill;
        }
        
        if (Math.random() < this.mutationRate * 0.5) {
            shape.stroke = !shape.stroke;
        }
        
        if (Math.random() < this.mutationRate) {
            shape.rotation = (shape.rotation || 0) + this.getRandomInt(-30, 30);
            // Normalize rotation to 0-360
            shape.rotation = (shape.rotation + 360) % 360;
        }
        
        // Mutate shape-specific properties
        switch (shape.type) {
            case 'circle':
                this.mutateCircle(shape);
                break;
            case 'rectangle':
                this.mutateRectangle(shape);
                break;
            case 'triangle':
                this.mutateTriangle(shape);
                break;
            case 'line':
                this.mutateLine(shape);
                break;
            case 'polygon':
                this.mutatePolygon(shape);
                break;
        }
    }
    
    /**
     * Mutate a circle
     * @param {Object} circle - The circle to mutate
     */
    mutateCircle(circle) {
        if (Math.random() < this.mutationRate) {
            circle.x = Math.max(0, Math.min(300, circle.x + this.getRandomInt(-30, 30)));
        }
        
        if (Math.random() < this.mutationRate) {
            circle.y = Math.max(0, Math.min(300, circle.y + this.getRandomInt(-30, 30)));
        }
        
        if (Math.random() < this.mutationRate) {
            circle.radius = Math.max(5, Math.min(100, circle.radius + this.getRandomInt(-10, 10)));
        }
    }
    
    /**
     * Mutate a rectangle
     * @param {Object} rect - The rectangle to mutate
     */
    mutateRectangle(rect) {
        if (Math.random() < this.mutationRate) {
            rect.x = Math.max(0, Math.min(300, rect.x + this.getRandomInt(-30, 30)));
        }
        
        if (Math.random() < this.mutationRate) {
            rect.y = Math.max(0, Math.min(300, rect.y + this.getRandomInt(-30, 30)));
        }
        
        if (Math.random() < this.mutationRate) {
            rect.width = Math.max(5, Math.min(150, rect.width + this.getRandomInt(-20, 20)));
        }
        
        if (Math.random() < this.mutationRate) {
            rect.height = Math.max(5, Math.min(150, rect.height + this.getRandomInt(-20, 20)));
        }
    }
    
    /**
     * Mutate a triangle
     * @param {Object} triangle - The triangle to mutate
     */
    mutateTriangle(triangle) {
        // Mutate each point
        ['x1', 'y1', 'x2', 'y2', 'x3', 'y3'].forEach(coord => {
            if (Math.random() < this.mutationRate) {
                triangle[coord] = Math.max(0, Math.min(300, triangle[coord] + this.getRandomInt(-20, 20)));
            }
        });
    }
    
    /**
     * Mutate a line
     * @param {Object} line - The line to mutate
     */
    mutateLine(line) {
        // Mutate each endpoint
        ['x1', 'y1', 'x2', 'y2'].forEach(coord => {
            if (Math.random() < this.mutationRate) {
                line[coord] = Math.max(0, Math.min(300, line[coord] + this.getRandomInt(-30, 30)));
            }
        });
    }
    
    /**
     * Mutate a polygon
     * @param {Object} polygon - The polygon to mutate
     */
    mutatePolygon(polygon) {
        // Mutate each point
        polygon.points.forEach(point => {
            if (Math.random() < this.mutationRate) {
                point.x = Math.max(0, Math.min(300, point.x + this.getRandomInt(-20, 20)));
            }
            
            if (Math.random() < this.mutationRate) {
                point.y = Math.max(0, Math.min(300, point.y + this.getRandomInt(-20, 20)));
            }
        });
        
        // Small chance to add or remove a point
        if (Math.random() < 0.05 && polygon.points.length > 3) {
            // Remove a random point
            const indexToRemove = this.getRandomInt(0, polygon.points.length - 1);
            polygon.points.splice(indexToRemove, 1);
        } else if (Math.random() < 0.05 && polygon.points.length < 8) {
            // Add a point between two existing points
            const index = this.getRandomInt(0, polygon.points.length - 1);
            const nextIndex = (index + 1) % polygon.points.length;
            
            const p1 = polygon.points[index];
            const p2 = polygon.points[nextIndex];
            
            // Create a new point between p1 and p2 with some randomness
            const newPoint = {
                x: (p1.x + p2.x) / 2 + this.getRandomInt(-10, 10),
                y: (p1.y + p2.y) / 2 + this.getRandomInt(-10, 10)
            };
            
            // Insert the new point
            polygon.points.splice(nextIndex, 0, newPoint);
        }
    }
    
    /**
     * Mutate a color
     * @param {string} color - The color to mutate (in hex format)
     * @returns {string} - The mutated color
     */
    mutateColor(color) {
        // Parse the hex color
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        // Mutate each component
        const newR = Math.min(255, Math.max(0, r + this.getRandomInt(-30, 30)));
        const newG = Math.min(255, Math.max(0, g + this.getRandomInt(-30, 30)));
        const newB = Math.min(255, Math.max(0, b + this.getRandomInt(-30, 30)));
        
        // Convert back to hex
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    
    /**
     * Get a random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} - Random integer
     */
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    /**
     * Get a random color in hex format
     * @param {number} alpha - Optional alpha value for pastel colors (0-1)
     * @returns {string} - Random color in hex format
     */
    getRandomColor(alpha = 1) {
        // For more vibrant colors, we'll use a different approach
        if (alpha < 1) {
            // For background, use very light colors
            const r = this.getRandomInt(220, 255);
            const g = this.getRandomInt(220, 255);
            const b = this.getRandomInt(220, 255);
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        } else {
            // For shapes, use more vibrant colors
            // Choose one of several approaches randomly
            const colorType = this.getRandomInt(1, 4);
            
            switch (colorType) {
                case 1: // Fully saturated, random hue
                    const hue = this.getRandomInt(0, 360);
                    return this.hslToHex(hue, 100, 50);
                    
                case 2: // Bright, slightly desaturated
                    const brightHue = this.getRandomInt(0, 360);
                    return this.hslToHex(brightHue, this.getRandomInt(70, 100), this.getRandomInt(40, 60));
                    
                case 3: // Neon-like
                    const neonHue = this.getRandomInt(0, 360);
                    return this.hslToHex(neonHue, 100, 70);
                    
                case 4: // Random RGB but avoid grays
                    let r, g, b;
                    // Ensure at least one component is very high or very low
                    const highComponent = this.getRandomInt(1, 3);
                    if (highComponent === 1) {
                        r = this.getRandomInt(180, 255);
                        g = this.getRandomInt(0, 180);
                        b = this.getRandomInt(0, 180);
                    } else if (highComponent === 2) {
                        r = this.getRandomInt(0, 180);
                        g = this.getRandomInt(180, 255);
                        b = this.getRandomInt(0, 180);
                    } else {
                        r = this.getRandomInt(0, 180);
                        g = this.getRandomInt(0, 180);
                        b = this.getRandomInt(180, 255);
                    }
                    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            }
        }
    }
    
    /**
     * Convert HSL color values to hex
     * @param {number} h - Hue (0-360)
     * @param {number} s - Saturation (0-100)
     * @param {number} l - Lightness (0-100)
     * @returns {string} - Hex color string
     */
    hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    
    /**
     * Process a "like" decision for the current individual
     * @param {Object} individual - The individual that was liked
     * @returns {number} - The number of items in the queue after processing
     */
    processLike(individual) {
        // Create two offspring from the liked individual
        const offspring1 = this.createOffspring(individual);
        const offspring2 = this.createOffspring(individual);
        
        // Add the offspring to the queue
        this.queue.push(offspring1);
        this.queue.push(offspring2);
        
        // Update the current generation if needed
        this.currentGeneration = Math.max(this.currentGeneration, offspring1.generation);
        
        return this.queue.length;
    }
    
    /**
     * Process a "dislike" decision for the current individual
     * @returns {number} - The number of items in the queue after processing
     */
    processDislike() {
        // No action needed for dislike, as the individual is already removed from the queue
        return this.queue.length;
    }
    
    /**
     * Get the next individual from the queue
     * @returns {Object|null} - The next individual or null if the queue is empty
     */
    getNextIndividual() {
        if (this.queue.length === 0) {
            return null;
        }
        
        return this.queue.shift();
    }
    
    /**
     * Get the current queue length
     * @returns {number} - The number of individuals in the queue
     */
    getQueueLength() {
        return this.queue.length;
    }
    
    /**
     * Get the current generation
     * @returns {number} - The current generation
     */
    getCurrentGeneration() {
        return this.currentGeneration;
    }
}
