const express = require('express');
const router = express.Router();
const professionModel = require('../models/Profession');

router.get('/', async (req,res) => {
    try {
        const professions = await professionModel.getAll();

        res.status(200).send(professions);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;