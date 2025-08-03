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
            webhook: 'https://hook.us1.make.com/your-webhook-url',
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
 * 收集表單數據
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
 * 處理表單提交
 * @param {Event} event - 表單提交事件
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // 收集表單數據
    const formData = collectFormData();
    
    // 驗證數據
    const validation = validateFormData(formData);
    if (!validation.isValid) {
        showResult({ error: validation.errors.join(', ') }, false);
        return;
    }
    
    // 顯示加載狀態
    showLoading();
    
    try {
        // 發送數據到後端
        const result = await sendToBackend(formData);
        
        if (result.success) {
            // 保存影片請求到localStorage
            saveVideoRequest(formData, result.data);
            showResult(result.data, true);
        } else {
            showResult(result, false);
        }
    } catch (error) {
        showResult({ error: '網路連接錯誤，請稍後再試' }, false);
    } finally {
        // 隱藏加載狀態
        hideLoading();
    }
}

/**
 * 保存影片請求到localStorage
 */
function saveVideoRequest(formData, responseData) {
    try {
        const videoRequest = {
            id: responseData.videoId || 'video_' + Date.now(),
            topic: formData.topic,
            status: 'processing',
            estimatedTime: responseData.estimatedTime || '5-10分鐘',
            style: formData.style,
            duration: formData.duration,
            submittedAt: Date.now(),
            webhook: responseData.webhook
        };
        
        // 獲取現有的影片列表
        const savedVideos = localStorage.getItem('myVideos');
        const videos = savedVideos ? JSON.parse(savedVideos) : [];
        
        // 添加新的影片請求
        videos.unshift(videoRequest); // 使用unshift讓最新的在前面
        
        // 限制最多保存50個請求
        if (videos.length > 50) {
            videos.splice(50);
        }
        
        // 保存回localStorage
        localStorage.setItem('myVideos', JSON.stringify(videos));
        
        console.log('影片請求已保存:', videoRequest);
    } catch (error) {
        console.error('保存影片請求失敗:', error);
    }
}

/**
 * 初始化應用程式
 */
function initializeApp() {
    // 綁定表單提交事件
    videoForm.addEventListener('submit', handleFormSubmit);
    
    // 添加即時驗證
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
    
    // 添加鍵盤快捷鍵支援
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            if (!generateBtn.disabled) {
                handleFormSubmit(new Event('submit'));
            }
        }
    });
    
    console.log('AI Video Factory 應用程式已初始化');
}

// 當 DOM 載入完成時初始化應用程式
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// 導出函數供外部使用
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