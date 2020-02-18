const express = require('express');
const router = express.Router();
const provinceModel = require('../models/Province');

router.get('/', async (req, res) => {
    try {
        const provinces = await provinceModel.getAll();
        res.status(200).send(provinces);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;