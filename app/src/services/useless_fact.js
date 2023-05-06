const axios = require("axios");
const {MetricsLogger} = require("../common/metrics_logger");

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

const uselessFactService = new UselessFactService(USELESS_FACT_URL);

module.exports = {
    uselessFactService
}