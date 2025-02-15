class NotificationService {
    constructor(io) {
        this.io = io;
    }

    notifyPrestamo(prestamoData) {
        this.io.emit('nuevo_prestamo', prestamoData);
    }

    notifyDevolucion(devolucionData) {
        this.io.emit('devolucion', devolucionData);
    }

    notifyBajoStock(libroData) {
        this.io.emit('bajo_stock', libroData);
    }

    notifyVencimiento(prestamosVencidos) {
        this.io.emit('prestamos_vencidos', prestamosVencidos);
    }
}

module.exports = NotificationService;