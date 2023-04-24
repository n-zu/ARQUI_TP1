const express = require('express');
const {XMLParser} = require("fast-xml-parser");
const axios = require("axios");
const {decode} = require("metar-decoder");
const {handleError} = require("../tools");
const router = express.Router();

const BASE_METAR_URL = "https://www.aviationweather.gov/adds/dataserver_current/httpparam";
/**
 * @param req.query.station query param station.
 * @property response.data.METAR.raw_text metar api response
 */
router.get('/metar', async (req, res, next) => {
    const parser = new XMLParser();
    const station = req.query.station;

    if (!station) {
        res.status(400).send('Missing station query parameter');
    } else {
        axios.get(BASE_METAR_URL, {
            params: {
                dataSource: "metars",
                requestType: "retrieve",
                format: "xml",
                stationString: station,
                hoursBeforeNow: 1
            }
        }).then((response) => {
            const parsed = parser.parse(response.data);
            if(parsed.response.errors){
                const err = new Error(parsed.response.errors.error);
                err.type = 'metar';
                throw err;
            }
            if(!parsed.response.data.METAR){
                const err = new Error("Invalid station code");
                err.type = 'metar';
                throw err;
            }
            const info = decode(parsed.response.data.METAR.raw_text);
            res.status(200).send(info);
        }).catch((error) => {
            handleError(error, res, next);
        });

    }
});

module.exports = router;
