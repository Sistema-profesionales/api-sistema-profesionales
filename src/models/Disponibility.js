const { connecting } = require('./connect');
const { camel, ucamel } = require('../helpers/utils/utilitiesFuctions');

const save = async (body) => {
    const connection = await connecting();

    try {
        const query = `INSERT INTO disponibilities
                      (user_id, day_of_week, start_hour, end_hour)
                      VALUES($1, $2, $3, $4)
                      RETURNING *`;

        const values = [body.userId, body.dayOfWeek, body.startHour, body.endHour];
        const result = await connection.query(query, values);

        const data = result.rows[0];
        // console.log(data);
        return data ? camel(data) : null;

    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}

const saveNew = async (body) => {
    const connection = await connecting();

    console.log(typeof body.disponibilities);

    try {
        const query = `INSERT INTO disponibilities_dev
                       (user_id, disponibilities)
                       VALUES($1, $2)
                       RETURNING *`;

        const values = [body.userId, body.disponibilities];
        const result = await connection.query(query, values);

        return result;
    } catch (error) {
        throw { error }
    } finally {
        connection.release();
    }
}

const getAll = async () => {
    const connection = await connecting();

    try {
        const query = `SELECT * 
                       FROM disponibilities`;

        const result = await connection.query(query);
        let rows = result.rows;

        for (let i = 0; i < rows.length; i++) {
            rows[i] = camel(rows[i]);
        }

        return rows;
    } catch (error) {
        console.log(error);
        throw { error };
    } finally {
        connection.release()
    }
}

const getByUser = async (id) => {
    const connection = await connecting();

    try {
        const query = `SELECT *
                       FROM disponibilities
                       WHERE user_id = $1`;

        const result = await connection.query(query, [id]);
        let data = result.rows;

        return data ? camel(data) : null;
    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}

const getByUserAndDay = async (id, day) => {
    const connection = await connecting();

    try {
        const query = `SELECT *
                       FROM disponibilities
                       WHERE user_id = $1
                       AND LOWER(day_of_week) = LOWER($2)`;

        const result = await connection.query(query, [id, day]);
        let data = result.rows;
        for (let i = 0; i < data.length; i++) {
            data[i] = camel(data[i]);
        }

        return data;
    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}

const deletedDisponibilities = async (userId, dayOfWeek) => {
    const connection = await connecting();
    try {
        const query = `DELETE 
                       FROM disponibilities
                       WHERE user_id = $1
                       AND LOWER(day_of_week) = LOWER($2)
                       RETURNING *`;

        const result = await connection.query(query, [userId, dayOfWeek]);
        let data = result.rows;

        for (let i = 0; i < data.length; i++) {
            data[i] = camel(data[i]);
        }

        return data;

    } catch (error) {
        throw { error }
    } finally {
        connection.release();
    }
}

const remove = async (id) => {
    const connection = await connecting();
    try {
        const query = `DELETE 
                       FROM disponibilities
                       WHERE id = $1
                       RETURNING *`;

        const result = await connection.query(query, [id]);
        let data = result.rows[0];
        return data ? camel(data) : null;
    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }

}

module.exports = {
    save,
    saveNew,
    getAll,
    getByUser,
    getByUserAndDay,
    deletedDisponibilities,
    remove
}