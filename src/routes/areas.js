const express = require('express');
const router = express.Router();
const areaModel = require('../models/Area');
const validatorArea = require('../helpers/validators/area');

router.post('/', async (req, res) => {
    try {
        const { body } = req;
        const errors = validatorArea.save(body);
        if(errors) return res.status(400).send(errors);
        const save = await areaModel.save(body);
        res.status(201).send(save);
    } catch (error) {
        console.log(error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { body } = req;

        const area = await areaModel.getById(id);

        if(!area) return res.status(404).send({ "area": [`El área con id ${id} no existe`] });

        const errors = validatorArea.save(body);

        if(errors) return res.status(400).send(errors);

        const update = await areaModel.updateById(id, body);

        res.status(200).send(update);

    } catch (error) {
        console.log(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const area = await areaModel.getById(id);
        if(!area) return res.status(404).send({ "area": [`El área con id ${id} no existe`] });

        const del = await areaModel.deleteById(id);

        res.status(202).send(del);

    } catch (error) {
        console.log(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const areas = await areaModel.getAll();

        res.status(200).send(areas);
    } catch (error) {
        console.log(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const area = await areaModel.getById(id);

        if(!area) return res.status(404).send({ "area": [`El área con id ${id} no existe`] });

        res.status(200).send(area);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;