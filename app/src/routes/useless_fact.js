const express = require('express');
const axios = require("axios");
const router = express.Router();

router.get('/fact', async (req, res) => {
    axios.get(`https://uselessfacts.jsph.pl/api/v2/facts/random`
    ).then((response) => {
        res.status(200).send(response.data.text);
    }).catch((error) => {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error: ', error.message);
        }
        console.log(error.config);
        res.status(500).send();
    });

});

module.exports = router;
