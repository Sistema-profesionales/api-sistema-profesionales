const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const userModel = require('../models/User');
const fileUpload = require('express-fileupload');

router.get('/:rut', async (req, res) => {
    try {
        const rut = req.params.rut;
        const folder = path.join(__dirname, `../docs/${rut}/`);

        let files = [];

        fs.readdirSync(folder).forEach(file => {
            files.push(file);
        });

        res.status(200).send(files);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.post('/upload/:folder', fileUpload(), async (req, res) => {
    try {
        const rut = req.params.folder;

        const data = {
            rut
        };

        const userRut = await userModel.checkIfRutExist(data);
        if (userRut) {
            let resource = path.join(__dirname, `../docs/${rut}`);
            let existsDirname = fs.existsSync(resource);

            if (existsDirname) {
                //aca subir el archivo a la carpeta del rut
                if (!req.files) return res.status(400).send(`Debes indicar el archivo que deseas subir`);

                let filesUpload = req.files.file;

                if (Array.isArray(filesUpload)) {
                    for (let i = 0; i < filesUpload.length; i++) {
                        if (fs.existsSync(`${resource}/${filesUpload[i].name}`)) {
                            fs.unlinkSync(`${resource}/${filesUpload[i].name}`);
                        }
                        filesUpload[i].mv(`${resource}/${filesUpload[i].name}`);
                    }
                } else {
                    if (fs.existsSync(`${resource}/${filesUpload.name}`)) {
                        fs.unlinkSync(`${resource}/${filesUpload.name}`);
                    }
                    filesUpload.mv(`${resource}/${filesUpload.name}`);
                }

                res.status(200).send(`Archivo(s) subido(s) con exito`);



            } else {
                //aca crear la carpeta
                res.send("no existe folder");
            }
        } else {
            res.status(404).send(`El usuario con rut ${rut} no existe.`);
        }


    } catch (error) {
        res.status(500).send(error);
    }
})


module.exports = router;