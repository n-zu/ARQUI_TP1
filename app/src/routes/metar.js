const express = require('express');
const {XMLParser} = require("fast-xml-parser");
const axios = require("axios");
const {decode} = require("metar-decoder");
const {handleError} = require("../tools");
const router = express.Router();
const {MetricsLogger} = require("../common/metrics_logger");

const metricsLogger = new MetricsLogger('metar');
const BASE_METAR_URL = "https://www.aviationweather.gov/adds/dataserver_current/httpparam";
/**
 * @param req.query.station query param station.
 * @property response.data.METAR.raw_text metar api response
 */
router.get('/metar', async (req, res) => {
    const parser = new XMLParser();
    const station = req.query.station;

    if (!station) {
        res.status(400).send('Missing station query parameter');
    } else {
        try {
            const response = await metricsLogger.runAndMeasure(async () => {
                return await axios.get(BASE_METAR_URL, {
                    params: {
                        dataSource: "metars",
                        requestType: "retrieve",
                        format: "xml",
                        stationString: station,
                        hoursBeforeNow: 1,
                        mostRecent: true,
                    }
                });
            });
            const parsed = parser.parse(response.data);
            const info = decode(parsed.response.data.METAR.raw_text);
            res.status(200).send(info);
        } catch (error) {
            handleError(error, res, next);
        }
    }
});

module.exports = router;
