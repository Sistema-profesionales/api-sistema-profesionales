const { Pool } = require("pg");

const pool = new Pool({
    user : "mpquvspq",
    host : "rajje.db.elephantsql.com",
    database : "mpquvspq",
    password : "kITRAwcEU1r0zj7AmhqQ5YA1qFCLCD2B"
});

const connecting = async () => {
    const client = await pool.connect();
    return client;
};

exports.connecting = connecting;
