
const { poolPromise, sql } = require('../models/database');

class ReporteController {

async generarReporte(req, res) {
    try {
        const { tipoReporte, fechaInicio, fechaFin } = req.query;
        const pool = await poolPromise;
        
        let query;
        switch(tipoReporte) {
            case 'prestamos':
                query = `
                    SELECT 
                        u.Nombre + ' ' + u.Apellido as Usuario,
                        l.Titulo,
                        p.FechaPrestamo,
                        p.FechaDevolucionReal
                    FROM Prestamos p
                    JOIN Usuarios u ON p.UsuarioId = u.UsuarioId
                    JOIN Libros l ON p.LibroId = l.LibroId
                    WHERE p.FechaPrestamo BETWEEN @fechaInicio AND @fechaFin
                `;
                break;
            // Add other report types...
            default:
                return res.status(400).json({ error: 'Tipo de reporte no válido' });
        }

        const result = await pool.request()
            .input('fechaInicio', sql.DateTime, fechaInicio)
            .input('fechaFin', sql.DateTime, fechaFin)
            .query(query);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error generando reporte:', error);
        res.status(500).json({ error: 'Error generando reporte' });
    }
  }

}

module.exports = new ReporteController();