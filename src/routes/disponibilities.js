const router = require('express').Router();
const disponibilityModel = require('../models/Disponibility');

router.post('/', async (req, res) => {
    try {
        const { body } = req;

        const disponibilities = await disponibilityModel.getByUserAndDay(body.userId, body.dayOfWeek);

        if(!body.startHour || !body.endHour || body.startHour === "" || body.endHour === "") {
            return res.status(400).send({ message: [`Por favor indica las horas de inicio y termino`] });
        }

        let bodyStartHour = parseInt(body.startHour.replace(":", ""));
        let bodyEndHour = parseInt(body.endHour.replace(":", ""));

        if(bodyStartHour > bodyEndHour) {
            return res.status(400).send({ message: [`La hora de inicio debe ser mayor a la de termino`] });
        }

        if(disponibilities.length > 0) {
            let endHour = disponibilities[disponibilities.length - 1];
            let formatBodyHour = parseInt(body.startHour.replace(":", ""));
            let formatHourBD = parseInt(endHour.endHour.replace(":", ""));
            if(formatBodyHour < formatHourBD) return res.status(400).send({ message: [`La nueva hora no puede coincidir con el intervalo de horas ya registradas`] });
        }

        const disponibility = await disponibilityModel.save(body);

        res.status(201).send(disponibility);

    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/new', async (req, res) => {
    try {
        const { body } = req;

        const disponibility = await disponibilityModel.saveNew(body);
        res.status(201).send(disponibility);

    } catch (error) {
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
        res.status(500).send(error);
    }
});

router.delete('/:userId/:dayOfWeek', async (req, res) => {
    try {
        const userId = req.params.userId;
        const dayOfWeek = req.params.dayOfWeek;

        const deletedDisp = await disponibilityModel.deletedDisponibilities(userId, dayOfWeek);
        res.status(202).send(deletedDisp);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;




