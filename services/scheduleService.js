const cron = require('node-cron');
const { poolPromise, sql } = require('../models/database');
const NotificationService = require('./notificationService');

class ScheduleService {
    constructor(io) {
        this.notificationService = new NotificationService(io);
        this.initializeSchedules();
    }

    initializeSchedules() {
        // Check overdue loans every day at 9 AM
        cron.schedule('0 9 * * *', () => {
            this.checkOverdueLoans();
        });

        // Check book stock every hour
        cron.schedule('0 * * * *', () => {
            this.checkBookStock();
        });
    }

    async checkOverdueLoans() {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .query(`
                    SELECT p.PrestamoId, u.Nombre + ' ' + u.Apellido as Usuario,
                           l.Titulo, p.FechaDevolucionEsperada
                    FROM Prestamos p
                    JOIN Usuarios u ON p.UsuarioId = u.UsuarioId
                    JOIN Ejemplares e ON p.EjemplarId = e.EjemplarId
                    JOIN Libros l ON e.LibroId = l.LibroId
                    WHERE p.FechaDevolucionEsperada < GETDATE()
                    AND p.FechaDevolucionReal IS NULL
                `);

            if (result.recordset.length > 0) {
                this.notificationService.notifyVencimiento(result.recordset);
            }
        } catch (error) {
            console.error('Error checking overdue loans:', error);
        }
    }

    async checkBookStock() {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .query(`
                    SELECT l.LibroId, l.Titulo,
                           COUNT(e.EjemplarId) as TotalEjemplares,
                           SUM(CASE WHEN e.EstadoFisico = 'Disponible' THEN 1 ELSE 0 END) as Disponibles
                    FROM Libros l
                    LEFT JOIN Ejemplares e ON l.LibroId = e.LibroId
                    GROUP BY l.LibroId, l.Titulo
                    HAVING SUM(CASE WHEN e.EstadoFisico = 'Disponible' THEN 1 ELSE 0 END) < 2
                `);

            result.recordset.forEach(libro => {
                this.notificationService.notifyBajoStock(libro);
            });
        } catch (error) {
            console.error('Error checking book stock:', error);
        }
    }
}

module.exports = ScheduleService;