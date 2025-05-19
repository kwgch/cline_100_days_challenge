/**
 * EventHandler.js
 * Responsible for handling user input (swipe/click) and managing UI interactions
 */

export default class EventHandler {
    /**
     * Initialize the event handler
     * @param {Object} options - Configuration options
     * @param {HTMLElement} options.cardElement - The card element to handle swipes for
     * @param {HTMLElement} options.likeButton - The like button element
     * @param {HTMLElement} options.dislikeButton - The dislike button element
     * @param {HTMLElement} options.saveButton - The save button element
     * @param {HTMLElement} options.restartButton - The restart button element
     * @param {HTMLElement} options.startButton - The start button element
     * @param {Function} options.onLike - Callback for like action
     * @param {Function} options.onDislike - Callback for dislike action
     * @param {Function} options.onSave - Callback for save action
     * @param {Function} options.onRestart - Callback for restart action
     * @param {Function} options.onStart - Callback for start action
     */
    constructor(options) {
        this.cardElement = options.cardElement;
        this.likeButton = options.likeButton;
        this.dislikeButton = options.dislikeButton;
        this.saveButton = options.saveButton;
        this.restartButton = options.restartButton;
        this.startButton = options.startButton;
        
        this.onLike = options.onLike;
        this.onDislike = options.onDislike;
        this.onSave = options.onSave;
        this.onRestart = options.onRestart;
        this.onStart = options.onStart;
        
        // Swipe state
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        
        // Threshold for considering a swipe (in pixels)
        this.swipeThreshold = 100;
        
        // Flag to prevent multiple swipes
        this.isAnimating = false;
        
        // Bind methods to this instance
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        
        // Initialize event listeners
        this.initEventListeners();
    }
    
    /**
     * Initialize all event listeners
     */
    initEventListeners() {
        // Touch events for mobile
        this.cardElement.addEventListener('touchstart', this.handleTouchStart, { passive: false });
        this.cardElement.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        this.cardElement.addEventListener('touchend', this.handleTouchEnd);
        
        // Mouse events for desktop
        this.cardElement.addEventListener('mousedown', this.handleMouseDown);
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);
        
        // Button click events
        this.likeButton.addEventListener('click', () => this.handleLikeClick());
        this.dislikeButton.addEventListener('click', () => this.handleDislikeClick());
        this.saveButton.addEventListener('click', () => this.handleSaveClick());
        this.restartButton.addEventListener('click', () => this.handleRestartClick());
        this.startButton.addEventListener('click', () => this.handleStartClick());
    }
    
    /**
     * Remove all event listeners
     */
    removeEventListeners() {
        // Touch events
        this.cardElement.removeEventListener('touchstart', this.handleTouchStart);
        this.cardElement.removeEventListener('touchmove', this.handleTouchMove);
        this.cardElement.removeEventListener('touchend', this.handleTouchEnd);
        
        // Mouse events
        this.cardElement.removeEventListener('mousedown', this.handleMouseDown);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
        
        // Button events
        this.likeButton.removeEventListener('click', () => this.handleLikeClick());
        this.dislikeButton.removeEventListener('click', () => this.handleDislikeClick());
        this.saveButton.removeEventListener('click', () => this.handleSaveClick());
        this.restartButton.removeEventListener('click', () => this.handleRestartClick());
        this.startButton.removeEventListener('click', () => this.handleStartClick());
    }
    
    /**
     * Handle touch start event
     * @param {TouchEvent} event - The touch event
     */
    handleTouchStart(event) {
        if (this.isAnimating) return;
        
        // Prevent default to avoid scrolling while swiping
        event.preventDefault();
        
        const touch = event.touches[0];
        this.startDrag(touch.clientX, touch.clientY);
    }
    
    /**
     * Handle touch move event
     * @param {TouchEvent} event - The touch event
     */
    handleTouchMove(event) {
        if (!this.isDragging || this.isAnimating) return;
        
        // Prevent default to avoid scrolling while swiping
        event.preventDefault();
        
        const touch = event.touches[0];
        this.updateDrag(touch.clientX, touch.clientY);
    }
    
    /**
     * Handle touch end event
     */
    handleTouchEnd() {
        if (!this.isDragging || this.isAnimating) return;
        
        this.endDrag();
    }
    
    /**
     * Handle mouse down event
     * @param {MouseEvent} event - The mouse event
     */
    handleMouseDown(event) {
        if (this.isAnimating) return;
        
        this.startDrag(event.clientX, event.clientY);
    }
    
    /**
     * Handle mouse move event
     * @param {MouseEvent} event - The mouse event
     */
    handleMouseMove(event) {
        if (!this.isDragging || this.isAnimating) return;
        
        this.updateDrag(event.clientX, event.clientY);
    }
    
    /**
     * Handle mouse up event
     */
    handleMouseUp() {
        if (!this.isDragging || this.isAnimating) return;
        
        this.endDrag();
    }
    
    /**
     * Start dragging the card
     * @param {number} x - The x coordinate
     * @param {number} y - The y coordinate
     */
    startDrag(x, y) {
        this.isDragging = true;
        this.startX = x;
        this.startY = y;
        this.currentX = x;
        this.currentY = y;
        
        // Add dragging class to card
        this.cardElement.classList.add('swiping');
    }
    
    /**
     * Update the card position during drag
     * @param {number} x - The x coordinate
     * @param {number} y - The y coordinate
     */
    updateDrag(x, y) {
        this.currentX = x;
        this.currentY = y;
        
        // Calculate the distance moved
        const deltaX = this.currentX - this.startX;
        
        // Update the card position
        this.cardElement.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.1}deg)`;
        
        // Update the overlay based on swipe direction
        if (deltaX > 0) {
            this.cardElement.classList.add('dragging-left');
            this.cardElement.classList.remove('dragging-right');
        } else if (deltaX < 0) {
            this.cardElement.classList.add('dragging-right');
            this.cardElement.classList.remove('dragging-left');
        } else {
            this.cardElement.classList.remove('dragging-left', 'dragging-right');
        }
    }
    
    /**
     * End the card drag and determine the action
     */
    endDrag() {
        // Calculate the distance moved
        const deltaX = this.currentX - this.startX;
        
        // Determine if it's a swipe based on the threshold
        if (deltaX > this.swipeThreshold) {
            // Swipe right (dislike)
            this.animateSwipe('right');
        } else if (deltaX < -this.swipeThreshold) {
            // Swipe left (like)
            this.animateSwipe('left');
        } else {
            // Not a swipe, reset the card
            this.resetCard();
        }
        
        // Reset drag state
        this.isDragging = false;
    }
    
    /**
     * Animate the card swipe
     * @param {string} direction - The direction to swipe ('left' or 'right')
     */
    animateSwipe(direction) {
        this.isAnimating = true;
        
        // Add the appropriate swipe class
        this.cardElement.classList.add(`swipe-${direction}`);
        this.cardElement.classList.remove('swiping', 'dragging-left', 'dragging-right');
        
        // Wait for the animation to complete
        setTimeout(() => {
            // Hide the card immediately before any position reset
            this.cardElement.style.opacity = '0';
            this.cardElement.style.visibility = 'hidden';
            
            // Trigger the appropriate callback
            if (direction === 'left') {
                this.onLike();
            } else {
                this.onDislike();
            }
            
            // Reset the card position while it's invisible
            setTimeout(() => {
                this.cardElement.style.transform = '';
                this.cardElement.classList.remove(`swipe-${direction}`);
                
                // Force a reflow
                void this.cardElement.offsetWidth;
                
                // Show the card with a fade-in animation
                setTimeout(() => {
                    this.cardElement.style.visibility = 'visible';
                    this.cardElement.style.transition = 'opacity 0.5s ease-out';
                    this.cardElement.style.opacity = '1';
                    
                    // Reset animation state after the fade-in completes
                    setTimeout(() => {
                        this.cardElement.style.transition = '';
                        this.isAnimating = false;
                    }, 500);
                }, 100); // Small delay before showing the new card
            }, 50); // Small delay to ensure the card is reset while invisible
        }, 500); // Match the CSS transition duration
    }
    
    /**
     * Reset the card position
     */
    resetCard() {
        // Remove all dragging classes
        this.cardElement.classList.remove('swiping', 'dragging-left', 'dragging-right');
        
        // Reset the transform
        this.cardElement.style.transform = '';
    }
    
    /**
     * Handle like button click
     */
    handleLikeClick() {
        if (this.isAnimating) return;
        
        this.animateSwipe('left');
    }
    
    /**
     * Handle dislike button click
     */
    handleDislikeClick() {
        if (this.isAnimating) return;
        
        this.animateSwipe('right');
    }
    
    /**
     * Handle save button click
     */
    handleSaveClick() {
        if (this.onSave) {
            this.onSave();
        }
    }
    
    /**
     * Handle restart button click
     */
    handleRestartClick() {
        if (this.onRestart) {
            this.onRestart();
        }
    }
    
    /**
     * Handle start button click
     */
    handleStartClick() {
        if (this.onStart) {
            this.onStart();
        }
    }
}
