const { poolPromise, sql } = require('../models/database');

class CategoriaController {
    async listar(req, res) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .query('SELECT * FROM Categorias WHERE Estado = 1');
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async crear(req, res) {
        try {
            const { nombre, descripcion } = req.body;
            const pool = await poolPromise;
            
            const result = await pool.request()
                .input('nombre', sql.VarChar(100), nombre)
                .input('descripcion', sql.VarChar(255), descripcion)
                .query(`
                    INSERT INTO Categorias (Nombre, Descripcion, UsuarioCreacion)
                    VALUES (@nombre, @descripcion, 'SYSTEM');
                    SELECT SCOPE_IDENTITY() AS CategoriaId;
                `);
            
            res.status(201).json({ categoriaId: result.recordset[0].CategoriaId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new CategoriaController();