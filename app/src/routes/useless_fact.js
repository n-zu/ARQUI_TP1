const express = require('express');
const axios = require("axios");
const {handleError} = require("../tools");
const router = express.Router();
const {MetricsLogger} = require("../common/metrics_logger");

const metricsLogger = new MetricsLogger('useless_fact');

const CACHE_SIZE = 5;

const promisesCache = [];

function fetchFact() {
    promisesCache.push(axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random'));
}

function initCache() {
    for (let i = 0; i < CACHE_SIZE; i++) {
        fetchFact();
    }
}

initCache();

router.get('/fact', async (req, res, next) => {
    if (promisesCache.length === 0) {
        try {
            const fact = await metricsLogger.runAndMeasure(async () => {
                return new Promise(() => {return fetchFact();});
            });
        } catch (error) {
            handleError(error, res, next);
        }
        res.status(200).send(response.data.text);
        initCache();
    } else {
        const response = promisesCache.shift();
        const { data } = await response;
        res.status(200).send(data.text);
        fetchFact();
    }
});

module.exports = router;
