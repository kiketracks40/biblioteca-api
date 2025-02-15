// middleware/auth.js
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');   



const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        console.log('Decoded token:', decoded)
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}
module.exports = authMiddleware;