# Test server
curl http://localhost:3000/api/



# Create author
curl -X POST http://localhost:3000/api/autores -H "Content-Type: application/json" -d "{\"nombre\": \"Gabriel\", \"apellido\": \"Garcia Marquez\"}"


# Create user
curl -X POST http://localhost:3000/api/usuarios -H "Content-Type: application/json" -d "{\"nombre\": \"Juan\", \"apellido\": \"Perez\", \"email\": \"juan.perez@empresa.com\", \"password\": \"123456\", \"departamento\": \"Sistemas\"}"


# Create book
curl -X POST http://localhost:3000/api/libros -H "Content-Type: application/json" -d "{\"titulo\": \"Cien años de soledad\", \"isbn\": \"123456789\", \"categoriaId\": 1, \"anioPublicacion\": 1967, \"editorial\": \"Sudamericana\", \"autores\": [1]}"

# Create copy
curl -X POST http://localhost:3000/api/ejemplares -H "Content-Type: application/json" -d "{\"libroId\": 1, \"codigoEjemplar\": \"CIEN001\", \"tipoPrestamo\": \"Externo\"}"

# Create loan
curl -X POST http://localhost:3000/api/prestamos -H "Content-Type: application/json" -d "{\"usuarioId\": 1, \"ejemplarId\": 1, \"fechaDevolucionEsperada\": \"2024-03-07\"}"

# Category
curl -X POST http://localhost:3000/api/categorias -H "Content-Type: application/json" -d "{\"nombre\": \"Finanzas\", \"descripcion\": \"Libros de finanzas y economia\"}"
# Reports
curl "http://localhost:3000/api/prestamos/reporte?fechaInicio=2024-01-01&fechaFin=2024-12-31"
curl http://localhost:3000/api/libros/inventario
curl http://localhost:3000/api/autores/libros
curl "http://localhost:3000/api/usuarios/prestamos?fechaInicio=2024-01-01&fechaFin=2024-12-31"

# Return book
curl -X PUT http://localhost:3000/api/prestamos/1/devolucion

# Update copy status
curl -X PUT http://localhost:3000/api/ejemplares/1/estado -H "Content-Type: application/json" -d "{\"estadoFisico\": \"Disponible\"}"

# Create user
curl -X POST http://localhost:3000/api/usuarios -H "Content-Type: application/json" -d "{\"nombre\": \"Juan\", \"apellido\": \"Perez\", \"email\": \"juan.perez@empresa.com\", \"password\": \"123456\", \"departamento\": \"Sistemas\"}"