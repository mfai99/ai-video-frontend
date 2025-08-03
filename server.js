const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Make.com Webhook URL (從環境變數讀取，確保安全性)
const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL || 'https://hook.make.com/key_23c9eacde6d13918a32e7c425575d251d5bab0c7d7eba27ae0b393f98dc3c91f5fd2c1fc3883e304c74fff1af0e9af01a9a9907b6bc2051e9e3ac0b74210b1a6';

// Middleware configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend-domain.vercel.app'] // Restrict origin in production
        : true // Allow all origins in development
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static file service (for development environment)
if (process.env.NODE_ENV !== 'production') {
    app.use(express.static(path.join(__dirname)));
}

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

/**
 * Send data to Make.com Webhook
 * @param {Object} data - Data to send
 */
async function sendToMakeWebhook(data) {
    try {
        console.log('發送數據到 Make.com:', data);
        
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.text();
            console.log('Make.com 回應:', result);
            return { success: true, data: result };
        } else {
            const errorText = await response.text();
            throw new Error(`Make.com Webhook Error: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.error('發送到 Make.com 時發生錯誤:', error);
        throw error;
    }
}

// API routes

/**
 * POST /generate - Receive frontend data and forward to Make.com
 */
app.post('/generate', async (req, res) => {
    try {
        const { topic, style, duration, timestamp } = req.body;
        
        // Validate required fields
        if (!topic || !style || !duration) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: topic, style, duration'
            });
        }
        
        // Validate data format
        if (typeof topic !== 'string' || topic.trim().length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Video topic must be at least 2 characters'
            });
        }
        
        if (typeof duration !== 'number' || duration <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Video duration must be a positive number'
            });
        }
        
        // Prepare data to send to Make.com
        const videoData = {
            topic: topic.trim(),
            style,
            duration,
            timestamp: timestamp || new Date().toISOString(),
            source: 'video-generator-app'
        };
        
        console.log('Received video generation request:', videoData);
        
        // Send to Make.com Webhook
        const makeResult = await sendToMakeWebhook(videoData);
        
        // Respond with success result
        res.json({
            success: true,
            message: 'Video generation request sent successfully',
            data: {
                requestId: `req_${Date.now()}`,
                videoData,
                makeResponse: makeResult.data
            }
        });
        
    } catch (error) {
        console.error('Error processing /generate request:', error);
        
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * GET /health - Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        webhookConfigured: !!MAKE_WEBHOOK_URL
    });
});

/**
 * GET / - Home route (development environment)
 */
app.get('/', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        res.json({
            message: 'Video Generator API Server',
            version: '1.0.0',
            endpoints: {
                generate: 'POST /generate',
                health: 'GET /health'
            }
        });
    } else {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

// 404 handling
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Requested resource not found',
        path: req.path
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Video Generator server started`);
    console.log(`📍 Server address: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Make.com Webhook: ${MAKE_WEBHOOK_URL ? 'Configured' : 'Not configured'}`);
    
    if (process.env.NODE_ENV !== 'production') {
        console.log(`\n📋 Available endpoints:`);
        console.log(`   GET  /        - Frontend page`);
        console.log(`   POST /generate - Video generation API`);
        console.log(`   GET  /health   - Health check`);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Received SIGTERM signal, shutting down server...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT signal, shutting down server...');
    process.exit(0);
});

module.exports = app;