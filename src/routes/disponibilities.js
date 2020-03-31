const router = require('express').Router();
const disponibilityModel = require('../models/Disponibility');

router.post('/', async (req, res) => {
    try {
        const { body } = req;

        const disponibility = await disponibilityModel.save(body);

        res.status(201).send(disponibility);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const disponibilities = await disponibilityModel.getAll();
        res.status(200).send(disponibilities);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const disponibilities = await disponibilityModel.getByUser(userId);
        res.status(200).send(disponibilities);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.get('/:id/:dayOfWeek', async (req, res) => {
    try {
        const userId = req.params.id;
        const dayOfWeek = req.params.dayOfWeek;
        const disponibilities = await disponibilityModel.getByUserAndDay(userId, dayOfWeek);
        res.status(200).send(disponibilities);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const dispId = req.params.id;
        const deleteDisponibility = await disponibilityModel.remove(dispId);
        res.status(202).send(deleteDisponibility);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

module.exports = router;




