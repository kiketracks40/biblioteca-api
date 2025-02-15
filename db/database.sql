-- Usuarios (Users)
CREATE TABLE Usuarios (
    UsuarioId INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Password VARCHAR(30) UNIQUE NOT NULL,
    Departamento VARCHAR(100),
    Estado BIT DEFAULT 1,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    UsuarioCreacion VARCHAR(50),
    FechaModificacion DATETIME,
    UsuarioModificacion VARCHAR(50)
);

-- Autores (Authors)
CREATE TABLE Autores (
    AutorId INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Estado BIT DEFAULT 1,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    UsuarioCreacion VARCHAR(50),
    FechaModificacion DATETIME,
    UsuarioModificacion VARCHAR(50)
);

-- Categorias (Categories)
CREATE TABLE Categorias (
    CategoriaId INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(255),
    Estado BIT DEFAULT 1,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    UsuarioCreacion VARCHAR(50),
    FechaModificacion DATETIME,
    UsuarioModificacion VARCHAR(50)
);

-- Libros (Books)
CREATE TABLE Libros (
    LibroId INT IDENTITY(1,1) PRIMARY KEY,
    Titulo VARCHAR(255) NOT NULL,
    ISBN VARCHAR(13) UNIQUE,
    CategoriaId INT FOREIGN KEY REFERENCES Categorias(CategoriaId),
    AnioPublicacion INT,
    Editorial VARCHAR(100),
    Estado BIT DEFAULT 1,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    UsuarioCreacion VARCHAR(50),
    FechaModificacion DATETIME,
    UsuarioModificacion VARCHAR(50)
);

-- LibrosAutores (BookAuthors - Many to Many)
CREATE TABLE LibrosAutores (
    LibroId INT FOREIGN KEY REFERENCES Libros(LibroId),
    AutorId INT FOREIGN KEY REFERENCES Autores(AutorId),
    PRIMARY KEY (LibroId, AutorId),
    Estado BIT DEFAULT 1,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    UsuarioCreacion VARCHAR(50),
    FechaModificacion DATETIME,
    UsuarioModificacion VARCHAR(50)
);

-- Ejemplares (BookCopies)
CREATE TABLE Ejemplares (
    EjemplarId INT IDENTITY(1,1) PRIMARY KEY,
    LibroId INT FOREIGN KEY REFERENCES Libros(LibroId),
    CodigoEjemplar VARCHAR(50) UNIQUE NOT NULL,
    TipoPrestamo VARCHAR(20) CHECK (TipoPrestamo IN ('Interno', 'Externo')),
    EstadoFisico VARCHAR(20) CHECK (EstadoFisico IN ('Disponible', 'Prestado', 'Reparacion')),
    Estado BIT DEFAULT 1,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    UsuarioCreacion VARCHAR(50),
    FechaModificacion DATETIME,
    UsuarioModificacion VARCHAR(50)
);

-- Prestamos (Loans)
CREATE TABLE Prestamos (
    PrestamoId INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioId INT FOREIGN KEY REFERENCES Usuarios(UsuarioId),
    EjemplarId INT FOREIGN KEY REFERENCES Ejemplares(EjemplarId),
    FechaPrestamo DATETIME NOT NULL DEFAULT GETDATE(),
    FechaDevolucionEsperada DATETIME NOT NULL,
    FechaDevolucionReal DATETIME,
    Estado BIT DEFAULT 1,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    UsuarioCreacion VARCHAR(50),
    FechaModificacion DATETIME,
    UsuarioModificacion VARCHAR(50)
);