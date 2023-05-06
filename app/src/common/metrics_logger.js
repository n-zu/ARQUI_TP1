const Client = require("hot-shots");

const GRAPHITE_HOST = process.env.GRAPHITE_HOST || 'graphite';
const GRAPHITE_PORT = process.env.GRAPHITE_PORT || 8125;

class MetricsLogger {
    constructor(serviceName, window_size = 50) {
        this.client = new Client({
            host: GRAPHITE_HOST,
            port: GRAPHITE_PORT,
            prefix: 'external_api.' + serviceName + '.'
        });
        this.values = [];
        this.windowSize = window_size;
    }

    calculateAvg() {
        return this.values.reduce((a, b) => a + b, 0) / this.values.length;
    }

    calculateMax() {
        return Math.max(...this.values);
    }

    log(metric_name, value) {
        this.client.gauge(metric_name, value);
    }

    async runAndMeasure(func) {
        const start = process.hrtime();
        const result = await func();
        const end = process.hrtime(start);
        const duration = end[0] * 1e3 + end[1] * 1e-6;

        if (this.values.length >= this.windowSize) {
            this.values.shift();
        }
        this.values.push(duration);

        const avg = this.calculateAvg();
        const max = this.calculateMax();

        this.log('avg', avg);
        this.log('max', max);

        return result;
    }
}

module.exports = {MetricsLogger};