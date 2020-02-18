const express = require('express');
const router = express.Router();
const communeModel = require('../models/Commune');

router.get('/', async (req, res) => {
    try {
        const communes = await communeModel.getAll();
        res.status(200).send(communes);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const idCommune = req.params.id;

        const commune = await communeModel.getById(idCommune);
        res.status(200).send(commune);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;

