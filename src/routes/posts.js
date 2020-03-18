const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { dateAvailable, startHour, endHour } = req.body;
    // res.send(req.user.id);
});

router.get('/', (req, res) => {
    console.log("hola posts");
})

module.exports = router;