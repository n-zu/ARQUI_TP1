const express = require('express');
const axios = require("axios");
const {handleError} = require("../tools");
const router = express.Router();
const {MetricsLogger} = require("../common/metrics_logger");

const metricsLogger = new MetricsLogger('useless_fact');

router.get('/fact', async (req, res) => {
    try {
        const fact = await metricsLogger.runAndMeasure(async () => {
            return await axios.get(`https://uselessfacts.jsph.pl/api/v2/facts/random`);
        });
        res.status(200).send(fact.data.text);
    } catch (error) {
        handleError(error, res, next); 
    }
});

module.exports = router;
