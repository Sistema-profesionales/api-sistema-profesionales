const express = require('express');
const router = express.Router();
const userModel = require('../models/User');
const validatorUser = require('../helpers/validators/user');

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
        const { body } = req;
        const errors = validatorUser.save(body);

        console.log(errors);
        res.send(errors);

        // if(errors){
        //     res.status(400).send(errors);
        //     return;
        // }

        // const newUser = await userModel.save(body);
        // res.status(201).send(newUser);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userDeleted = await userModel.remove(id);

        if(!userDeleted) return res.status(404).send({"user": [`El usuario con id ${id} no existe`]});

        res.status(200).send({"user": [`Se ha eliminado el usuario ${userDeleted.names}`]});
    } catch (error) {
        res.status(500).send(error);
    }
});

// router.put('/:id', async (req,res) => {
//     try {
//         const id = parseInt(req.params.id);
//         const { body } = req;

//         const user = await userModel.getById(id);

//         if( !user) return res.status(404).send({"user": [`El usuario con id ${id} no existe`]});
        

//     } catch (error) {
//         res.status(500).send(error);
//     }
// });


module.exports = router;