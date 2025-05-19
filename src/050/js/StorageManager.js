/**
 * StorageManager.js
 * Responsible for saving images and managing downloads
 */

export default class StorageManager {
    /**
     * Save an image to the user's device
     * @param {string} dataUrl - The data URL of the image to save
     * @param {number} id - The ID of the image
     * @param {number} generation - The generation of the image
     */
    saveImage(dataUrl, id, generation) {
        // Create a link element
        const link = document.createElement('a');
        
        // Set the download attributes
        link.download = `genetic-image-id${id}-gen${generation}.png`;
        link.href = dataUrl;
        
        // Append to the body (required for Firefox)
        document.body.appendChild(link);
        
        // Trigger the download
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        
        return true;
    }
    
    /**
     * Create a temporary preview of the image before saving
     * @param {string} dataUrl - The data URL of the image
     * @returns {HTMLElement} - The preview element
     */
    createSavePreview(dataUrl) {
        // Create a container for the preview
        const previewContainer = document.createElement('div');
        previewContainer.className = 'save-preview';
        previewContainer.style.position = 'fixed';
        previewContainer.style.top = '50%';
        previewContainer.style.left = '50%';
        previewContainer.style.transform = 'translate(-50%, -50%)';
        previewContainer.style.backgroundColor = 'white';
        previewContainer.style.padding = '20px';
        previewContainer.style.borderRadius = '10px';
        previewContainer.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        previewContainer.style.zIndex = '1000';
        previewContainer.style.textAlign = 'center';
        
        // Create the image element
        const img = document.createElement('img');
        img.src = dataUrl;
        img.style.maxWidth = '300px';
        img.style.maxHeight = '300px';
        img.style.marginBottom = '15px';
        img.style.borderRadius = '5px';
        
        // Create the message
        const message = document.createElement('p');
        message.textContent = 'Image saved!';
        message.style.marginBottom = '10px';
        
        // Add elements to the container
        previewContainer.appendChild(img);
        previewContainer.appendChild(message);
        
        // Add to the body
        document.body.appendChild(previewContainer);
        
        // Remove after a delay
        setTimeout(() => {
            if (document.body.contains(previewContainer)) {
                document.body.removeChild(previewContainer);
            }
        }, 2000);
        
        return previewContainer;
    }
    
    /**
     * Show a notification that the image was saved
     * @param {string} message - The message to display
     */
    showSaveNotification(message = 'Image saved!') {
        // Create a notification element
        const notification = document.createElement('div');
        notification.className = 'save-notification';
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = '#2ecc71';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '30px';
        notification.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease-in-out';
        
        // Add to the body
        document.body.appendChild(notification);
        
        // Fade in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Remove after a delay
        setTimeout(() => {
            notification.style.opacity = '0';
            
            // Remove from DOM after fade out
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2000);
        
        return notification;
    }
}
