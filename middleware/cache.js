// middleware/cache.js

// Remove Redis configuration and use memory cache instead

const cacheMiddleware = (duration) => {
    const cache = new Map();

    return (req, res, next) => {
        const key = req.originalUrl;
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            return res.json(cachedResponse);
        }

        res.sendResponse = res.json;
        res.json = (body) => {
            cache.set(key, body);
            setTimeout(() => cache.delete(key), duration * 1000);
            res.sendResponse(body);
        };
        next();
    };
};

module.exports = cacheMiddleware;