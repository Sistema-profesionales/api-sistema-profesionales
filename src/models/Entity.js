const { connecting } = require('./connect');
const { camel, ucamel } = require('../helpers/utils/utilitiesFuctions');

const getAll = async () => {
    const connection = await connecting();

    try {
        const query = `
        SELECT *
        FROM
        entities
    `;

        const result = await connection.query(query);
        let rows = result.rows;

        for (let i = 0; i < rows.length; i++) {
            rows[i] = camel(rows[i]);
        }

        return rows;

    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}

const save = async () => {
    
}


module.exports = {
    getAll
}