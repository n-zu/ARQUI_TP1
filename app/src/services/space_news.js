const axios = require('axios');
const { redisClient } = require("./redis_client")
const {MetricsLogger} = require("../common/metrics_logger");

const metricsLogger = new MetricsLogger('space_news');

const SPACE_NEWS_BASE_URL = "https://api.spaceflightnewsapi.net/v3/articles";
const ARTICLES_AMOUNT = 5;
const SPACE_NEWS_KEY = 'space_news';
const SPACE_NEWS_TTL = 5;

async function fetchNews() {
    const articles = await metricsLogger.runAndMeasure(async () => {
        return await axios.get(SPACE_NEWS_BASE_URL,{
            params: {
                _limit: ARTICLES_AMOUNT
            }
        });
    });
    return articles.data.map(article => article.title);
}

async function fetchFromCache() {
    if (!redisClient) return await fetchNews();

    const titlesString = await redisClient.get(SPACE_NEWS_KEY);
    if (titlesString !== null) {
        return JSON.parse(titlesString);
    } else {
        const titles = await fetchNews();

        await redisClient.set(SPACE_NEWS_KEY, JSON.stringify(titles), {
            EX: SPACE_NEWS_TTL
        });

        return titles;
    }
}


module.exports = {
    fetchNews,
    fetchFromCache
}