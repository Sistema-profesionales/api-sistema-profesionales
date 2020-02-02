const express = require('express');
const app = express();


app.use('/v1/users', require('./users'));


module.exports = app;