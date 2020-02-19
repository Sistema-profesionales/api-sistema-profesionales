const { connecting } = require('./connect');
const { camel } = require('../helpers/utils/utilitiesFuctions');

const getAll = async () => {
    const connection = await connecting();

    try {
        const query = `SELECT * 
                       FROM communes`;

        const result = await connection.query(query);
        let rows = result.rows;

        for (let i = 0; i < rows.length; i++){
            rows[i] = camel(rows[i]);
        }

        return rows;

    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}

const getById = async (id) => {
    const connection = await connecting();

    try {
        const query = `SELECT * 
                       FROM communes
                       WHERE id = $1`;

        const result = await connection.query(query, [id]);

        let data = result.rows[0] || null;
        return data ? camel(data) : null;
    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}

module.exports = {
    getAll,
    getById
}