function validatePassword(req, res, next) {
    const { password } = req.body;
    
    // Password requirements
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    if (password.length < minLength) {
        return res.status(400).json({ 
            error: 'La contraseña debe tener al menos 8 caracteres' 
        });
    }

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        return res.status(400).json({ 
            error: 'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales' 
        });
    }

    next();
}

module.exports = validatePassword;