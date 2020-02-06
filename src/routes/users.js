const express = require('express');
const router = express.Router();
const userModel = require('../models/Usuario');

router.post('/create', async (req, res) => {
    try {
        const { body : usuario } = req;

        const newUser = await userModel.save(usuario);
        res.status(201).send(newUser);
    } catch (error) {
        res.status(500).send(error);
    }

});

module.exports = router;