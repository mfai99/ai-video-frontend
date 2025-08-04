// DOM Elements
const videoForm = document.getElementById('videoForm');
const generateBtn = document.getElementById('generateBtn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');
const resultContainer = document.getElementById('resultContainer');
const resultData = document.getElementById('resultData');

// Form Elements
const videoTopicInput = document.getElementById('videoTopic');
const videoStyleSelect = document.getElementById('videoStyle');
const videoDurationSelect = document.getElementById('videoDuration');

// Backend API endpoint URL
const API_ENDPOINT = 'https://ai-video-generator-server.vercel.app/generate';

/**
 * Send data to the backend API
 * @param {Object} data - JSON data to send
 */
async function sendToBackend(data) {
    try {
        console.log('Preparing to send data to backend:', data);

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.status === 429) {
            alert("Too many requests! Please wait a moment and try again.");
            return { success: false, error: "Too many requests" };
        }

        if (response.ok) {
            const result = await response.json();
            console.log('Backend response:', result);
            return { success: true, data: result };
        } else {
            throw new Error(`HTTP Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error occurred while sending to backend:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Show loading state
 */
function showLoading() {
    generateBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
}

/**
 * Hide loading state
 */
function hideLoading() {
    generateBtn.disabled = false;
    btnText.style.display = 'block';
    btnLoader.style.display = 'none';
}

/**
 * Show result
 * @param {Object} data - Data to display
 * @param {boolean} isSuccess - Whether it's a success result
 */
function showResult(data, isSuccess = true) {
    resultContainer.style.display = 'block';
    resultContainer.className = `result-container ${isSuccess ? 'success' : 'error'}`;
    
    if (isSuccess) {
        resultData.textContent = JSON.stringify(data, null, 2);
    } else {
        resultData.textContent = `Error: ${data.error || 'Unknown error'}`;
    }
    
    // Scroll to result area
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Collect form data
    const formData = {
        topic: videoTopicInput.value.trim(),
        style: videoStyleSelect.value,
        duration: videoDurationSelect.value,
        timestamp: new Date().toISOString()
    };
    
    // Validate data
    const validationErrors = [];
    if (!formData.topic || formData.topic.length < 2) {
        validationErrors.push('Video topic must be at least 2 characters');
    }
    if (!formData.style) {
        validationErrors.push('Please select a video style');
    }
    if (!formData.duration) {
        validationErrors.push('Please select video duration');
    }

    if (validationErrors.length > 0) {
        showResult({ error: validationErrors.join(', ') }, false);
        return;
    }
    
    // Show loading state
    showLoading();
    
    try {
        // Send data to backend
        const result = await sendToBackend(formData);
        
        if (result.success) {
            showResult(result.data, true);
        } else {
            showResult(result, false);
        }
    } catch (error) {
        showResult({ error: 'Network connection error, please try again later' }, false);
    } finally {
        // Hide loading state
        hideLoading();
    }
}

/**
 * Initialize application
 */
function initializeApp() {
    // Bind form submit event
    videoForm.addEventListener('submit', handleFormSubmit);
    
    console.log('AI Video Generator app initialized');
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
// DOM Elements
const videoForm = document.getElementById('videoForm');
const generateBtn = document.getElementById('generateBtn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');
const resultContainer = document.getElementById('resultContainer');
const resultData = document.getElementById('resultData');

// Form Elements
const videoTopicInput = document.getElementById('videoTopic');
const videoStyleSelect = document.getElementById('videoStyle');
const videoDurationSelect = document.getElementById('videoDuration');

// Backend API endpoint URL - THIS IS THE CORRECT URL TO YOUR VERCEL BACKEND
const API_ENDPOINT = 'https://ai-video-generator-server.vercel.app/generate';

/**
 * Send data to the backend API
 * @param {Object} data - JSON data to send
 */
async function sendToBackend(data) {
    try {
        console.log('Preparing to send data to backend:', data);

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.status === 429) {
            alert("Too many requests! Please wait a moment and try again.");
            return { success: false, error: "Too many requests" };
        }

        if (response.ok) {
            const result = await response.json();
            console.log('Backend response:', result);
            return { success: true, data: result };
        } else {
            throw new Error(`HTTP Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error occurred while sending to backend:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Show loading state
 */
function showLoading() {
    generateBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
}

/**
 * Hide loading state
 */
function hideLoading() {
    generateBtn.disabled = false;
    btnText.style.display = 'block';
    btnLoader.style.display = 'none';
}

/**
 * Show result
 * @param {Object} data - Data to display
 * @param {boolean} isSuccess - Whether it's a success result
 */
function showResult(data, isSuccess = true) {
    resultContainer.style.display = 'block';
    resultContainer.className = `result-container ${isSuccess ? 'success' : 'error'}`;
    
    if (isSuccess) {
        resultData.textContent = JSON.stringify(data, null, 2);
    } else {
        resultData.textContent = `Error: ${data.error || 'Unknown error'}`;
    }
    
    // Scroll to result area
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Collect form data
    const formData = {
        topic: videoTopicInput.value.trim(),
        style: videoStyleSelect.value,
        duration: videoDurationSelect.value,
        timestamp: new Date().toISOString()
    };
    
    // Validate data
    const validationErrors = [];
    if (!formData.topic || formData.topic.length < 2) {
        validationErrors.push('Video topic must be at least 2 characters');
    }
    if (!formData.style) {
        validationErrors.push('Please select a video style');
    }
    if (!formData.duration) {
        validationErrors.push('Please select video duration');
    }

    if (validationErrors.length > 0) {
        showResult({ error: validationErrors.join(', ') }, false);
        return;
    }
    
    // Show loading state
    showLoading();
    
    try {
        // Send data to backend
        const result = await sendToBackend(formData);
        
        if (result.success) {
            showResult(result.data, true);
        } else {
            showResult(result, false);
        }
    } catch (error) {
        showResult({ error: 'Network connection error, please try again later' }, false);
    } finally {
        // Hide loading state
        hideLoading();
    }
}

/**
 * Initialize application
 */
function initializeApp() {
    // Bind form submit event
    if (videoForm) {
        videoForm.addEventListener('submit', handleFormSubmit);
    }
    console.log('AI Video Generator app initialized');
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}