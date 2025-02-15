// controllers/autorController.js
const { poolPromise, sql } = require('../models/database');

class AutorController {
  async crear(req, res) {
    try {
      const { nombre, apellido } = req.body;
      const pool = await poolPromise;
      
      const result = await pool.request()
        .input('nombre', sql.VarChar(100), nombre)
        .input('apellido', sql.VarChar(100), apellido)
        .query(`
          INSERT INTO Autores (Nombre, Apellido, UsuarioCreacion)
          VALUES (@nombre, @apellido, 'SYSTEM');
          SELECT SCOPE_IDENTITY() AS AutorId;
        `);
      
      res.status(201).json({ autorId: result.recordset[0].AutorId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listar(req, res) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .query('SELECT * FROM Autores WHERE Estado = 1');
      res.json(result.recordset);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async obtenerLibrosPorAutor(req, res) {
    try {
      const pool = await poolPromise;
      const result = await pool.request().execute('sp_LibrosPorAutor');
      res.json(result.recordset);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AutorController();