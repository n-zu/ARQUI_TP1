const express = require('express');
const {XMLParser} = require("fast-xml-parser");
const axios = require("axios");
const {decode} = require("metar-decoder");
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
            console.log(response);
            const parsed = parser.parse(response.data);
            if(parsed.response.errors){
                // TODO: devuelve un tag errors con un tag error con el detalle, deberíamos devolver eso
                res.status(400).send("metar responded with an error");
                return -1;
            }
            if(!parsed.response.data.METAR){
                res.status(400).send("station code does not exist \n");
                return -1;
            }
            const info = decode(parsed.response.data.METAR.raw_text);
            res.status(200).send(info);
        }).catch((error) => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                res.status(error.response.status).send();
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error: ', error.message);
            }
            console.log(error.config);
            res.status(500).send();
        });

    }
});

module.exports = router;
