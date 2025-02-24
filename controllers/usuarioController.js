const { poolPromise, sql } = require('../models/database');

class UsuarioController {
    async listar(req, res) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .query(`
                    SELECT UsuarioId, Nombre, Apellido, Email, Departamento, Rol
                    FROM Usuarios 
                    WHERE Estado = 1
                `);
            
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async crear(req, res) {
        try {
            const { nombre, apellido, email, password, departamento } = req.body;
            const pool = await poolPromise;
            
            const result = await pool.request()
                .input('nombre', sql.VarChar(100), nombre)
                .input('apellido', sql.VarChar(100), apellido)
                .input('email', sql.VarChar(150), email)
                .input('password', sql.VarChar(255), password)
                .input('departamento', sql.VarChar(100), departamento)
                .query(`
                    INSERT INTO Usuarios (
                        Nombre, 
                        Apellido, 
                        Email, 
                        Password, 
                        Departamento, 
                        UsuarioCreacion
                    )
                    VALUES (
                        @nombre, 
                        @apellido, 
                        @email, 
                        @password, 
                        @departamento, 
                        'SYSTEM'
                    );
                    SELECT SCOPE_IDENTITY() AS UsuarioId;
                `);
            
            res.status(201).json({ usuarioId: result.recordset[0].UsuarioId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async actualizar(req, res) {
      try {
          const { id } = req.params;
          const { nombre, apellido, email, password, departamento, rol } = req.body;
          const pool = await poolPromise;
          
          let query = `
              UPDATE Usuarios 
              SET Nombre = @nombre,
                  Apellido = @apellido,
                  Email = @email,
                  Departamento = @departamento,
                  Rol = @rol,
                  FechaModificacion = GETDATE(),
                  UsuarioModificacion = 'SYSTEM'
              WHERE UsuarioId = @id`;

          const request = pool.request()
              .input('id', sql.Int, id)
              .input('nombre', sql.VarChar(100), nombre)
              .input('apellido', sql.VarChar(100), apellido)
              .input('email', sql.VarChar(150), email)
              .input('departamento', sql.VarChar(100), departamento)
              .input('rol', sql.VarChar(20), rol);

          if (password) {
              query = query.replace(
                  'SET Nombre',
                  'SET Password = @password, Nombre'
              );
              request.input('password', sql.VarChar(255), password);
          }

          await request.query(query);
          
          res.json({ message: 'Usuario actualizado exitosamente' });
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  }

  async eliminar(req, res) {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('UPDATE Usuarios SET Estado = 0 WHERE UsuarioId = @id');
            
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
}

 // .. other existing methods

 async obtenerPrestamosPorUsuario(req, res) {
    try {
        const { fechaInicio, fechaFin } = req.query;
        const pool = await poolPromise;
        
        const result = await pool.request()
            .input('fechaInicio', sql.DateTime, fechaInicio)
            .input('fechaFin', sql.DateTime, fechaFin)
            .query(`
                SELECT 
                    u.Nombre + ' ' + u.Apellido as Usuario,
                    COUNT(p.PrestamoId) as TotalPrestamos,
                    MAX(p.FechaPrestamo) as UltimoPrestamo
                FROM Usuarios u
                LEFT JOIN Prestamos p ON u.UsuarioId = p.UsuarioId
                WHERE p.FechaPrestamo BETWEEN @fechaInicio AND @fechaFin
                    AND p.Estado = 1
                GROUP BY u.UsuarioId, u.Nombre, u.Apellido
                ORDER BY TotalPrestamos DESC
            `);
        
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
   }
}



module.exports = new UsuarioController();