const { connecting } = require('./connect');
const { camel, ucamel } = require('../helpers/utils/utilitiesFuctions');

const getAll = async () => {
    const connection = await connecting();

    try {
        const query = `
        SELECT *
        FROM
        professions
    `;
        const result = await connection.query(query);
        return result.rows;

    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}


module.exports = {
    getAll
}