const express = require('express');
const axios = require("axios");
const {handleError} = require("../tools");
const router = express.Router();

router.get('/fact', async (req, res, next) => {
    axios.get(`https://uselessfacts.jsph.pl/api/v2/facts/random`
    ).then((response) => {
        res.status(200).send(response.data.text);
    }).catch((error) => {
       handleError(error, res, next);
    });

});

module.exports = router;
