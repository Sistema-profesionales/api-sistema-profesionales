const express = require('express');
const router = express.Router();
const entityModel = require('../models/Entity');

router.get('/', async (req,res) => {
    try {
        const entities = await entityModel.getAll();

        res.status(200).send(entities);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;