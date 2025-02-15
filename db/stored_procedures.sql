CREATE PROCEDURE sp_EjemplaresPrestadosPorPeriodo
    @FechaInicio DATETIME,
    @FechaFin DATETIME
AS
BEGIN
    SELECT 
        l.Titulo,
        e.CodigoEjemplar,
        p.FechaPrestamo,
        p.FechaDevolucionReal,
        u.Nombre + ' ' + u.Apellido as Usuario
    FROM Prestamos p
    INNER JOIN Ejemplares e ON p.EjemplarId = e.EjemplarId
    INNER JOIN Libros l ON e.LibroId = l.LibroId
    INNER JOIN Usuarios u ON p.UsuarioId = u.UsuarioId
    WHERE p.FechaPrestamo BETWEEN @FechaInicio AND @FechaFin
    AND p.Estado = 1
    ORDER BY p.FechaPrestamo;
END;
GO

CREATE PROCEDURE sp_PrestamosPorUsuarioPeriodo
    @FechaInicio DATETIME,
    @FechaFin DATETIME
AS
BEGIN
    SELECT 
        u.UsuarioId,
        u.Nombre + ' ' + u.Apellido as Usuario,
        l.Titulo,
        p.FechaPrestamo,
        p.FechaDevolucionReal
    FROM Usuarios u
    INNER JOIN Prestamos p ON u.UsuarioId = p.UsuarioId
    INNER JOIN Ejemplares e ON p.EjemplarId = e.EjemplarId
    INNER JOIN Libros l ON e.LibroId = l.LibroId
    WHERE p.FechaPrestamo BETWEEN @FechaInicio AND @FechaFin
    AND p.Estado = 1
    ORDER BY u.Apellido, u.Nombre, p.FechaPrestamo;
END;
GO

CREATE PROCEDURE sp_TiempoTotalPrestamosPorLibro
AS
BEGIN
    SELECT 
        l.Titulo,
        COUNT(p.PrestamoId) as TotalPrestamos,
        SUM(DATEDIFF(HOUR, p.FechaPrestamo, 
            COALESCE(p.FechaDevolucionReal, GETDATE()))) as HorasTotales
    FROM Libros l
    INNER JOIN Ejemplares e ON l.LibroId = e.LibroId
    INNER JOIN Prestamos p ON e.EjemplarId = p.EjemplarId
    WHERE l.Estado = 1 AND p.Estado = 1
    GROUP BY l.LibroId, l.Titulo
    ORDER BY l.Titulo;
END;
GO

CREATE PROCEDURE sp_InventarioLibros
AS
BEGIN
    SELECT 
        l.Titulo,
        COUNT(e.EjemplarId) as TotalEjemplares,
        SUM(CASE WHEN e.EstadoFisico = 'Disponible' THEN 1 ELSE 0 END) as EjemplaresLibres,
        SUM(CASE WHEN e.EstadoFisico = 'Prestado' THEN 1 ELSE 0 END) as EjemplaresPrestados,
        SUM(CASE WHEN e.EstadoFisico = 'Reparacion' THEN 1 ELSE 0 END) as EjemplaresReparacion
    FROM Libros l
    LEFT JOIN Ejemplares e ON l.LibroId = e.LibroId
    WHERE l.Estado = 1
    GROUP BY l.LibroId, l.Titulo
    ORDER BY l.Titulo;
END;
GO

CREATE PROCEDURE sp_LibrosPorAutor
AS
BEGIN
    SELECT 
        a.Nombre + ' ' + a.Apellido as Autor,
        STRING_AGG(l.Titulo, ', ') as Libros
    FROM Autores a
    INNER JOIN LibrosAutores la ON a.AutorId = la.AutorId
    INNER JOIN Libros l ON la.LibroId = l.LibroId
    WHERE a.Estado = 1 AND l.Estado = 1
    GROUP BY a.AutorId, a.Nombre, a.Apellido
    ORDER BY a.Apellido, a.Nombre;
END;
GO