// middleware/permissions.js
const roles = {
    Administrador: ['all'],
    Bibliotecario: ['read', 'create', 'update'],
    Usuario: ['read']
};

function checkPermission(requiredRole) {
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
}

module.exports = { checkPermission };