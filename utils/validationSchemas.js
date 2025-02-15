// utils/validationSchemas.js
const Joi = require('joi');

const schemas = {
    prestamo: Joi.object({
        usuarioId: Joi.number().required(),
        ejemplarId: Joi.number().required(),
        fechaDevolucionEsperada: Joi.date().greater('now').required()
    }),

    libro: Joi.object({
        titulo: Joi.string().min(1).max(255).required(),
        isbn: Joi.string().length(13).pattern(/^[0-9]+$/).required(),
        categoriaId: Joi.number().required(),
        anioPublicacion: Joi.number().min(1000).max(new Date().getFullYear()),
        editorial: Joi.string().required(),
        autores: Joi.array().items(Joi.number()).min(1).required()
    }),

    usuario: Joi.object({
        nombre: Joi.string().min(2).max(100).required(),
        apellido: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .required()
            .messages({
                'string.pattern.base': 'La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial'
            }),
        departamento: Joi.string().required()
    })
};

module.exports = schemas;