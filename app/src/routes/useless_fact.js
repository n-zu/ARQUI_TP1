const express = require('express');
const {handleError} = require("../tools");
const router = express.Router();
const {uselessFactService} = require("../services/useless_fact");

router.get('/fact', async (req, res, next) => {
    try {
        const fact = await uselessFactService.get();
        res.status(200).send(fact);
    } catch (error) {
        handleError(error, res, next);
    }
});

module.exports = router;
