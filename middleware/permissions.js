// middleware/permissions.js
const roles = {
    Administrador: ['all'],
    Bibliotecario: ['read', 'create', 'update'],
    Usuario: ['read', 'createPrestamo']
};



function checkPermission(requiredRole) {
    return (req, res, next) => {
        const userRole = req.user.rol;
        
        // Para estudiantes, solo permitir préstamos
        if (userRole === 'Usuario') {
            if (req.path.includes('/prestamos') && req.method === 'POST') {
                return next();
            }
            if (req.method === 'GET') {
                return next();
            }
            return res.status(403).json({ error: 'No tiene permisos suficientes' });
        }

        if (!userRole || !roles[userRole]) {
            return res.status(403).json({ error: 'Rol no válido' });
        }

        if (userRole === 'Administrador' || roles[userRole].includes(requiredRole)) {
            next();
        } else {
            res.status(403).json({ error: 'No tiene permisos suficientes' });
        }
    };
}

module.exports = { checkPermission };

/*function checkPermission(requiredRole) {
    return (req, res, next) => {
        // Get user role from JWT token (set by auth middleware)
        const userRole = req.user?.rol;
        
        // Debug logging
        console.log('User Role:', userRole);
        console.log('Required Permission:', requiredRole);
        
        // Check if role exists and is valid
        if (!userRole || !roles[userRole]) {
            console.log('Invalid role:', userRole);
            return res.status(403).json({ 
                error: 'Rol no válido',
                details: `Role '${userRole}' not found in permissions config`
            });
        }

        // Check permissions
        if (userRole === 'Administrador' || roles[userRole].includes(requiredRole)) {
            console.log('Permission granted');
            next();
        } else {
            console.log('Permission denied');
            res.status(403).json({ 
                error: 'No tiene permisos suficientes',
                details: `Role '${userRole}' cannot perform '${requiredRole}'`
            });
        }
    };
}*/

