// controllers/ejemplarController.js
const { poolPromise, sql } = require('../models/database');

class EjemplarController {
  async crear(req, res) {
    try {
      const { libroId, codigoEjemplar, tipoPrestamo } = req.body;
      const pool = await poolPromise;
      
      const result = await pool.request()
        .input('libroId', sql.Int, libroId)
        .input('codigoEjemplar', sql.VarChar(50), codigoEjemplar)
        .input('tipoPrestamo', sql.VarChar(20), tipoPrestamo)
        .query(`
          INSERT INTO Ejemplares (LibroId, CodigoEjemplar, TipoPrestamo, EstadoFisico, UsuarioCreacion)
          VALUES (@libroId, @codigoEjemplar, @tipoPrestamo, 'Disponible', 'SYSTEM');
          SELECT SCOPE_IDENTITY() AS EjemplarId;
        `);
      
      res.status(201).json({ ejemplarId: result.recordset[0].EjemplarId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async actualizarEstado(req, res) {
    try {
      const { ejemplarId } = req.params;
      const { estadoFisico } = req.body;
      const pool = await poolPromise;
      
      await pool.request()
        .input('ejemplarId', sql.Int, ejemplarId)
        .input('estadoFisico', sql.VarChar(20), estadoFisico)
        .query(`
          UPDATE Ejemplares 
          SET EstadoFisico = @estadoFisico, 
              FechaModificacion = GETDATE(),
              UsuarioModificacion = 'SYSTEM'
          WHERE EjemplarId = @ejemplarId;
        `);
      
      res.json({ message: 'Estado actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new EjemplarController();