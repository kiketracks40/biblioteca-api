Biblioteca API Documentation
============================

Overview
--------

Backend API for Library Management System. Handles book management, user authentication, loans tracking, and report generation.

Tech Stack
----------

*   Node.js
    
*   Express.js
    
*   SQL Server
    
*   JWT Authentication
    
*   Socket.IO
    

Prerequisites
-------------

*   Node.js (v16+)
    
*   SQL Server 2019 or higher
    
*   npm (Node Package Manager)
    

Installation
------------

1.  Clone the repository
    
```bash 
git clone https://bitbucket.org/your-username/biblioteca-api.git  cd biblioteca-api
```

1.  Install dependencies
    
```bash
 npm install
```

1.  Configure environment variablesCreate a .env file in the root directory:
    

```bash
PORT=3000  DB_USER=your_db_user  DB_PASSWORD=your_db_password  DB_SERVER=localhost\\SQLEXPRESS  DB_DATABASE=Biblioteca  JWT_SECRET=your_secret_key
```

1.  Restore database
    

*   Open SQL Server Management Studio
    
*   Right-click Databases → Restore Database
    
*   Select source: Device → Browse → Select 'biblioteca.bak'
    
*   Click OK to restore
    

1.  Start the server
    

```bash
npm run dev
```

API Endpoints
-------------

### Authentication

*   POST /api/auth/login - User login
    
*   POST /api/auth/verify - Verify token
    
*   POST /api/auth/logout - User logout
    

### Users

*   GET /api/usuarios - List all users
    
*   POST /api/usuarios - Create new user
    
*   PUT /api/usuarios/:id - Update user
    
*   DELETE /api/usuarios/:id - Delete user
    

### Books

*   GET /api/libros - List all books
    
*   POST /api/libros - Create new book
    
*   PUT /api/libros/:id - Update book
    
*   DELETE /api/libros/:id - Delete book
    
*   GET /api/libros/inventario - Get book inventory
    

### Loans

*   GET /api/prestamos - List all loans
    
*   POST /api/prestamos - Create new loan
    
*   PUT /api/prestamos/:id/devolucion - Return book
    
*   GET /api/prestamos/reporte - Get loans report
    

### Reports

*   GET /api/prestamos/reporte - Loans by period
    
*   GET /api/usuarios/prestamos - User loan history
    
*   GET /api/libros/inventario - Book inventory
    
*   GET /api/autores/libros - Books by author
    

Data Models
-----------

### User (Usuario)

```json
{    "UsuarioId": "number",    "Nombre": "string",    "Apellido": "string",    "Email": "string",    "Password": "string",    "Departamento": "string",    "Rol": "string",    "Estado": "boolean"  }
```

### Book (Libro)

```json
{    "LibroId": "number",    "Titulo": "string",    "ISBN": "string",    "CategoriaId": "number",    "Editorial": "string",    "Estado": "boolean"  }
```

### Loan (Prestamo)

```json 
{    "PrestamoId": "number",    "UsuarioId": "number",    "EjemplarId": "number",    "FechaPrestamo": "date",    "FechaDevolucionEsperada": "date",    "FechaDevolucionReal": "date",    "Estado": "boolean"  }
```

Authentication
--------------

The API uses JWT (JSON Web Tokens) for authentication. Include the token in request headers:

```bash
Authorization: Bearer
```

Error Handling
--------------

The API returns standard HTTP status codes:

*   200: Success
    
*   201: Created
    
*   400: Bad Request
    
*   401: Unauthorized
    
*   403: Forbidden
    
*   404: Not Found
    
*   500: Server Error
    

Error response format:

```json 
{    "error": "Error message description"  }
```

Real-time Updates
-----------------

Socket.IO events:

*   nuevo\_prestamo: New loan created
    
*   devolucion: Book returned
    
*   bajo\_stock: Low book stock alert
    
*   prestamos\_vencidos: Overdue loans
    

Development
-----------

```bash 
# Run in development mode  
npm run dev  
# Run tests  
npm test 
# Build for production  
 npm run build
 ```

Database
--------

*   SQL Server database
    
*   Tables: Usuarios, Libros, Prestamos, Ejemplares, Categorias, Autores
    
*   Includes stored procedures for reports
    
*   Regular backups recommended
    

Deployment
----------

1.  Set up environment variables
    
2.  Build the project
    
3.  Start the server
    

```bash
npm start
```

Security Features
-----------------

*   JWT Authentication
    
*   Password hashing
    
*   Role-based access control
    
*   Request validation
    
*   CORS configuration
    

Contributing
------------

1.  Fork the repository
    
2.  Create your feature branch
    
3.  Commit your changes
    
4.  Push to the branch
    
5.  Create a Pull Request
    

License
-------

MIT
s
Changelog
---------

### Version 1.0.0

*   Initial release
    
*   Basic CRUD operations
    
*   Authentication system
    
*   Report generation