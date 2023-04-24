const express = require('express');
const {XMLParser} = require("fast-xml-parser");
const axios = require("axios");
const {decode} = require("metar-decoder");
const {handleAxiosError} = require("../tools");
const router = express.Router();

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
            console.log(parsed);
            if(parsed.response.errors){
                res.status(400).send(parsed.response.errors.error);
                return -1;
            }
            if(!parsed.response.data.METAR){
                res.status(400).send("Invalid station code \n");
                return -1;
            }
            const info = decode(parsed.response.data.METAR.raw_text);
            res.status(200).send(info);
        }).catch((error) => {
            handleAxiosError(error, res);
        });

    }
});

module.exports = router;
