const express = require('express');
const router = express.Router();
const professionsModel = require('../models/Professions');

router.get('/', async (req,res) => {
    try {
        const professions = await professionsModel.getAll();

        res.status(200).send(professions);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;