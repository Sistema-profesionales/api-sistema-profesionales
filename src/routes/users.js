const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const userModel = require('../models/User');
const professionModel = require('../models/Profession');
const specialitynModel = require('../models/Speciality');
const validatorUser = require('../helpers/validators/user');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const puppeteer = require('puppeteer');
const fs = require('fs');
let urlOfCert = "";
let _ = require('lodash');

/**
 * Obtiene todos los usuarios en el sistema.
 */
router.get('/', async (req, res) => {
    try {
        const users = await userModel.getAll();

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

/**
 * Scrapping para obtener la info del rut ingresado.
 */
router.get('/getInfo', async (req, res) => {
    try {
        if (req.query) {
            let rut = req.query.rut;
            const errors = validatorUser.validateRut(rut);

            if (errors) {
                res.status(400).send(errors);
                return;
            }

            const rutOk = rut.split('-')[0];
            const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            // const browser = await puppeteer.launch();

            try {
                const urlToGo = process.env.SCRAP_URL + rutOk;
                const page = await browser.newPage();
                await page.goto(urlToGo);

                const fullname = await page.evaluate(() => {
                    return document.querySelector('table tr:nth-child(2) td a').innerHTML;
                });

                let title = await page.evaluate(() => {
                    return document.querySelector('table tr:nth-child(2) td:nth-child(3)').innerHTML;
                })

                let university = await page.evaluate(() => {
                    return document.querySelector('table tr:nth-child(2) td:nth-child(4)').innerHTML
                })

                let specialities = await page.evaluate(() => {
                    return document.querySelector('table tr:nth-child(2) td:nth-child(5)').innerHTML
                })
                specialities = specialities.split('<br>');
                title = title.split('<br>');
                university = university.split('<br>');
                university = [university];

                specialities = specialities[0] == "No Registra" ? [] : specialities;

                const names = fullname.split(',')[1]
                const lastNames = fullname.split(',')[0]
                const professions = [title];

                const urlHash = await page.evaluate(() => {
                    return document.querySelector('table tr:nth-child(2) td a').href;
                });

                const hash = urlHash.split('/')[6].split('?')[0];

                urlOfCert = process.env.DOWNLOAD_CERT_URL + hash;

                res.send({ names, lastNames, professions, university, specialities });
            } catch (error) {
                if (error.message.includes("Cannot read property 'innerHTML' of null")) {
                    const urlToGo = `http://webhosting.superdesalud.gob.cl/bases/prestadoresindividuales.nsf/(searchAll2)/Search?SearchView&Query=(FIELD%20rut_pres=${rutOk})&Start=1&count=10`;
                    const page = await browser.newPage();
                    await page.goto(urlToGo);

                    const fullname = await page.evaluate(() => {
                        return document.querySelector('table tr:nth-child(2) td a').innerHTML;
                    });

                    let title = await page.evaluate(() => {
                        return document.querySelector('table tr:nth-child(2) td:nth-child(3)').innerHTML;
                    })

                    let university = await page.evaluate(() => {
                        return document.querySelector('table tr:nth-child(2) td:nth-child(4)').innerHTML
                    })

                    let specialities = await page.evaluate(() => {

                        return document.querySelector('table tr:nth-child(2) td:nth-child(5)') && document.querySelector('table tr:nth-child(2) td:nth-child(5)').innerHTML || "";
                    })
                    specialities = specialities.split('<br>');
                    title = title.split('<br>');
                    // university = university.split('<br>');
                    // university = [university];
                    // specialities = specialities.length > 0 ? specialities == "No Registra" || specialities == "" ? [] : specialities;
                    specialities = (Array.isArray(specialities) && specialities.length > 0 && (specialities[0].includes("No") || specialities[0] == "") || (specialities.includes("No") || specialities == "")) ? [] : specialities;

                    const names = fullname.split(',')[1]
                    const lastNames = fullname.split(',')[0]
                    const professions = [title];

                    const urlHash = await page.evaluate(() => {
                        return document.querySelector('table tr:nth-child(2) td a').href;
                    });

                    const hash = urlHash.split('/')[6].split('?')[0];

                    urlOfCert = process.env.DOWNLOAD_CERT_URL + hash;

                    res.send({ names, lastNames, professions, university, specialities });

                }
            }

        }
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

router.post('/getUsersByFilters', async (req, res) => {
    try {
        const { body } = req;

        let page = undefined;

        if (req.query.page) {
            page = req.query.page;
        }

        const result = await userModel.getUserWithFilter(body, page);
        res.status(200).send(result);

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
        let { body } = req;
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

        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto(urlOfCert);


        if (!fs.existsSync('./src/docs')) {
            fs.mkdirSync('./src/docs');
            console.log("folder creada");
        }

        if (!fs.existsSync(`./src/docs/${body.rut}`)) {
            fs.mkdirSync(`./src/docs/${body.rut}`); //HERE I AM
            console.log("folder creada 2");
        }

        await page.setViewport({
            width: 750,
            height: 780,
        });
        await page.screenshot({ path: `./src//docs/${body.rut}/certificado_inscripcion.png` });

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

module.exports = router;

