const express = require('express');
const axios = require("axios");
const redis = require('redis');
const router = express.Router();

const ARTICLES_AMOUNT = 5;

const CAN_CACHE = process.env.CACHE === 'true';

const SPACE_NEWS_KEY = 'space_news';
const SPACE_NEWS_TTL = 5;

const redisClient = redis.createClient({ url: 'redis://redis:6379' });

(async () => {
    await redisClient.connect();
})();

process.on('SIGTERM', async () => {
    await redisClient.quit();
});

router.get('/space_news', async (req, res) => {
    let titles;
    const titlesString = await redisClient.get('space_news');

    if (titlesString !== null && CAN_CACHE) {
        titles = JSON.parse(titlesString);
    } else {
        const articles = await axios.get(`https://api.spaceflightnewsapi.net/v3/articles?_limit=${ARTICLES_AMOUNT}`);
        titles = articles.data.map(article => article.title);

        await redisClient.set(SPACE_NEWS_KEY, JSON.stringify(titles), {
            EX: SPACE_NEWS_TTL
        });
    }
    
    res.status(200).send(titles);
});

module.exports = router