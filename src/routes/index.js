const express = require('express');
const app = express();


app.use('/v1/users', require('./users'));
app.use('/v1/areas', require('./areas'));
app.use('/v1/professions', require('./professions'));
app.use('/v1/communes', require('./communes'));
app.use('/v1/provinces', require('./provinces'));
app.use('/v1/regions', require('./regions'));
app.use('/v1/entities', require('./entities'));
app.use('/v1/disponibilities', require('./disponibilities'));
app.use('/v1/docs', require('./docs'));


module.exports = app;