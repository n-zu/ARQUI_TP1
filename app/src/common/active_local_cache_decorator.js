
class ActiveLocalCacheDecorator {
    constructor(decorated, size) {
        this.decorated = decorated;
        this.size = size;
        this.cachePromises = [];
        this.populateCache();
    }

    populateCache() {
        for (let i = 0; i < this.size; i++) {
            this.cachePromises.push(this.decorated.get());
        }
    }

    async get(options) {
        const newPromise = this.decorated.get(options);
        this.cachePromises.push(newPromise);
        const firstPromise = this.cachePromises.shift();
        return await firstPromise;
    }
}

module.exports = {ActiveLocalCacheDecorator};