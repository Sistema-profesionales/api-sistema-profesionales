const { connecting } = require('./connect');

const save = async (user) => {
    const connection = await connecting();

    try {
        const query = `INSERT INTO users 
                      (rut,  names, lastnames, entity_id, commune_id, login, password, phone, email, profile_id)
                      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                      RETURNING *`;

        const values = [user.rut, user.names, user.lastnames, user.entity_id, user.commune_id, user.login, user.password, user.phone, user.email, user.profile_id];
        const result = await connection.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}

const getAll = async () => {
    const connection = await connecting();

    try {
        const query = `
        SELECT *
        FROM
        users
    `;
        const result = await connection.query(query);
        return result.rows;

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
                       FROM users
                       WHERE id = $1`;

        const result = await connection.query(query, [id]);
        return result.rows[0];

    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}

const remove = async (id) => {
    const connection = await connecting();

    try {
        const query = `DELETE
                       FROM users
                       WHERE id = $1
                       RETURNING *`;
        
        const result = await connection.query(query, [id]);

        return result.rows[0];
    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }

}

module.exports = {
    save,
    getAll,
    getById,
    remove
}