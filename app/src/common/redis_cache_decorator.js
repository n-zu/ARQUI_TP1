const {RedisSingleton} = require('./redis_singleton');

const REDIS_URL = 'redis://redis:6379';

class RedisCacheDecorator {
    constructor(decorated, prefix, ttl) {
        this.decorated = decorated;
        this.redis = new RedisSingleton(REDIS_URL);
        this.ttl = ttl;
        this.prefix = prefix;
    }

    /*
        Build a redis key using a prefix and a pair of key:value options
        This key will be used to store the value in the redis cache
        Examples:
        buildRedisKey() => '<prefix>' where prefix would be 'space_news'
        buildRedisKey({station: 'SAEZ'}) => '<prefix>_SAEZ' where prefix would be 'metar'
     */
    buildRedisKey(options) {
        if (!options) {
            return this.prefix;
        }
        // Sort keys to avoid different keys for the same options
        const sortedKeys = Object.keys(options).sort();
        const encodedOptions = sortedKeys.map(key => `${key}_${options[key]}`).join('_');
        return `${this.prefix}_${encodedOptions}`;
    }

    async getNew(redisKey, options) {
        const value = await this.decorated.get(options);
        await this.redis.set(redisKey, JSON.stringify(value), this.ttl);
        return value;
    }

    async get(options) {
        const redisKey = this.buildRedisKey(options);
        const value = await this.redis.get(redisKey);
        if (value !== null) {
            return JSON.parse(value);
        } else {
            return this.getNew(redisKey, options);
        }
    }
}

module.exports = {
    RedisCacheDecorator
}