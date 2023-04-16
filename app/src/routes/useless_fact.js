const express = require('express');
const axios = require("axios");
const router = express.Router();

router.get('/fact', async (req, res) => {
    const fact = await axios.get(`https://uselessfacts.jsph.pl/api/v2/facts/random`);

    res.status(200).send(fact.data.text);
});

module.exports = router