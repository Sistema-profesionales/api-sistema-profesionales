const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/:rut', async (req, res) => {
    try {
        const rut = req.params.rut;
        const folder = path.join(__dirname, `../docs/${rut}/`);

        fs.readdirSync(folder).forEach(file => {
            console.log(file);
        });
    } catch (error) {
        res.status(500).send(error);
    }
})


module.exports = router;