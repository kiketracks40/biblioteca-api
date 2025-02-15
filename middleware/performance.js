const performanceMiddleware = (req, res, next) => {
    const start = process.hrtime();

    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const duration = seconds * 1000 + nanoseconds / 1000000;
        
        console.log(`${req.method} ${req.url} completed in ${duration.toFixed(2)}ms`);
        
        // Log slow queries (more than 1 second)
        if (duration > 1000) {
            console.warn(`Slow request: ${req.method} ${req.url} took ${duration.toFixed(2)}ms`);
        }
    });

    next();
};

module.exports = performanceMiddleware;