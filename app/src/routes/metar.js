const express = require('express');
const {XMLParser} = require("fast-xml-parser");
const axios = require("axios");
const {decode} = require("metar-decoder");
const router = express.Router();
const {MetricsLogger} = require("../common/metrics_logger");

const metricsLogger = new MetricsLogger('metar');
router.get('/metar', async (req, res) => {
    const parser = new XMLParser();
    const station = req.query.station;

    if (!station) {
        res.status(400).send('Missing station query parameter');
    } else {
        const response = await metricsLogger.runAndMeasure(async () => {
            return await axios.get(`https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=${station}&hoursBeforeNow=1`);
        });
        const parsed = parser.parse(response.data);
        const info = decode(parsed.response.data.METAR.raw_text);
        res.status(200).send(info);
    }
});

module.exports = router