const axios = require("axios");
const {XMLParser} = require("fast-xml-parser");
const {decode} = require("metar-decoder");
const { redisClient } = require("./redis_client");
const {MetricsLogger} = require("../common/metrics_logger");

const metricsLogger = new MetricsLogger('metar');
const BASE_METAR_URL = "https://www.aviationweather.gov/adds/dataserver_current/httpparam";
const KEY_SUFFIX = 'metar_';
const METAR_TTL = 5;

async function fetchMetar(station) {
    const parser = new XMLParser();

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
    
    const parsed = parser.parse(response.data);
    
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

async function fetchMetarFromCache(station) {
    if (!redisClient) return await fetchMetar(station);
    const key = metarKey(station);

    const metarString = await redisClient.get(key);
    if (metarString !== null) {
        return JSON.parse(metarString);
    } else {
        const metar = await fetchMetar(station);

        await redisClient.set(key, JSON.stringify(metar), {
            EX: METAR_TTL
        });
        return metar;
    }
}

function metarKey(station) {
    return KEY_SUFFIX + station;
}


module.exports = {
    fetchMetar,
    fetchMetarFromCache
};