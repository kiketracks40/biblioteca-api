// controllers/libroController.js
const { poolPromise, sql } = require('../models/database');

class LibroController {
    async listar(req, res) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .query(`
                    SELECT l.LibroId, l.Titulo, l.ISBN, l.AnioPublicacion, l.Editorial,
                           c.Nombre as Categoria
                    FROM Libros l
                    JOIN Categorias c ON l.CategoriaId = c.CategoriaId
                    WHERE l.Estado = 1
                `);
            
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async crear(req, res) {
        try {
            const { titulo, isbn, categoriaId, anioPublicacion, editorial, autores } = req.body;
            const pool = await poolPromise;
            
            const result = await pool.request()
                .input('titulo', sql.VarChar(255), titulo)
                .input('isbn', sql.VarChar(13), isbn)
                .input('categoriaId', sql.Int, categoriaId)
                .input('anioPublicacion', sql.Int, anioPublicacion)
                .input('editorial', sql.VarChar(100), editorial)
                .query(`
                    INSERT INTO Libros (
                        Titulo, ISBN, CategoriaId, AnioPublicacion, Editorial, UsuarioCreacion
                    )
                    VALUES (
                        @titulo, @isbn, @categoriaId, @anioPublicacion, @editorial, 'SYSTEM'
                    );
                    SELECT SCOPE_IDENTITY() AS LibroId;
                `);
            
            res.status(201).json({ libroId: result.recordset[0].LibroId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { titulo, isbn, categoriaId, anioPublicacion, editorial } = req.body;
            const pool = await poolPromise;
            
            await pool.request()
                .input('id', sql.Int, id)
                .input('titulo', sql.VarChar(255), titulo)
                .input('isbn', sql.VarChar(13), isbn)
                .input('categoriaId', sql.Int, categoriaId)
                .input('anioPublicacion', sql.Int, anioPublicacion)
                .input('editorial', sql.VarChar(100), editorial)
                .query(`
                    UPDATE Libros 
                    SET Titulo = @titulo,
                        ISBN = @isbn,
                        CategoriaId = @categoriaId,
                        AnioPublicacion = @anioPublicacion,
                        Editorial = @editorial,
                        FechaModificacion = GETDATE(),
                        UsuarioModificacion = 'SYSTEM'
                    WHERE LibroId = @id AND Estado = 1
                `);
            
            res.json({ message: 'Libro actualizado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const { id } = req.params;
            const pool = await poolPromise;
            
            await pool.request()
                .input('id', sql.Int, id)
                .query(`
                    UPDATE Libros 
                    SET Estado = 0,
                        FechaModificacion = GETDATE(),
                        UsuarioModificacion = 'SYSTEM'
                    WHERE LibroId = @id
                `);
            
            res.json({ message: 'Libro eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    async obtenerInventario(req, res) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .execute('sp_InventarioLibros');
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new LibroController();