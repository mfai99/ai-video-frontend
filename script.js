// DOM 元素
const videoForm = document.getElementById('videoForm');
const generateBtn = document.getElementById('generateBtn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');
const resultContainer = document.getElementById('resultContainer');
const resultData = document.getElementById('resultData');

// 表單元素
const videoTopicInput = document.getElementById('videoTopic');
const videoStyleSelect = document.getElementById('videoStyle');
const videoDurationSelect = document.getElementById('videoDuration');

// Make.com Webhook URL with API Key
const MAKE_WEBHOOK_URL = 'https://hook.make.com/key_23c9eacde6d13918a32e7c425575d251d5bab0c7d7eba27ae0b393f98dc3c91f5fd2c1fc3883e304c74fff1af0e9af01a9a9907b6bc2051e9e3ac0b74210b1a6';

/**
 * 發送數據到 Make.com 的函式
 * @param {Object} data - 要發送的 JSON 數據
 */
async function sendToMakeAPI(data) {
    try {
        console.log('準備發送數據到 Make.com:', data);
        
        // 發送 POST 請求到 Make.com Webhook
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Make.com 回應:', result);
            return { success: true, data: result };
        } else {
            throw new Error(`HTTP Error: ${response.status}`);
        }
    } catch (error) {
        console.error('發送到 Make.com 時發生錯誤:', error);
        return { success: false, error: error.message };
    }
}

/**
 * 顯示加載狀態
 */
function showLoading() {
    generateBtn.disabled = true;
    btnText.style.opacity = '0';
    btnLoader.style.display = 'flex';
}

/**
 * 隱藏加載狀態
 */
function hideLoading() {
    generateBtn.disabled = false;
    btnText.style.opacity = '1';
    btnLoader.style.display = 'none';
}

/**
 * 顯示結果
 * @param {Object} data - 要顯示的數據
 * @param {boolean} isSuccess - 是否成功
 */
function showResult(data, isSuccess = true) {
    resultData.textContent = JSON.stringify(data, null, 2);
    resultContainer.style.display = 'block';
    
    // 滾動到結果區域
    resultContainer.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
    
    // 根據成功或失敗設置不同的樣式
    if (isSuccess) {
        resultContainer.style.borderColor = '#38a169';
        resultContainer.style.backgroundColor = '#f0fff4';
    } else {
        resultContainer.style.borderColor = '#e53e3e';
        resultContainer.style.backgroundColor = '#fff5f5';
    }
}

/**
 * 驗證表單數據
 * @param {Object} formData - 表單數據
 * @returns {Object} 驗證結果
 */
function validateFormData(formData) {
    const errors = [];
    
    if (!formData.topic || formData.topic.trim().length < 5) {
        errors.push('影片主題至少需要 5 個字符');
    }
    
    if (!formData.style) {
        errors.push('請選擇影片風格');
    }
    
    if (!formData.duration) {
        errors.push('請選擇影片長度');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * 收集表單數據並打包成 JSON
 * @returns {Object} 表單數據 JSON 物件
 */
function collectFormData() {
    const formData = {
        topic: videoTopicInput.value.trim(),
        style: videoStyleSelect.value,
        duration: videoDurationSelect.value,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language || 'zh-TW'
    };
    
    return formData;
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
        alert('請檢查以下問題：\n' + validation.errors.join('\n'));
        return;
    }
    
    // 顯示加載狀態
    showLoading();
    
    try {
        // 模擬處理時間（實際使用時可以移除）
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 發送到 Make.com
        const result = await sendToMakeAPI(formData);
        
        if (result.success) {
            // 成功時顯示發送的數據和回應
            showResult({
                message: '影片生成請求已成功發送！',
                sentData: formData,
                response: result.data
            }, true);
        } else {
            // 失敗時顯示錯誤信息
            showResult({
                message: '發送失敗',
                error: result.error,
                sentData: formData
            }, false);
        }
        
    } catch (error) {
        console.error('處理表單時發生錯誤:', error);
        showResult({
            message: '處理請求時發生錯誤',
            error: error.message,
            sentData: formData
        }, false);
    } finally {
        // 隱藏加載狀態
        hideLoading();
    }
}

/**
 * 初始化應用程式
 */
function initializeApp() {
    // 綁定表單提交事件
    videoForm.addEventListener('submit', handleFormSubmit);
    
    // 綁定輸入框事件以提供即時反饋
    videoTopicInput.addEventListener('input', function() {
        const length = this.value.trim().length;
        if (length > 0 && length < 5) {
            this.style.borderColor = '#f56565';
        } else if (length >= 5) {
            this.style.borderColor = '#48bb78';
        } else {
            this.style.borderColor = '#e2e8f0';
        }
    });
    
    // 綁定選擇框事件
    [videoStyleSelect, videoDurationSelect].forEach(select => {
        select.addEventListener('change', function() {
            if (this.value) {
                this.style.borderColor = '#48bb78';
            } else {
                this.style.borderColor = '#e2e8f0';
            }
        });
    });
    
    // 添加鍵盤快捷鍵支持
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + Enter 提交表單
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            if (!generateBtn.disabled) {
                handleFormSubmit(new Event('submit'));
            }
        }
    });
    
    console.log('AI Video Generator 應用程式已初始化');
}

// 當 DOM 加載完成時初始化應用程式
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// 導出函式供外部使用（如果需要）
window.AIVideoGenerator = {
    sendToMakeAPI,
    collectFormData,
    validateFormData
};

// 開發模式下的額外功能
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('開發模式已啟用');
    
    // 添加測試數據填充功能
    window.fillTestData = function() {
        videoTopicInput.value = '一個關於太空探險的科幻短片，主角是一位勇敢的宇航員';
        videoStyleSelect.value = '科幻';
        videoDurationSelect.value = '30秒';
        console.log('測試數據已填充');
    };
    
    // 添加清空表單功能
    window.clearForm = function() {
        videoForm.reset();
        resultContainer.style.display = 'none';
        console.log('表單已清空');
    };
    
    console.log('開發工具已加載：');
    console.log('- fillTestData(): 填充測試數據');
    console.log('- clearForm(): 清空表單');
    console.log('- AIVideoGenerator: 主要 API 物件');
}