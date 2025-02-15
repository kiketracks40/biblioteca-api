// controllers/prestamoController.js
const { poolPromise, sql } = require('../models/database');
const Logger = require('../utils/logger');
const NotificationService = require('../services/notificationService');


class PrestamoController {
  async crearPrestamo(req, res) {
      try {
          const { usuarioId, ejemplarId, fechaDevolucionEsperada } = req.body;
          const pool = await poolPromise;
          
          const transaction = new sql.Transaction(pool);
          await transaction.begin();
          
          try {
              // Create loan
              const result = await transaction.request()
                  .input('usuarioId', sql.Int, usuarioId)
                  .input('ejemplarId', sql.Int, ejemplarId)
                  .input('fechaDevolucion', sql.DateTime, fechaDevolucionEsperada)
                  .query(`
                      INSERT INTO Prestamos (UsuarioId, EjemplarId, FechaDevolucionEsperada, UsuarioCreacion)
                      VALUES (@usuarioId, @ejemplarId, @fechaDevolucion, 'SYSTEM');
                      SELECT SCOPE_IDENTITY() AS PrestamoId;
                  `);

              const prestamoId = result.recordset[0].PrestamoId;

              // Update ejemplar status
              await transaction.request()
                  .input('ejemplarId', sql.Int, ejemplarId)
                  .query(`
                      UPDATE Ejemplares 
                      SET EstadoFisico = 'Prestado'
                      WHERE EjemplarId = @ejemplarId
                  `);

              await transaction.commit();

              // Log activity
              await Logger.logActivity(
                  req.user.userId,
                  'CREATE',
                  'Prestamos',
                  prestamoId,
                  null,
                  { usuarioId, ejemplarId, fechaDevolucionEsperada },
                  req.ip
              );

              const io = req.app.get('io');
              const notificationService = new NotificationService(io);
              notificationService.notifyPrestamo({
                  prestamoId,
                  usuario: nombreUsuario,
                  libro: tituloLibro,
                  fechaDevolucion: fechaDevolucionEsperada
              });

              res.status(201).json({ prestamoId });
          } catch (error) {
              await transaction.rollback();
              throw error;
          }
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  }


  async registrarDevolucion(req, res) {
    try {
      const { prestamoId } = req.params;
      const pool = await poolPromise;
      
      const transaction = new sql.Transaction(pool);
      await transaction.begin();
      
      try {
        const result = await transaction.request()
          .input('prestamoId', sql.Int, prestamoId)
          .input('fechaDevolucion', sql.DateTime, new Date())
          .query(`
            UPDATE Prestamos 
            SET FechaDevolucionReal = @fechaDevolucion
            WHERE PrestamoId = @prestamoId;

            UPDATE e
            SET e.EstadoFisico = 'Disponible'
            FROM Ejemplares e
            INNER JOIN Prestamos p ON e.EjemplarId = p.EjemplarId
            WHERE p.PrestamoId = @prestamoId;
          `);

        await transaction.commit();
        res.json({ message: 'Devolución registrada exitosamente' });
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async obtenerReportePrestamos(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      const pool = await poolPromise;
      
      const result = await pool.request()
        .input('fechaInicio', sql.DateTime, fechaInicio)
        .input('fechaFin', sql.DateTime, fechaFin)
        .execute('sp_EjemplaresPrestadosPorPeriodo');
      
      res.json(result.recordset);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
async listar (req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM Prestamos WHERE Estado = 1');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

}

module.exports = new PrestamoController();