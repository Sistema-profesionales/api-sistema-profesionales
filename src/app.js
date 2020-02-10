const express = require('express');
const app = express();
const cors = require('cors')


//config
app.set('port', 3000 || process.env.PORT);

//middlewares
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cors());

//routes
app.use(require('./routes'));

//run server passion rules the game
app.listen( process.env.PORT || 3000, () => {
    console.log(`server running on port ${app.get('port')}`);
})