const express = require('express');
const axios = require("axios");
const router = express.Router();

const SPACE_NEWS_BASE_URL = "https://api.spaceflightnewsapi.net/v3/articles";
const ARTICLES_AMOUNT = 5;

router.get('/space_news', async (req, res) => {
    axios.get(SPACE_NEWS_BASE_URL,{
        params: {
            _limit: ARTICLES_AMOUNT
        }
    }).then((response) => {
        const titles = response.data.map(article => article.title);
        res.status(200).send(titles);
    }).catch((error) => {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error: ', error.message);
        }
        console.log(error.config);
        res.status(500).send();
    });

});

module.exports = router;
