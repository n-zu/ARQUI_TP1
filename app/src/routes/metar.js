const express = require('express');
const {handleError} = require("../tools");
const {metarService} = require("../services/metar");
const router = express.Router();


/**
 * @param req.query.station query param station.
 * @property response.data.METAR.raw_text metar api response
 */
router.get('/metar', async (req, res, next) => {
    const station = req.query.station;

    if (!station) {
        res.status(400).send('Missing station query parameter');
    } else {
        try {
            const info = await metarService.get({"station": station});
            res.status(200).send(info);
        } catch (error) {
            handleError(error, res, next);
        }
    }
});

module.exports = router;
