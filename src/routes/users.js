const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const userModel = require('../models/User');
const professionModel = require('../models/Profession');
const specialitynModel = require('../models/Speciality');
const validatorUser = require('../helpers/validators/user');
const cheerio = require('cheerio');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const puppeteer = require('puppeteer');

router.get('/', async (req, res) => {
    try {
        const users = await userModel.getAll();

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/getInfo', async (req, res) => {
    if (req.query) {
        let rut = req.query.rut;
        const errors = validatorUser.validateRut(rut);

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        let rutOk = req.query.rut.split('-')[0];

        axios.get(process.env.SCRAP_URL + rutOk)
            .then(response => {

                const $ = cheerio.load(response.data, { decodeEntities: false });

                let fullname = $('table tr:nth-child(2) td a').text();
                if (!fullname) return res.status(400).json({ msg: ['No tienes datos de área de salud'] });
                let nameSplit = fullname.split(',');
                let lastNames = nameSplit[0];
                let names = nameSplit[1];
                let title = $('table tr:nth-child(2) td:nth-child(3)').text();
                let university = $('table tr:nth-child(2) td:nth-child(4)').text();
                let specialities = $('table tr:nth-child(2) td:nth-child(5)').html().split('<br>');

                specialities = specialities[0] == "No Registra" ? [] : specialities

                res.json({
                    names,
                    lastNames,
                    professions: [title],
                    university,
                    specialities: specialities
                })

            })

    }

});

router.get('/getInfoNew', async (req, res) => {
    try {
        if (req.query) {
            let rut = req.query.rut;
            const errors = validatorUser.validateRut(rut);

            if (errors) {
                res.status(400).send(errors);
                return;
            }

            //linea under this is for puppeteer ok in heroku
            const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            // //const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('http://webhosting.superdesalud.gob.cl/bases/prestadoresindividuales.nsf/buscador?openForm');

            const rutOk = rut.split('-')[0];
            const dv = rut.split('-')[1];

            await page.evaluate((rutOk, dv) => {
                // document.querySelector('#rut_pres').value = '9823922';
                // document.querySelector('#dv').value = '7'; 10025468-9 10000746-0  9767233-4 9863204-2
                document.querySelector('#rut_pres').value = rutOk;
                document.querySelector('#dv').value = dv;
                document.querySelector('#btnBuscar2').click();
            }, rutOk, dv);

            await page.waitForSelector('.showDoc');
            await page.click('.showDoc');
            await page.waitForSelector('#ui-id-1');

            await page.screenshot({ path: 'certificado.png' });

            const data = await page.$$eval('table tr td', tds => tds.map((td) => {
                return td.innerText;
            }));

            // console.log(data[23]);
            // res.send({ msg: "ok" });

            let fullname = data[19]; //ok for 4 person
            let title = data[21]; //ok for 4 person
            let university = data[22];
            //let title = data[34];
            //let specialities = data[23];
            let dateOfBirth = data[39];
            let sex = data[43];
            let nationality = data[45];
            let registerNumber = data[49];
            let registerDay = data[51];

            await browser.close();

            let infoUser = {
                names: fullname.split(',')[1],
                lastNames: fullname.split(',')[0],
                professions: [title],
                university,
                dateOfBirth,
                sex,
                nationality,
                registerNumber,
                registerDay
            }

            res.send(infoUser);

            // let infoData = [];

            // for (let i = 0; i < data.length; i++) {
            //     infoData.push(data);
            // }

            // let fullname = infoData[0][19]; //ok for 4 person
            // let title = infoData[0][21]; //ok for 4 person
            // let university = infoData[0][22];
            // let dateOfBirth = infoData[0][39];
            // let rutScrapping = infoData[0][41];
            // let sex = infoData[0][43];
            // let nationality = infoData[0][45];
            // let registerNumber = infoData[0][49];

            // let infoUser = {
            //     names: fullname.split(',')[1],
            //     lastNames: fullname.split(',')[0],
            //     professions: [title],
            //     university,
            //     // dateOfBirth,
            //     // sex,
            //     // nationality
            // }
        } else {
            console.log(error);
            res.status(500).send("Error !!!");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

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

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(body.password, salt);

        body.password = hash;

        const newUser = await userModel.save(body);

        if (body.professions) {
            for (let i = 0; i < body.professions.length; i++) {
                const result = await professionModel.save(body.professions[i]);
                if (result) {
                    await userModel.insertUserProfession(newUser.id, result.id);
                }
            }
        }

        if (body.specialities) {
            for (let i = 0; i < body.specialities.length; i++) {
                const result = await specialitynModel.save(body.specialities[i]);
                if (result) {
                    await userModel.insertUserSpeciality(newUser.id, result.id);
                }
            }
        }

        res.status(201).send(newUser);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.post('/validateUser', async (req, res) => {
    try {
        const { body } = req;
        const errors = validatorUser.save(body);

        if (errors) {
            res.status(400).send(errors);
            return;
        } else {
            return {};
        }


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
        const { userRutOrEmail, password } = req.body;

        const userLogin = await userModel.getByLogin(userRutOrEmail);

        // console.log(userLogin.password);
        // res.send(userLogin);

        // res.send(userLogin.pasword);

        if (userLogin) {
            if (bcrypt.compareSync(password, userLogin.password)) {
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
        console.log(error);
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
