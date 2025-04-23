// Get the HTML elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const asciiContainer = document.getElementById('ascii-container');
const ctx = canvas.getContext('2d',{willReadFrequently: true});

// Set willReadFrequently attribute
canvas.willReadFrequently = true;

// ASCII character set
// const asciiChars = ' .,:;iXA#&@'; // Reduced character set
// const asciiChars = ' .,:;|#$%&@'; // Reduced character set
const asciiChars = '01234567890'; // Reduced character set
// const asciiChars = ' 0000000000'; // Reduced character set
// const asciiChars = '0987654321'; // Reduced character set

// Sampling interval (adjust for performance)
// const sampleInterval = 16; // Increased for better performance
const sampleInterval = 12; // Increased for better performance

// Initialize the application
function init() {
    // Request camera access
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(handleSuccess)
        .catch(handleError);
}

// Handle camera access success
function handleSuccess(stream) {
    video.srcObject = stream;
    video.play();

    video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        update();
    });

    // Run the engine
    Runner.run(engine);
}

// Handle camera access error
function handleError(error) {
    console.error('Error accessing camera:', error);
}

// Function to generate ASCII art frame
function generateAsciiFrame() {
    // Draw the current frame from the video to the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the pixel data from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let asciiFrame = [];

    // Convert the image to ASCII art
    for (let y = 0; y < canvas.height; y += sampleInterval) {
        for (let x = 0; x < canvas.width; x += sampleInterval) {
            // Get the pixel data for the current sample
            const i = (y * canvas.width + x) * 4;
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            // Calculate the luminance
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

            // Map the luminance to an ASCII character
            const charIndex = Math.floor(mapRange(luminance, 0, 255, asciiChars.length - 1, 0));
            const char = asciiChars[charIndex];
            // const char = "0"; // Fixed character for testing

            // Solid color generation
            const solidR = r;
            const solidG = g;
            const solidB = b;

            asciiFrame.push({
                char: char,
                x: x,
                y: y,
                color: `rgb(${solidR}, ${solidG}, ${solidB})`
                // color: `rgb(255,255,255)`
            });
        }
    }
    return asciiFrame;
}

// Main loop
function update() {
    // Generate the ASCII art frame
    const asciiFrame = generateAsciiFrame();

    // Clear the ASCII container
    asciiContainer.innerHTML = '';

    // Select a random character to apply physics to
    const randomIndex = Math.floor(Math.random() * asciiFrame.length);

    // Create and append the span elements
    asciiFrame.forEach((item, index) => {
        const span = document.createElement('span');
        span.textContent = item.char;
        span.style.color = item.color;
        span.style.position = 'absolute';
        span.style.left = `${item.x}px`;
        span.style.top = `${item.y}px`;

        asciiContainer.appendChild(span); // Append to ascii container
    });

    // Request the next frame
    requestAnimationFrame(update);
}

// Utility function to map a value from one range to another
function mapRange(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

// Start the application
init();
