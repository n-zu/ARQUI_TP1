const axios = require("axios");
const {XMLParser} = require("fast-xml-parser");
const {decode} = require("metar-decoder");
const {MetricsLogger} = require("../common/metrics_logger");
const {RedisCache} = require("../common/redis_cache");

const metricsLogger = new MetricsLogger('metar');

const CAN_CACHE = process.env.CACHE === 'true';
const BASE_METAR_URL = "https://www.aviationweather.gov/adds/dataserver_current/httpparam";
const METAR_KEY = 'metar';
const METAR_TTL = 5;

class MetarService {
    constructor(url) {
        this.url = url;
    }

    parse(data) {
        const parser = new XMLParser();
        const parsed = parser.parse(data);

        if(parsed.response.errors){
            const err = new Error(parsed.response.errors.error);
            err.type = 'metar';
            throw err;
        }
        if(!parsed.response.data.METAR){
            const err = new Error("Invalid station code");
            err.type = 'metar';
            throw err;
        }
        return decode(parsed.response.data.METAR.raw_text);
    }

    async get(options) {
        const {station} = options;
        const response = await metricsLogger.runAndMeasure(async () => {
            return await axios.get(BASE_METAR_URL, {
                params: {
                    dataSource: "metars",
                    requestType: "retrieve",
                    format: "xml",
                    stationString: station,
                    hoursBeforeNow: 1,
                    mostRecent: true,
                }
            });
        });
        return this.parse(response.data);
    }
}

let metarService;
if (CAN_CACHE) {
    const metarServiceBase = new MetarService(BASE_METAR_URL);
    metarService = new RedisCache(metarServiceBase, METAR_KEY, METAR_TTL);
} else {
    metarService = new MetarService(BASE_METAR_URL);
}


module.exports = {
    metarService
};