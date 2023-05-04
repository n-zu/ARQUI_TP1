const express = require('express');
const axios = require("axios");
const {handleError} = require("../tools");
const router = express.Router();
const hotshotsClient = require('../hotshots_client');

const SPACE_NEWS_BASE_URL = "https://api.spaceflightnewsapi.net/v3/articles";
const ARTICLES_AMOUNT = 5;

router.get('/space_news', async (req, res, next) => {
    const start = process.hrtime();

    axios.get(SPACE_NEWS_BASE_URL,{
        params: {
            _limit: ARTICLES_AMOUNT
        }
    }).then((response) => {
        const titles = response.data.map(article => article.title);
        res.status(200).send(titles);
    }).catch((error) => {
        handleError(error, res, next);
    });

    const end = process.hrtime(start);
    const duration = end[0] * 1e3 + end[1] * 1e-6;
    hotshotsClient.gauge('space_news', duration);
});

module.exports = router;
