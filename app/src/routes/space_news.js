const express = require('express');
const axios = require("axios");
const router = express.Router();
const {MetricsLogger} = require("../common/metrics_logger");

const ARTICLES_AMOUNT = 5;
const metricsLogger = new MetricsLogger('space_news');


router.get('/space_news', async (req, res) => {
    const articles = await metricsLogger.runAndMeasure(async () => {
        return await axios.get(`https://api.spaceflightnewsapi.net/v3/articles?_limit=${ARTICLES_AMOUNT}`);
    });

    const titles = articles.data.map(article => article.title);
    res.status(200).send(titles);
});

module.exports = router