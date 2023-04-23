const express = require('express');
const axios = require("axios");
const router = express.Router();
const Client = require('hot-shots');

const ARTICLES_AMOUNT = 5;

const client = new Client({
    host: 'graphite',
    port: 8125,
    prefix: 'external_api_',
});

router.get('/space_news', async (req, res) => {
    const start = process.hrtime();
    const articles = await axios.get(`https://api.spaceflightnewsapi.net/v3/articles?_limit=${ARTICLES_AMOUNT}`);
    const end = process.hrtime(start);
    const duration = end[0] * 1e3 + end[1] * 1e-6;

    client.gauge('space_news', duration);

    const titles = articles.data.map(article => article.title);
    res.status(200).send(titles);
});

module.exports = router