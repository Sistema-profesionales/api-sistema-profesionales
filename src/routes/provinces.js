const express = require('express');
const router = express.Router();
const provinceModel = require('../models/Province');

router.get('/', async (req, res) => {
    try {
        const provinces = await provinceModel.getAll();
        res.status(200).send(provinces);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const idProvince = req.params.id;
        const province = await provinceModel.getById(idProvince);
        res.status(200).send(province);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id/communes', async (req,res) => {
    try {
        const idProv = parseInt(req.params.id);
        const communesByProvId = await provinceModel.getCommunesByProvId(idProv);
        res.status(200).send(communesByProvId);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/user/:userId/communes', async (req, res) => {
    try {
        const { userId } = req.params;
        const communes = await provinceModel.getCommunesByProvinceAndUserId(userId);
        res.status(200).send(communes);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;