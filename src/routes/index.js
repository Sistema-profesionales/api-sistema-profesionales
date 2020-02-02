const express = require('express');
const app = express();


app.use('/v1/users', require('./users'));
app.use('/v1/areas', require('./areas'));


module.exports = app;