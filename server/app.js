/**
 * AI Question Generator v2.0 - Main Server Application
 * Enhanced with Gemini API Integration and Real-time Collaboration
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import aiRoutes from './routes/ai.js';
import questionsRoutes from './routes/questions.js';
import collaborationRoutes from './routes/collaboration.js';
import analyticsRoutes from './routes/analytics.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

// Import services
import { WebSocketService } from './services/websocketService.js';

// Environment configuration
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "ws:", "wss:"]
        }
    }
}));

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Serve static files
app.use(express.static(path.join(__dirname, '../')));

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        version: process.env.APP_VERSION || '2.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API status endpoint
app.get('/api/status', (req, res) => {
    res.json({
        message: 'AI Question Generator v2.0 API is running',
        features: [
            'Gemini AI Integration',
            'Real-time Collaboration',
            'Enhanced Question Generation',
            'Quality Validation System',
            'Advanced Analytics'
        ],
        endpoints: {
            ai: '/api/ai',
            questions: '/api/questions',
            collaboration: '/api/collaboration',
            analytics: '/api/analytics'
        }
    });
});

// Catch-all handler for SPA
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return next();
    }
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Error handling middleware
app.use(errorHandler);

// Create HTTP server
const server = createServer(app);

// WebSocket server setup
const wss = new WebSocketServer({ 
    server,
    path: '/ws'
});

// Initialize WebSocket service
const wsService = new WebSocketService(wss);

// Server startup
server.listen(PORT, () => {
    console.log(`
    🚀 AI Question Generator v2.0 Server Started!
    
    📍 Server: http://localhost:${PORT}
    🌐 API Base: http://localhost:${PORT}/api
    🔌 WebSocket: ws://localhost:${PORT}/ws
    
    📊 Health Check: http://localhost:${PORT}/api/health
    📈 Status: http://localhost:${PORT}/api/status
    
    🔧 Environment: ${process.env.NODE_ENV || 'development'}
    🧠 AI Model: ${process.env.GEMINI_MODEL || 'gemini-1.5-pro'}
    
    Ready to generate medical exam questions with AI! 🏥✨
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received, shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

export default app;