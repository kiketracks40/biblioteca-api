const createHttpError = require('http-errors');

const validator = (schema, property) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property]);
        
        if (!error) {
            next();
        } else {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            next(createHttpError(422, message));
        }
    }
};

module.exports = validator;