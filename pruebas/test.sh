# 1. Create user
curl -X POST http://localhost:3000/api/usuarios \
-H "Content-Type: application/json" \
-d '{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@empresa.com",
  "departamento": "Sistemas"
}'

# 2. Create author
curl -X POST http://localhost:3000/api/autores \
-H "Content-Type: application/json" \
-d '{"nombre": "Gabriel", "apellido": "García Márquez"}'

# 3. Create book
curl -X POST http://localhost:3000/api/libros \
-H "Content-Type: application/json" \
-d '{
  "titulo": "Cien años de soledad",
  "isbn": "9780307474728",
  "categoriaId": 1,
  "anioPublicacion": 1967,
  "editorial": "Sudamericana",
  "autores": [1]
}'

# 4. Create copy
curl -X POST http://localhost:3000/api/ejemplares \
-H "Content-Type: application/json" \
-d '{
  "libroId": 1,
  "codigoEjemplar": "CIEN-001",
  "tipoPrestamo": "Externo"
}'

# 5. Create loan
curl -X POST http://localhost:3000/api/prestamos \
-H "Content-Type: application/json" \
-d '{
  "usuarioId": 1,
  "ejemplarId": 1,
  "fechaDevolucionEsperada": "2024-02-21T00:00:00"
}'

# 6. Test reports
curl "http://localhost:3000/api/libros/inventario"
curl "http://localhost:3000/api/autores/libros"
curl "http://localhost:3000/api/prestamos/reporte?fechaInicio=2024-01-01&fechaFin=2024-12-31"