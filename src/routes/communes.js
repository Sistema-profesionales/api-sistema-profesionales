const express = require('express');
const router = express.Router();
const communeModel = require('../models/Commune');

router.get('/', async (req,res) => {
    try {
        const communes = await communeModel.getAll();
        res.status(200).send(communes);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;

