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

const save = async (profession) => {
    const connection = await connecting();

    try {
        const queryProfession = 'SELECT name FROM professions WHERE name = $1';
        const resultProfession = await connection.query(queryProfession, [profession]);
        let dataProfession = resultProfession.rows[0];

        if (!dataProfession) {
            const query = `INSERT INTO professions
                      (name)
                      VALUES ($1)
                      RETURNING *`;

            const result = await connection.query(query, [profession]);
            let data = result.rows[0];
            return data ? camel(data) : null;
        }


    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}


module.exports = {
    getAll,
    save
}