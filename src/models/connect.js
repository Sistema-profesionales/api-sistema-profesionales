require('dotenv').config()

const { Pool } = require("pg");


const pool = new Pool({
    // user : process.env.USER_DATABASE,
    // host : process.env.HOST_DATABASE,
    // database : process.env.DATABASE_NAME,
    // password : process.env.PASSWORD_DATABASE


    user : 'krgwtsdd',
    host : 'rajje.db.elephantsql.com',
    database : 'krgwtsdd',
    password : 'u9oI8vV2OJMdiA1ECpYdVKe3QClRXr0Y'
});


const connecting = async () => {
    const client = await pool.connect();
    return client;
};

exports.connecting = connecting;
