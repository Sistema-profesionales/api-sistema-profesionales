const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const userModel = require('../models/User');
const validatorUser = require('../helpers/validators/user');
const cheerio = require('cheerio');
const axios = require('axios')

router.get('/', async (req, res) => {
    try {
        const users = await userModel.getAll();

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/getInfo', async (req, res) => {
    axios.get(process.env.SCRAP_URL + req.query.rut)
        .then(response => {

            const $ = cheerio.load(response.data);

            let fullname = $('table tr:nth-child(2) td a').text();
            if (!fullname) return res.status(400).json({ msg: 'No tienes datos de área de salud' });
            let nameSplit = fullname.split(',');
            let lastNames = nameSplit[0];
            let names = nameSplit[1];
            let speciality = $('table tr:nth-child(2) td:nth-child(3)').text();
            let university = $('table tr:nth-child(2) td:nth-child(4)').text();

            res.json({
                names,
                lastNames,
                speciality,
                university
            })
        })
});

router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await userModel.getById(id);

        if (!user) return res.status(404).send({ "user": [`El usuario con id ${id} no existe`] });

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post('/', async (req, res) => {
    try {
        const { body } = req;
        const errors = validatorUser.save(body);

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        //check if user exists
        const userRut = await userModel.checkIfRutExist(body);
        if (userRut) return res.status(409).send({ "user": [`El rut ${body.rut} ya se encuentra registrado`] });

        const userEmail = await userModel.checkIfEmailExist(body);
        if (userEmail) return res.status(409).send({ "user": [`El email ${body.email} ya se encuentra registrado`] });

        const userLogin = await userModel.checkIfLoginlExist(body);
        if (userLogin) return res.status(409).send({ "user": [`El usuario con nickname ${body.login} ya se encuentra registrado`] });


        const newUser = await userModel.save(body);
        if (body.professions) {
            for (let i = 0; i < body.professions.length; i++) {
                await userModel.insertUserProfession(newUser.id, body.professions[i].id);
            }
            console.log(body.professions);
        }

        res.status(201).send(newUser);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userDeleted = await userModel.remove(id);

        if (!userDeleted) return res.status(404).send({ "user": [`El usuario con id ${id} no existe`] });

        res.status(200).send(userDeleted);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;

        const userLogin = await userModel.getByLogin(login);

        if (userLogin) {
            if (password === userLogin.password) {
                delete userLogin.password;
                res.status(200).send(userLogin);
                return;
            } else {
                res.status(400).send({ 'user': ['Usuario o contraseña incorrecto'] });
                return;
            }
        } else {
            res.status(400).send({ 'user': ['Usuario no existe'] });
            return;
        }

    } catch (error) {
        res.status(500).send(error);
    }
})

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