// utils/logger.js
const { poolPromise, sql } = require('../models/database');

const Logger = {
    async logActivity(userId, action, table, recordId, beforeDetails, afterDetails, ip) {
        try {
            const pool = await poolPromise;
            await pool.request()
                .input('userId', sql.Int, userId)
                .input('action', sql.VarChar(50), action)
                .input('table', sql.VarChar(50), table)
                .input('recordId', sql.Int, recordId)
                .input('beforeDetails', sql.NVarChar(sql.MAX), JSON.stringify(beforeDetails))
                .input('afterDetails', sql.NVarChar(sql.MAX), JSON.stringify(afterDetails))
                .input('ip', sql.VarChar(50), ip)
                .query(`
                    INSERT INTO ActividadLog (UsuarioId, Accion, Tabla, RegistroId, DetalleAntes, 
                                            DetalleDespues, DireccionIP)
                    VALUES (@userId, @action, @table, @recordId, @beforeDetails, 
                            @afterDetails, @ip)
                `);
        } catch (error) {
            console.error('Error logging activity:', error);
        }
    }
};

module.exports = Logger;