const express = require('express');
const {handleError} = require("../tools");
const router = express.Router();
const service = require('../services/space_news');


router.get('/space_news', async (req, res, next) => {
    try {
        let titles;
        if (CAN_CACHE) {
            titles = await service.fetchFromCache();
        } else {
            titles = await service.fetchNews();     
        }
        res.status(200).send(titles);
    } catch (error) {
        handleError(error, res, next);
    }
});

module.exports = router;
