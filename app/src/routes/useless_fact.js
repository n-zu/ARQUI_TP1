const express = require('express');
const axios = require("axios");
const {handleError} = require("../tools");
const router = express.Router();

const CACHE_SIZE = 5;

const promisesCache = [];

function fetchFact() {
    promisesCache.push(axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random'));
}

function initCache() {
    for (let i = 0; i < CACHE_SIZE; i++) {
        fetchFact();
    }
}

initCache();

router.get('/fact', async (req, res, next) => {
    if (promisesCache.length === 0) {
        axios.get(`https://uselessfacts.jsph.pl/api/v2/facts/random`
        ).then((response) => {
            res.status(200).send(response.data.text);
            initCache();
        }).catch((error) => {
            handleError(error, res, next);
        });
    } else {
        const response = promisesCache.shift();
        const { data } = await response;
        res.status(200).send(data.text);
        fetchFact();
    }
});

module.exports = router;
