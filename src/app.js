const express = require('express');
const app = express();

//config
app.set('port', 3000 || process.env.PORT);

//middlewares
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//routes
app.use(require('./routes'));

//run server passion rules the game
app.listen(app.get('port'), () => {
    console.log(`server running on port ${app.get('port')}`);
})