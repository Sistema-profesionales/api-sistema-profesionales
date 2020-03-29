const { connecting } = require('./connect');
const { camel, ucamel } = require('../helpers/utils/utilitiesFuctions');

const save = async (body) => {
    const connection = await connecting();

    try {
        const query = `INSERT INTO disponibility
                      (user_id, day_of_week, start_hour, end_hour)
                      VALUES($1, $2, $3, $4)
                      RETURNING *`;

        const values = [body.userId, body.dayOfWeek, body.startHour, body.endHour];
        const result = await connection.query(query, values);

        const data = result.rows[0];
        console.log(data);
        return data ? camel(data) : null;

    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}

module.exports = {
    save
}