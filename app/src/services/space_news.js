const axios = require("axios");
const { MetricsLogger } = require("../common/metrics_logger");

const metricsLogger = new MetricsLogger("space_news");

const SPACE_NEWS_BASE_URL = "https://api.spaceflightnewsapi.net/v3/articles";
const ARTICLES_AMOUNT = 5;

class SpaceNewsService {
  constructor(url, articlesAmount) {
    this.url = url;
    this.articlesAmount = articlesAmount;
  }

  async get() {
    const articles = await metricsLogger.runAndMeasure(async () => {
      return await axios.get(this.url, {
        params: {
          _limit: this.articlesAmount,
        },
      });
    });
    return articles.data.map((article) => article.title);
  }
}

const spaceNewsService = new SpaceNewsService(
  SPACE_NEWS_BASE_URL,
  ARTICLES_AMOUNT
);

module.exports = {
  spaceNewsService,
};
