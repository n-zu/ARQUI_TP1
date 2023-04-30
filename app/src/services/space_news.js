const axios = require('axios');
const redis = require('redis');

const ARTICLES_AMOUNT = 5;
const SPACE_NEWS_KEY = 'space_news';
const SPACE_NEWS_TTL = 5;

const CAN_CACHE = process.env.CACHE === 'true';

let redisClient = null;

if (CAN_CACHE) {
    redisClient = redis.createClient({ url: 'redis://redis:6379' });
    (async () => {
        await redisClient.connect();
    })();
    
    process.on('SIGTERM', async () => {
        await redisClient.quit();
    });
}

export async function fetchNews() {
    const articles = await axios.get(SPACE_NEWS_BASE_URL,{
        params: {
            _limit: ARTICLES_AMOUNT
        }
    });
    return articles.data.map(article => article.title);
}

export async function fetchFromCache() {
     if (!redisClient) return await utils.fetchNews();

    const titlesString = await redisClient.get(SPACE_NEWS_KEY);
    if (titlesString !== null) {
        return JSON.parse(titlesString);
    } else {
        const titles = await utils.fetchNews();

        await redisClient.set(SPACE_NEWS_KEY, JSON.stringify(titles), {
            EX: SPACE_NEWS_TTL
        });

        return titles;
    }
}