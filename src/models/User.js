const { connecting } = require('./connect');

const save = async (user) => {
    const connection = await connecting();
    const query = `INSERT INTO users 
                  (user_name, user_email, user_address, user_phonenumber, user_lastname)
                  VALUES($1, $2, $3, $4, $5)
                  RETURNING *`;
    
    const values = [user.name, user.email, user.address, user.phonenumber, user.lastname];
    const result = await connection.query(query, values);
    connection.release();
    return result.rows[0];
}

module.exports = {
    save
}