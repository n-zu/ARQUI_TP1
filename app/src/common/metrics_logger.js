const Client = require("hot-shots");

const GRAPHITE_HOST = process.env.GRAPHITE_HOST || 'graphite';
const GRAPHITE_PORT = process.env.GRAPHITE_PORT || 8125;

class MetricsLogger {
    constructor(serviceName) {
        this.client = new Client({
            host: GRAPHITE_HOST,
            port: GRAPHITE_PORT,
            prefix: 'external_api.' + serviceName + '.'
        });
    }

    log(metric_name, value) {
        this.client.gauge(metric_name, value);
    }

    async runAndMeasure(func) {
        const start = process.hrtime();
        const result = await func();
        const end = process.hrtime(start);
        const duration = end[0] * 1e3 + end[1] * 1e-6;

        this.log('delay', duration);

        return result;
    }
}

module.exports = {MetricsLogger};