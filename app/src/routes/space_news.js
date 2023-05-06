const express = require('express');
const axios = require("axios");
const {handleError} = require("../tools");
const router = express.Router();
const {MetricsLogger} = require("../common/metrics_logger");

const SPACE_NEWS_BASE_URL = "https://api.spaceflightnewsapi.net/v3/articles";
const ARTICLES_AMOUNT = 5;
const metricsLogger = new MetricsLogger('space_news');


router.get('/space_news', async (req, res) => {
    try {
        const articles = await metricsLogger.runAndMeasure(async () => {
            return await axios.get(SPACE_NEWS_BASE_URL,{
                params: {
                    _limit: ARTICLES_AMOUNT
                }
            });
        });
        const titles = articles.data.map(article => article.title);
        res.status(200).send(titles);
    } catch (error) {
        handleError(error, res, next);
    }
});

module.exports = router;
