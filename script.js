// DOM Elements
const videoForm = document.getElementById('videoForm');
const generateBtn = document.getElementById('generateBtn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');
const resultContainer = document.getElementById('resultContainer');
const resultData = document.getElementById('resultData');

// Backend API endpoint URL (modify according to actual deployment)
// const API_ENDPOINT = '/generate'; // Use relative path for local development
const API_ENDPOINT = 'https://ai-video-generator-server.vercel.app/generate'; // Use full URL for deployment

/**
 * Send data to backend API (Demo mode - simulates backend response)
 * @param {Object} data - JSON data to send
 */
async function sendToBackend(data) {
    try {
        console.log('Preparing to send data to backend:', data);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate successful response
        const mockResponse = {
            success: true,
            message: 'Video generation request received successfully!',
            videoId: 'demo_' + Date.now(),
            status: 'processing',
            estimatedTime: '5-10 minutes',
            webhook: 'https://hook.eu2.make.com/pjvxygrwnhq69w79t7l2wvama6qdkk8i',
            data: data
        };
        
        console.log('Backend response (simulated):', mockResponse);
        return { success: true, data: mockResponse };
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
 * Validate form data
 * @param {Object} formData - Form data
 */
function validateFormData(formData) {
    const errors = [];
    
    if (!formData.topic || formData.topic.trim().length < 2) {
        errors.push('Video topic must be at least 2 characters');
    }
    
    if (!formData.style) {
        errors.push('Please select a video style');
    }
    
    if (!formData.duration) {
        errors.push('Please select video duration');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Collect form data
 */
function collectFormData() {
    return {
        topic: document.getElementById('topic').value.trim(),
        style: document.getElementById('style').value,
        duration: parseInt(document.getElementById('duration').value),
        timestamp: new Date().toISOString()
    };
}

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Collect form data
    const formData = collectFormData();
    
    // Validate data
    const validation = validateFormData(formData);
    if (!validation.isValid) {
        showResult({ error: validation.errors.join(', ') }, false);
        return;
    }
    
    // Show loading state
    showLoading();
    
    try {
        // Send data to backend
        const result = await sendToBackend(formData);
        
        if (result.success) {
            // Save video request to localStorage
            saveVideoRequest(formData, result.data);
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
 * Save video request to localStorage
 */
function saveVideoRequest(formData, responseData) {
    try {
        const videoRequest = {
            id: responseData.videoId || 'video_' + Date.now(),
            topic: formData.topic,
            status: 'processing',
            estimatedTime: responseData.estimatedTime || '5-10 minutes',
            style: formData.style,
            duration: formData.duration,
            submittedAt: Date.now(),
            webhook: responseData.webhook
        };
        
        // Get existing video list
        const savedVideos = localStorage.getItem('myVideos');
        const videos = savedVideos ? JSON.parse(savedVideos) : [];
        
        // Add new video request
        videos.unshift(videoRequest); // Use unshift to put the newest at the front
        
        // Limit to saving 50 requests
        if (videos.length > 50) {
            videos.splice(50);
        }
        
        // Save back to localStorage
        localStorage.setItem('myVideos', JSON.stringify(videos));
        
        console.log('Video request saved:', videoRequest);
    } catch (error) {
        console.error('Failed to save video request:', error);
    }
}

/**
 * Initialize application
 */
function initializeApp() {
    // Bind form submit event
    videoForm.addEventListener('submit', handleFormSubmit);
    
    // Add real-time validation
    const inputs = videoForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '#e1e5e9';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(220, 53, 69)') {
                this.style.borderColor = '#e1e5e9';
            }
        });
    });
    
    // Add keyboard shortcut support
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            if (!generateBtn.disabled) {
                handleFormSubmit(new Event('submit'));
            }
        }
    });
    
    console.log('AI Video Factory app initialized');
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export functions for external use
window.VideoGenerator = {
    sendToBackend,
    collectFormData,
    validateFormData,
    showResult
};

// Development mode testing tools
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Development mode enabled');
    
    // Test data fill function
    window.fillTestData = function() {
        document.getElementById('topic').value = 'Technology Product Introduction';
        document.getElementById('style').value = 'professional';
        document.getElementById('duration').value = '60';
        console.log('Test data filled');
    };
    
    // Clear form function
    window.clearForm = function() {
        videoForm.reset();
        resultContainer.style.display = 'none';
        console.log('Form cleared');
    };
    
    console.log('Development tools loaded:');
    console.log('- fillTestData(): Fill test data');
    console.log('- clearForm(): Clear form');
    console.log('- VideoGenerator: Main API object');
}