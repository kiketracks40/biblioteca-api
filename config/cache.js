const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
});

client.on('error', (err) => console.log('Redis Client Error', err));

const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);

const DEFAULT_EXPIRATION = 3600; // 1 hour

module.exports = {
    client,
    get,
    set,
    DEFAULT_EXPIRATION
};