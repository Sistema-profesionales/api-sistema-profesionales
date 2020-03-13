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

router.get('/:idArea/:idCommune', async (req,res) => {
    try {
        const idArea = req.params.idArea;
        const idCommune = req.params.idCommune;

        const entities = await entityModel.getEntitiesByAreaAndCommune(idArea,idCommune);

        res.status(200).send(entities);

    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/', async (req,res) => {
    try {
        const { body } = req;

        const newEntity = await entityModel.save(body);

        res.status(201).send(newEntity);

    } catch (error) {   
        res.status(500).send(error);
    }
});

module.exports = router;