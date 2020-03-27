const { connecting } = require('./connect');
const { camel, ucamel } = require('../helpers/utils/utilitiesFuctions');

const save = async (speciality) => {
    const connection = await connecting();

    try {
        const querySpeciality = 'SELECT name FROM specialities WHERE name = $1';
        const resultSpeciality = await connection.query(querySpeciality, [speciality]);
        let dataSpeciality = resultSpeciality.rows[0];

        if (!dataSpeciality) {
            const query = `INSERT INTO specialities
                       (name)
                       VALUES ($1)
                       RETURNING *`

            const result = await connection.query(query, [speciality]);
            const data = result.rows[0];

            return data ? data : null;
        }

    } catch (error) {
        throw { error }
    } finally {
        connection.release();
    }

}
module.exports = {
    save
}