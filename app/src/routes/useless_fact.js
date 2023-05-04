const express = require('express');
const axios = require("axios");
const {handleError} = require("../tools");
const hotshotsClient = require('../hotshots_client');
const router = express.Router();

router.get('/fact', async (req, res, next) => {
    const start = process.hrtime();

    axios.get(`https://uselessfacts.jsph.pl/api/v2/facts/random`
    ).then((response) => {
        res.status(200).send(response.data.text);
    }).catch((error) => {
       handleError(error, res, next);
    });

    const end = process.hrtime(start);
    const duration = end[0] * 1e3 + end[1] * 1e-6;
    hotshotsClient.gauge('fact', duration);
});

module.exports = router;
