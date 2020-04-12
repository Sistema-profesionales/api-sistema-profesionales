const { connecting } = require('./connect');
const { camel } = require('../helpers/utils/utilitiesFuctions');
const _ = require('lodash');

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
        } else {
            return false;
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

const getByLogin = async (login) => {
    const connection = await connecting();

    try {
        const query = `SELECT * 
                       FROM users
                       WHERE email = $1
                       OR rut = $1`;

        const result = await connection.query(query, [login]);
        let data = result.rows[0];

        return data ? camel(data) : null;
    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}

const getUserWithFilter = async (body) => {
    const connection = await connecting();

    let communes = body.communes.join(', ');
    let daysOfWeek = body.daysOfWeek.join(`', '`)
    let userProfessions = body.professions.join(', ');
    daysOfWeek = `'${daysOfWeek}'`;

    try {
        const query = `
                        SELECT u.id AS user_id,
                               u.rut,
                               u.names,
                               u.last_names,
                               u.commune_id,
                               u.phone,
                               u.email,
                               prof.name AS profession_name,
                               array_agg(disp.id) as disponibilities
                        FROM users u
                        JOIN users_professions usp ON u.id = usp.user_id
                        JOIN disponibilities disp ON u.id = disp.user_id
                        JOIN professions prof ON usp.profession_id = prof.id
                        WHERE u.commune_id IN (${communes})
                        AND disp.day_of_week IN (${daysOfWeek})
                        AND usp.profession_id IN (${userProfessions})
                        AND disp.start_hour BETWEEN $1 AND $2
                        AND disp.end_hour BETWEEN $1 AND $2
                        GROUP BY u.id, prof.name`;


        let { rows } = await connection.query(query, [body.startHour, body.endHour]);

        // let res = _.chain(rows)
        //     .groupBy('day_of_week')
        let idsUsers = [];
        let newInfo = [];

        // rows.forEach((row, i) => {

        //     if (idsUsers.includes(row.user_id)) {
        //         // rows.disponibilities = "aca la agrego al mismo";
        //         newInfo.push({
        //             user_id: row.user_id,
        //             rut: row.rut,
        //             names: row.names,
        //             last_names: row.last_names,
        //             commune_id: row.commune_id,
        //             phone: row.phone,
        //             email: row.email,
        //             profession_name: row.profession_name,
        //             disponibilities: []
        //         })


        //     } else {
        //         // rows.disponibilities = "aca crearia otro creo, pq no se repite :D";

        //     }

        //     idsUsers.push(row.user_id);
        // })

        return rows


    } catch (error) {
        throw { error }
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
    checkIfEmailExist,
    getByLogin,
    getUserWithFilter
}