const { connecting } = require('./connect');
const { camel } = require('../helpers/utils/utilitiesFuctions');

const save = async (user) => {
    const connection = await connecting();

    try {
        const query = `INSERT INTO users 
                      (rut,  names, lastnames, entity_id, commune_id, login, password, phone, email)
                      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
                      RETURNING *`;

        const values = [user.rut, user.names, user.lastnames, user.entity_id, user.commune_id, user.login, user.password, user.phone, user.email];
        const result = await connection.query(query, values);
        
        let data = result.rows[0];
        return data ? camel(data) : null;
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
        let rows = result.rows;

        for(let i = 0; i < rows.length; i++){
            delete rows[i].password;
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
                       FROM users
                       WHERE id = $1`;

        const result = await connection.query(query, [id]);
        let data = result.rows[0] || null;
        if(data) delete data.password;
        return data ? camel(data) : null;

    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}

const getByLogin = async (login) => {
    const connection = await connecting();

    try {
        const query = `SELECT * 
                       FROM users
                       WHERE login = $1`;

        const result = await connection.query(query, [login]);
        let data = result.rows[0];

        return data ? camel(data) : null;
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

        let data = result.rows[0];

        return data ? camel(data) : null;
    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }

}

const updateById = async (id, user) => {
    const connection = await connecting();

    try {
        const query = `UPDATE users
                       SET `
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
    getByLogin,
    remove,
    updateById
}