const express = require('express');
const router = express.Router();
const regionModel = require('../models/Region');

router.get('/', async (req,res) => {
    try {
        const regions = await regionModel.getAll();
        res.status(200).send(regions);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;