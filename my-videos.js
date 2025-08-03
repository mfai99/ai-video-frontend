/**
 * MY AI VEO Page JavaScript
 * Manages video status display and auto-updates
 */

class MyVideosManager {
    constructor() {
        this.videos = [];
        this.updateInterval = null;
        this.isLoading = false;
        
        // DOM elements
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.videosGrid = document.getElementById('videosGrid');
        this.noVideos = document.getElementById('noVideos');
        
        this.init();
    }
    
    /**
     * Initialize
     */
    init() {
        console.log('Initializing MY AI VEO page');
        this.loadVideos();
        this.startAutoUpdate();
    }
    
    /**
     * Load video list
     */
    async loadVideos() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();
        
        try {
            // 模擬API調用 - 在實際環境中這裡會是真實的API端點
            const videos = await this.fetchVideosFromAPI();
            this.videos = videos;
            this.renderVideos();
        } catch (error) {
            console.error('Failed to load video list:', error);
            this.showError();
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }
    
    /**
     * Fetch video list from API (simulated)
     */
    async fetchVideosFromAPI() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get submitted video requests from localStorage
        const savedVideos = localStorage.getItem('myVideos');
        if (savedVideos) {
            const videos = JSON.parse(savedVideos);
            // Simulate status updates
            return videos.map(video => {
                const now = Date.now();
                const timeDiff = now - video.submittedAt;
                
                // Simulate status change logic
                if (timeDiff > 300000) { // Complete after 5 minutes
                    video.status = 'completed';
                    video.estimatedTime = 'Completed';
                } else if (timeDiff > 60000) { // Update estimated time after 1 minute
                    video.status = 'processing';
                    const remainingMinutes = Math.ceil((300000 - timeDiff) / 60000);
                    video.estimatedTime = `About ${remainingMinutes} min`;
                }
                
                return video;
            });
        }
        
        // If no saved videos, return some sample data
        return [
            {
                id: 'demo_1',
                topic: 'Cute Moments of Cats Playing',
                status: 'completed',
                estimatedTime: 'Completed',
                style: 'Cute Style',
                duration: '30 seconds',
                submittedAt: Date.now() - 400000,
                downloadUrl: '#'
            },
            {
                id: 'demo_2',
                topic: 'City Night Scene Time-lapse',
                status: 'processing',
                estimatedTime: 'About 3 min',
                style: 'Professional Style',
                duration: '60 seconds',
                submittedAt: Date.now() - 120000
            },
            {
                id: 'demo_3',
                topic: 'Food Preparation Process',
                status: 'failed',
                estimatedTime: 'Processing Failed',
                style: 'Warm Style',
                duration: '45 seconds',
                submittedAt: Date.now() - 600000
            }
        ];
    }
    
    /**
     * Render video list
     */
    renderVideos() {
        if (this.videos.length === 0) {
            this.showNoVideos();
            return;
        }
        
        this.videosGrid.innerHTML = '';
        
        this.videos.forEach(video => {
            const cardElement = this.createVideoCard(video);
            this.videosGrid.appendChild(cardElement);
        });
        
        this.showVideosGrid();
    }
    
    /**
     * Create video card
     */
    createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <div class="video-title">${video.topic}</div>
            <div class="video-info">
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="status-badge status-${video.status}">
                        ${this.getStatusText(video.status)}
                    </span>
                </div>
                <div class="info-row">
                    <span class="info-label">Estimated Time:</span>
                    <span>${video.estimatedTime}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Style:</span>
                    <span>${video.style || 'Not specified'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Duration:</span>
                    <span>${video.duration || 'Not specified'}</span>
                </div>
            </div>
            ${video.status === 'completed' ? this.createDownloadButton(video) : ''}
        `;
        
        return card;
    }
    
    /**
     * Create download button
     */
    createDownloadButton(video) {
        return `
            <button class="download-btn" onclick="myVideosManager.downloadVideo('${video.id}')">
                📥 Download Video
            </button>
        `;
    }
    
    /**
     * Get status text
     */
    getStatusText(status) {
        const statusMap = {
            'processing': 'Processing',
            'completed': 'Completed',
            'failed': 'Failed'
        };
        return statusMap[status] || 'Unknown';
    }
    
    /**
     * Download video
     */
    downloadVideo(videoId) {
        const video = this.videos.find(v => v.id === videoId);
        if (video) {
            // Simulate download
            alert(`Starting download: ${video.topic}\n\nIn a real environment, this would trigger actual download functionality.`);
            console.log('Download video:', video);
        }
    }
    
    /**
     * Start auto-update
     */
    startAutoUpdate() {
        // Update every 30 seconds
        this.updateInterval = setInterval(() => {
            console.log('Auto-updating video status...');
            this.loadVideos();
        }, 30000);
        
        console.log('Auto-update started, updating every 30 seconds');
    }
    
    /**
     * Stop auto-update
     */
    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
            console.log('Auto-update stopped');
        }
    }
    
    /**
     * Show loading state
     */
    showLoading() {
        this.loadingIndicator.style.display = 'block';
        this.videosGrid.style.display = 'none';
        this.noVideos.style.display = 'none';
    }
    
    /**
     * Hide loading state
     */
    hideLoading() {
        this.loadingIndicator.style.display = 'none';
    }
    
    /**
     * Show videos grid
     */
    showVideosGrid() {
        this.videosGrid.style.display = 'grid';
        this.noVideos.style.display = 'none';
    }
    
    /**
     * Show no videos state
     */
    showNoVideos() {
        this.videosGrid.style.display = 'none';
        this.noVideos.style.display = 'block';
    }
    
    /**
     * Show error state
     */
    showError() {
        this.videosGrid.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ef4444;">
                <h3>Loading Failed</h3>
                <p>Unable to load video list, please try again later</p>
                <button onclick="myVideosManager.loadVideos()" style="
                    padding: 8px 16px;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 10px;
                ">Reload</button>
            </div>
        `;
        this.showVideosGrid();
    }
    
    /**
     * Manual refresh
     */
    refresh() {
        this.loadVideos();
    }
}

// 全域變數
let myVideosManager;

// 頁面載入完成後初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        myVideosManager = new MyVideosManager();
    });
} else {
    myVideosManager = new MyVideosManager();
}

// 頁面卸載時清理
window.addEventListener('beforeunload', () => {
    if (myVideosManager) {
        myVideosManager.stopAutoUpdate();
    }
});

// 開發工具
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('MY AI VEO page development mode enabled');
    
    // Add test video to localStorage
    window.addTestVideo = function() {
        const testVideo = {
            id: 'test_' + Date.now(),
            topic: 'Test Video - ' + new Date().toLocaleTimeString(),
            status: 'processing',
            estimatedTime: 'About 2 min',
            style: 'Test Style',
            duration: '30 seconds',
            submittedAt: Date.now()
        };
        
        const savedVideos = localStorage.getItem('myVideos');
        const videos = savedVideos ? JSON.parse(savedVideos) : [];
        videos.push(testVideo);
        localStorage.setItem('myVideos', JSON.stringify(videos));
        
        if (myVideosManager) {
            myVideosManager.refresh();
        }
        
        console.log('Test video added:', testVideo);
    };
    
    // Clear all videos
    window.clearAllVideos = function() {
        localStorage.removeItem('myVideos');
        if (myVideosManager) {
            myVideosManager.refresh();
        }
        console.log('All videos cleared');
    };
    
    console.log('Development tools loaded:');
    console.log('- addTestVideo(): Add test video');
    console.log('- clearAllVideos(): Clear all videos');
    console.log('- myVideosManager.refresh(): Manual refresh');
}