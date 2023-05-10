
class ActiveLocalCache {
    constructor(service, size) {
        this.service = service;
        this.size = size;
        this.cachePromises = [];
    }

    populateCache() {
        for (let i = 0; i < this.size; i++) {
            this.cachePromises.push(this.service.get());
        }
    }

    async get(options) {
        if (this.cachePromises.length === 0) {
            this.populateCache();
        }
        const newPromise = this.service.get(options);
        this.cachePromises.push(newPromise);
        const firstPromise = this.cachePromises.shift();
        return await firstPromise;
    }
}

module.exports = {ActiveLocalCache};