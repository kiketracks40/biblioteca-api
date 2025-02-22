const createHttpError = require('http-errors');

// middleware/errorHandler.js
/*const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    if (err.sql) {
        return res.status(500).json({ 
            error: 'Error en base de datos',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }

    res.status(500).json({ 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};*/




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