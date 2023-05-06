const express = require('express');
const {handleError} = require("../tools");
const router = express.Router();
const {spaceNewsService} = require("../services/space_news");


router.get('/space_news', async (req, res, next) => {
    try {
        const titles = await spaceNewsService.get();
        res.status(200).send(titles);
    } catch (error) {
        handleError(error, res, next);
    }
});

module.exports = router;
