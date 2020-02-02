const express = require('express');
const router = express.Router();
const userModel = require('../models/User');

router.post('/create', async (req, res) => {
    try {
        const { body : user } = req;

        const newUser = await userModel.save(user);
        res.status(201).send(newUser);
    } catch (error) {
        res.status(500).send(error);
    }

});

module.exports = router;