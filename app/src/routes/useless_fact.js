const express = require('express');
const axios = require("axios");
const {handleAxiosError} = require("../tools");
const router = express.Router();

router.get('/fact', async (req, res) => {
    axios.get(`https://uselessfacts.jsph.pl/api/v2/facts/random`
    ).then((response) => {
        res.status(200).send(response.data.text);
    }).catch((error) => {
        handleAxiosError(error, res);
    });

});

module.exports = router;
