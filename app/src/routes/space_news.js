const express = require('express');
const router = express.Router();
const service = require('../services/space_news');

const CAN_CACHE = process.env.CACHE === 'true';

router.get('/space_news', async (req, res) => {
    let titles;

    if (CAN_CACHE) {
        titles = await service.fetchFromCache();
    } else {
        titles = await service.fetchNews(ARTICLES_AMOUNT);     
    }
    
    res.status(200).send(titles);
});

module.exports = router