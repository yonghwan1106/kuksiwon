/**
 * Request Logging Middleware
 */

export const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    
    // Log incoming request
    console.log(`📝 ${req.method} ${req.url} - ${req.ip} - ${new Date().toISOString()}`);
    
    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function(...args) {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;
        
        // Determine log level based on status code
        const logLevel = statusCode >= 400 ? '❌' : statusCode >= 300 ? '⚠️' : '✅';
        
        console.log(`${logLevel} ${req.method} ${req.url} - ${statusCode} - ${duration}ms`);
        
        // Call original end method
        originalEnd.apply(res, args);
    };
    
    next();
};