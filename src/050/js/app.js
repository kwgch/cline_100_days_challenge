/**
 * app.js
 * Main application entry point
 */

import ImageGenerator from './ImageGenerator.js';
import GeneticAlgorithmManager from './GeneticAlgorithmManager.js';
import StorageManager from './StorageManager.js';
import EventHandler from './EventHandler.js';

class App {
    constructor() {
        // Initialize components
        this.imageGenerator = new ImageGenerator('image-canvas');
        this.geneticAlgorithmManager = new GeneticAlgorithmManager(10); // Start with 10 individuals
        this.storageManager = new StorageManager();
        
        // DOM elements
        this.cardElement = document.getElementById('card');
        this.likeButton = document.getElementById('like-btn');
        this.dislikeButton = document.getElementById('dislike-btn');
        this.saveButton = document.getElementById('save-btn');
        this.restartButton = document.getElementById('restart-btn');
        this.startButton = document.getElementById('start-btn');
        this.generationCountElement = document.getElementById('generation-count');
        this.queueCountElement = document.getElementById('queue-count');
        this.noMoreImagesElement = document.getElementById('no-more-images');
        this.introScreenElement = document.getElementById('intro-screen');
        
        // Current individual being displayed
        this.currentIndividual = null;
        
        // Initialize event handler
        this.eventHandler = new EventHandler({
            cardElement: this.cardElement,
            likeButton: this.likeButton,
            dislikeButton: this.dislikeButton,
            saveButton: this.saveButton,
            restartButton: this.restartButton,
            startButton: this.startButton,
            onLike: () => this.handleLike(),
            onDislike: () => this.handleDislike(),
            onSave: () => this.handleSave(),
            onRestart: () => this.handleRestart(),
            onStart: () => this.handleStart()
        });
    }
    
    /**
     * Initialize the application
     */
    init() {
        // Show the intro screen
        this.introScreenElement.style.display = 'flex';
    }
    
    /**
     * Start the application
     */
    start() {
        // Hide the intro screen
        this.introScreenElement.style.display = 'none';
        
        // Initialize the population
        const queueLength = this.geneticAlgorithmManager.initializePopulation();
        
        // Update the queue count
        this.updateQueueCount(queueLength);
        
        // Display the first individual
        this.displayNextIndividual();
    }
    
    /**
     * Display the next individual from the queue
     */
    displayNextIndividual() {
        // Get the next individual from the queue
        this.currentIndividual = this.geneticAlgorithmManager.getNextIndividual();
        
        if (this.currentIndividual) {
            // Generate and display the image
            this.imageGenerator.generateImage(this.currentIndividual.genes);
            
            // Update the generation count
            this.updateGenerationCount(this.currentIndividual.generation);
            
            // Update the queue count
            this.updateQueueCount(this.geneticAlgorithmManager.getQueueLength());
        } else {
            // No more individuals in the queue
            this.showNoMoreImages();
        }
    }
    
    /**
     * Handle the "like" action
     */
    handleLike() {
        if (!this.currentIndividual) return;
        
        // Process the like decision
        const queueLength = this.geneticAlgorithmManager.processLike(this.currentIndividual);
        
        // Update the queue count
        this.updateQueueCount(queueLength);
        
        // Display the next individual
        this.displayNextIndividual();
    }
    
    /**
     * Handle the "dislike" action
     */
    handleDislike() {
        if (!this.currentIndividual) return;
        
        // Process the dislike decision
        const queueLength = this.geneticAlgorithmManager.processDislike();
        
        // Update the queue count
        this.updateQueueCount(queueLength);
        
        // Display the next individual
        this.displayNextIndividual();
    }
    
    /**
     * Handle the "save" action
     */
    handleSave() {
        if (!this.currentIndividual) return;
        
        // Get the image data URL
        const dataUrl = this.imageGenerator.getImageDataURL();
        
        // Save the image
        this.storageManager.saveImage(
            dataUrl,
            this.currentIndividual.id,
            this.currentIndividual.generation
        );
        
        // Show a notification
        this.storageManager.showSaveNotification();
    }
    
    /**
     * Handle the "restart" action
     */
    handleRestart() {
        // Hide the no more images screen
        this.noMoreImagesElement.classList.add('hidden');
        
        // Restart the application
        this.start();
    }
    
    /**
     * Handle the "start" action
     */
    handleStart() {
        // Start the application
        this.start();
    }
    
    /**
     * Update the generation count display
     * @param {number} generation - The current generation
     */
    updateGenerationCount(generation) {
        this.generationCountElement.textContent = generation;
    }
    
    /**
     * Update the queue count display
     * @param {number} count - The current queue length
     */
    updateQueueCount(count) {
        this.queueCountElement.textContent = count;
    }
    
    /**
     * Show the "no more images" screen
     */
    showNoMoreImages() {
        this.noMoreImagesElement.classList.remove('hidden');
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
