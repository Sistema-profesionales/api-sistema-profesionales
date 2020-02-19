const express = require('express');
const router = express.Router();
const regionModel = require('../models/Region');

router.get('/', async (req,res) => {
    try {
        const regions = await regionModel.getAll();
        res.status(200).send(regions);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async (req,res) => {
    try {
        const id = parseInt(req.params.id);
        const region = await regionModel.getById(id);
        res.status(200).send(region);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id/provinces', async (req,res) => {
    try {
        const regionId = parseInt(req.params.id);
        const provincesByRegionId = await regionModel.getProvincesByRegionId(regionId);
        console.log(provincesByRegionId);
        res.status(200).send(provincesByRegionId);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;