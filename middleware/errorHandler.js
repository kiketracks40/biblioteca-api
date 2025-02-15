const createHttpError = require('http-errors');

const errorHandler = {
    notFound(req, res, next) {
        next(createHttpError(404, 'Recurso no encontrado'));
    },

    generalError(err, req, res, next) {
        const status = err.status || 500;
        const message = err.message || 'Error interno del servidor';
        
        // Log error for debugging
        if (status === 500) {
            console.error('Error:', err);
        }

        res.status(status).json({
            error: {
                message,
                status,
                timestamp: new Date().toISOString(),
                path: req.originalUrl,
                method: req.method
            }
        });
    }
};

module.exports = errorHandler;