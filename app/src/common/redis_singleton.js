const redis = require('redis');

class RedisSingleton {
    constructor(url) {
        if (RedisSingleton.instance) {
            return RedisSingleton.instance;
        }
        this.client = this.setUpRedis(url);
        RedisSingleton.instance = this;
        return this;
    }

    setUpRedis(url) {
        console.log(`Connecting to redis at ${url}`);
        const client = redis.createClient({ url: url });
        (async () => {
            await client.connect();
        })();
        return client;
    }

    async set(key, value, ttl) {
        if (ttl) {
            return await this.client.set(key, value, {
                EX: ttl
            });
        } else {
            return await this.client.set(key, value);
        }
    }

    async get(key) {
        return await this.client.get(key);
    }

    static async quit() {
        if (RedisSingleton.instance) {
            await RedisSingleton.instance.client.quit();
        }
    }
}

module.exports = {
    RedisSingleton
}