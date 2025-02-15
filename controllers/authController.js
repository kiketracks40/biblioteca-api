// controllers/authController.js
const { poolPromise, sql } = require('../models/database');
const jwt = require('jsonwebtoken');
const passwordUtils = require('../utils/passwordUtils');
const jwtConfig = require('../config/jwt.config');

class AuthController {
    
           async login(req, res) {
            try {
                const { email, password } = req.body;
                const pool = await poolPromise;
                
                const result = await pool.request()
                    .input('email', sql.VarChar(150), email)
                    .input('password', sql.VarChar(255), password)
                    .query(`
                        SELECT UsuarioId, Nombre, Apellido, Email, Departamento, Rol
                        FROM Usuarios 
                        WHERE Email = @email AND Password = @password AND Estado = 1
                    `);
         
                if (result.recordset.length === 0) {
                    return res.status(401).json({ error: 'Credenciales inválidas' });
                }
         
                const user = result.recordset[0];
                const token = jwt.sign({ 
                    userId: user.UsuarioId,
                    rol: user.Rol  // Include rol in token
                }, jwtConfig.secret, { expiresIn: '24h' });
                
                // Store token in database
                const expirationDate = new Date();
                expirationDate.setHours(expirationDate.getHours() + 24);
        
                await pool.request()
                    .input('usuarioId', sql.Int, user.UsuarioId)
                    .input('token', sql.VarChar(500), token)
                    .input('fechaExpiracion', sql.DateTime, expirationDate)
                    .query(`
                        INSERT INTO UserTokens (UsuarioId, Token, FechaExpiracion)
                        VALUES (@usuarioId, @token, @fechaExpiracion)
                    `);
                
                    res.cookie('auth_token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        maxAge: 24 * 60 * 60 * 1000, // 24 hours
                        path: '/'
                    });
                
                return res.json({ token, user });
                
            } catch (error) {
                console.error('Login error:', error);
                return res.status(500).json({ error: error.message });
            }
        }
            
        async verifyToken(req, res) {
            try {
                const token = req.headers.authorization?.split(' ')[1];
                if (!token) {
                    return res.status(401).json({ error: 'Token no proporcionado' });
                }
    
                const pool = await poolPromise;
                
                // Check if token exists and is valid in database
                const tokenResult = await pool.request()
                    .input('token', sql.VarChar(500), token)
                    .query(`
                        SELECT u.UsuarioId, u.Nombre, u.Apellido, u.Email, u.Departamento
                        FROM UserTokens t
                        JOIN Usuarios u ON t.UsuarioId = u.UsuarioId
                        WHERE t.Token = @token 
                        AND t.Estado = 1
                        AND t.FechaExpiracion > GETDATE()
                    `);
    
                if (tokenResult.recordset.length === 0) {
                    return res.status(401).json({ error: 'Token inválido o expirado' });
                }
    
                res.json({ 
                    valid: true, 
                    user: tokenResult.recordset[0] 
                });
            } catch (error) {
                res.status(401).json({ error: 'Token inválido' });
            }
        }
    
       async logout(req, res) {
            try {
                const token = req.headers.authorization?.split(' ')[1];
                if (!token) {
                    return res.status(401).json({ error: 'Token no proporcionado' });
                }
    
                const pool = await poolPromise;
                
                // Invalidate token
                await pool.request()
                    .input('token', sql.VarChar(500), token)
                    .query(`
                        UPDATE UserTokens 
                        SET Estado = 0 
                        WHERE Token = @token
                    `);
    
                res.json({ message: 'Logout exitoso' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }
    

    async cambiarPassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = req.user.userId;
            const pool = await poolPromise;

            // Verify old password
            const result = await pool.request()
                .input('userId', sql.Int, userId)
                .query('SELECT Password FROM Usuarios WHERE UsuarioId = @userId');

            const validPassword = await passwordUtils.compare(oldPassword, result.recordset[0].Password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Contraseña actual incorrecta' });
            }

            // Hash new password
            const hashedPassword = await passwordUtils.hash(newPassword);

            // Update password
            await pool.request()
                .input('userId', sql.Int, userId)
                .input('password', sql.VarChar(255), hashedPassword)
                .query(`
                    UPDATE Usuarios 
                    SET Password = @password,
                        FechaModificacion = GETDATE()
                    WHERE UsuarioId = @userId
                `);

            res.json({ message: 'Contraseña actualizada exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    logout(req, res) {
        res.clearCookie('auth_token');
        res.json({ message: 'Sesión cerrada exitosamente' });
    }
}

module.exports = new AuthController();