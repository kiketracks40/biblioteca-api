// routes/api.js
const express = require('express');
const router = express.Router();
const autorController = require('../controllers/autorController');
const libroController = require('../controllers/libroController');
const ejemplarController = require('../controllers/ejemplarController');
const prestamoController = require('../controllers/prestamoController');
const usuarioController = require('../controllers/usuarioController');
const categoriaController = require('../controllers/categoriaController');
const reporteController = require('../controllers/reporteController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const validator = require('../middleware/validator');
const schemas = require('../utils/validationSchemas');
const cacheMiddleware = require('../middleware/cache');
const jwt = require('jsonwebtoken');
const { checkPermission } = require('../middleware/permissions');
const { poolPromise, sql } = require('../models/database');





router.post('/auth/login', authController.login);
router.post('/auth/verify', authController.verifyToken);
router.get('/', (req, res) => {
  res.json({ message: 'Biblioteca API is running' });
});


router.use(authMiddleware);



router.post('/auth/logout', authController.logout);


router.get('/usuarios', checkPermission('read'), usuarioController.listar);
router.post('/usuarios', checkPermission('create'), usuarioController.crear);
router.put('/usuarios/:id', checkPermission('update'), usuarioController.actualizar);
router.delete('/usuarios/:id', checkPermission('delete'), usuarioController.eliminar);
router.get('/usuarios/prestamos', checkPermission('read'), usuarioController.obtenerPrestamosPorUsuario);


router.get('/libros', checkPermission('read'), libroController.listar);
router.post('/libros',  checkPermission('create'), libroController.crear);
router.put('/libros/:id', checkPermission('update'), libroController.actualizar);
router.delete('/libros/:id', checkPermission('delete'), libroController.eliminar);
router.get('/libros/inventario', 
  cacheMiddleware(300), // Cache for 5 minutes
  libroController.obtenerInventario
);

//router.get('/libros/inventario', [cacheMiddleware(300), checkPermission('read')], libroController.obtenerInventario);

//router.get('/autores/libros', [cacheMiddleware(3600), checkPermission('read')], autorController.obtenerLibrosPorAutor);



router.get('/autores/libros', 
  cacheMiddleware(3600), // Cache for 1 hour
  autorController.obtenerLibrosPorAutor
);
router.get('/autores', checkPermission('read'), autorController.listar);
router.post('/autores', checkPermission('create'), autorController.crear);

router.post('/ejemplares', checkPermission('create'), ejemplarController.crear);
router.put('/ejemplares/:ejemplarId/estado', checkPermission('update'), ejemplarController.actualizarEstado);

router.post('/prestamos', checkPermission('create'), prestamoController.crearPrestamo);
router.post('/prestamos', checkPermission('createPrestamo'), prestamoController.crearPrestamo);
router.put('/prestamos/:prestamoId/devolucion', checkPermission('update'), prestamoController.registrarDevolucion);
router.get('/prestamos/reporte', checkPermission('read'), prestamoController.obtenerReportePrestamos);
router.get('/prestamos', checkPermission('read'), prestamoController.listar);

router.get('/categorias', checkPermission('read'), categoriaController.listar);
router.post('/categorias', checkPermission('create'), categoriaController.crear);

//reportes

router.get('/reportes/prestamos', checkPermission('read'), reporteController.generarReporte);

module.exports = router;