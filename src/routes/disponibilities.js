const router = require('express').Router();
const disponibilityModel = require('../models/Disponibility');

router.post('/', async (req, res) => {
    try {
        // const { userId, dayOfWeek, starHour, endHour } = req.body;
        const { body } = req;

        const disponibility = await disponibilityModel.save(body);

        res.status(201).send(disponibility);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

module.exports = router;




