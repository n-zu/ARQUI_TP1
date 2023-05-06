const axios = require("axios");
const {MetricsLogger} = require("../common/metrics_logger");
const {ActiveLocalCacheDecorator} = require("../common/active_local_cache_decorator");

const CAN_CACHE = process.env.CACHE === 'true';
const CACHE_SIZE = 5;
const USELESS_FACT_URL = 'https://uselessfacts.jsph.pl/api/v2/facts/random';

const metricsLogger = new MetricsLogger('useless_fact');

class UselessFactService {
    constructor(url) {
        this.url = url;
    }

    async get() {
        const response = await metricsLogger.runAndMeasure(async () => {
            return await axios.get(this.url);
        });
        return response.data.text;
    }
}

let uselessFactService;

if (CAN_CACHE) {
    const uselessFactServiceBase = new UselessFactService(USELESS_FACT_URL);
    uselessFactService = new ActiveLocalCacheDecorator(uselessFactServiceBase, CACHE_SIZE);
} else {
    uselessFactService = new UselessFactService(USELESS_FACT_URL);
}

module.exports = {
    uselessFactService
}