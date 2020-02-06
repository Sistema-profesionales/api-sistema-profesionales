const express = require('express');
const router = express.Router();
const userModel = require('../models/User');


router.get('/', async (req,res) => {
    try {
        const users = await userModel.getAll();

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async (req,res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await userModel.getById(id);

        if(!user) return res.status(404).send({ "user": [`El usuario con id ${id} no existe`] });

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post('/', async (req, res) => {
    try {
        const { body : user } = req;

        const newUser = await userModel.save(user);
        res.status(201).send(newUser);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;