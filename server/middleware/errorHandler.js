/**
 * Global Error Handler Middleware
 */

export const errorHandler = (err, req, res, next) => {
    console.error('❌ Error occurred:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Default error status and message
    let status = err.status || 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        status = 400;
        message = 'Validation Error';
    } else if (err.name === 'UnauthorizedError') {
        status = 401;
        message = 'Unauthorized';
    } else if (err.name === 'CastError') {
        status = 400;
        message = 'Invalid ID format';
    } else if (err.code === 11000) {
        status = 409;
        message = 'Duplicate resource';
    }

    // Don't expose error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';

    const errorResponse = {
        error: message,
        status: status,
        timestamp: new Date().toISOString(),
        path: req.url,
        method: req.method
    };

    if (isDevelopment) {
        errorResponse.stack = err.stack;
        errorResponse.details = err.details || {};
    }

    res.status(status).json(errorResponse);
};