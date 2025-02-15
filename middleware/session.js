// middleware/session.js
const jwt = require('jsonwebtoken');

const sessionMiddleware = {
    async verifySession(req, res, next) {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Sesión no válida' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            
            // Check token expiration
            if (Date.now() >= decoded.exp * 1000) {
                return res.status(401).json({ error: 'Sesión expirada' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ error: 'Token inválido' });
        }
    }
};

module.exports = sessionMiddleware;