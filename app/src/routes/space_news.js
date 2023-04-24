const express = require('express');
const axios = require("axios");
const {handleError} = require("../tools");
const router = express.Router();

const SPACE_NEWS_BASE_URL = "https://api.spaceflightnewsapi.net/v3/articles";
const ARTICLES_AMOUNT = 5;

router.get('/space_news', async (req, res, next) => {
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

});

module.exports = router;
