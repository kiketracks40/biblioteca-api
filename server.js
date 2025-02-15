// server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Middleware imports
const security = require('./middleware/security');
const errorHandler = require('./middleware/errorHandler');
const performanceMiddleware = require('./middleware/performance');
const routes = require('./routes/api');

// Initialize express and HTTP server
const app = express();
const httpServer = createServer(app);


// CORS Configuration
const corsOptions = {
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
};

// Socket.IO Configuration
const io = new Server(httpServer, {
    cors: {
        ...corsOptions,
        transports: ['websocket', 'polling']
    },
    pingTimeout: 60000,
    pingInterval: 25000
});

// Middleware Setup
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Middleware
security(app);

// Routes
app.use('/api', routes);

// Socket.IO Event Handlers
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle préstamos events
    socket.on('nuevo_prestamo', (data) => {
        io.emit('nuevo_prestamo', data);
    });

    socket.on('devolucion', (data) => {
        io.emit('devolucion', data);
    });

    socket.on('bajo_stock', (data) => {
        io.emit('bajo_stock', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});




// Make io available to routes
app.set('io', io);

// Error Handling Middleware
app.use(errorHandler.notFound);
app.use(errorHandler.generalError);
app.use(performanceMiddleware);

// Server Start
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.IO server ready for connections`);
});

// Handle server errors
httpServer.on('error', (error) => {
    console.error('Server error:', error);
});

// Handle process termination
process.on('SIGTERM', () => {
    httpServer.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});