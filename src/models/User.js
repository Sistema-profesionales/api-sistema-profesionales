const { connecting } = require('./connect');
const { camel } = require('../helpers/utils/utilitiesFuctions');

const save = async (user) => {
    const connection = await connecting();

    try {
        const query = `INSERT INTO users 
                      (rut,  names, last_names, entity_id, commune_id, password, phone, email)
                      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
                      RETURNING *`;

        const values = [user.rut, user.names, user.lastNames, user.entityId, user.communeId, user.password, user.phone, user.email];
        const result = await connection.query(query, values);

        let data = result.rows[0];
        return data ? camel(data) : null;
    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}

const insertUserProfession = async (userId, professionId) => {
    const connection = await connecting();

    try {
        const query = `INSERT INTO users_professions
                       (user_id, profession_id)
                       VALUES ($1, $2)`;

        const values = [userId, professionId];
        await connection.query(query, values);
    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}

const insertUserSpeciality = async (userId, specialityId) => {
    const connection = await connecting();

    try {
        const query = `INSERT INTO users_specialities
                       (user_id, speciality_id)
                       VALUES ($1, $2)`;

        const values = [userId, specialityId];
        await connection.query(query, values);
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
        FROM users
    `;
        const result = await connection.query(query);
        let rows = result.rows;

        for (let i = 0; i < rows.length; i++) {
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
        if (data) delete data.password;
        return data ? camel(data) : null;

    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}


const checkIfRutExist = async (user) => {
    const connection = await connecting();
    try {
        const query = `SELECT *
                       FROM users
                       WHERE rut = $1`;

        const result = await connection.query(query, [user.rut]);
        let data = result.rows[0];

        if (data) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw { error }
    } finally {
        connection.release();
    }
}

const checkIfEmailExist = async (user) => {
    const connection = await connecting();
    try {
        const query = `SELECT *
                       FROM users
                       WHERE email = $1`;

        const result = await connection.query(query, [user.email]);
        let data = result.rows[0];

        if (data) {
            return true;
        }
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
    remove,
    updateById,
    insertUserProfession,
    insertUserSpeciality,
    checkIfRutExist,
    checkIfEmailExist
}