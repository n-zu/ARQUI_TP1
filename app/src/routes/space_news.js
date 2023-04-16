const express = require('express');
const axios = require("axios");
const router = express.Router();

const ARTICLES_AMOUNT = 5;

router.get('/space_news', async (req, res) => {
    const articles = await axios.get(`https://api.spaceflightnewsapi.net/v3/articles?_limit=${ARTICLES_AMOUNT}`);
    const titles = articles.data.map(article => article.title);
    res.status(200).send(titles);
});

module.exports = router