const redis = require('redis');

const CAN_CACHE = process.env.CACHE === 'true';
const REDIS_URL = 'redis://redis:6379';

let redisClient = null;

if (CAN_CACHE) {
    redisClient = redis.createClient({ url: REDIS_URL });
    (async () => {
        await redisClient.connect();
    })();
    
    process.on('SIGTERM', async () => {
        await redisClient.quit();
    });
}

module.exports = {
    CAN_CACHE,
    redisClient
};