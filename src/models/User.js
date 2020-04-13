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
        // let querySelect = `SELECT u.id AS user_id,
        //                        u.rut,
        //                        u.names,
        //                        u.last_names,
        //                        u.commune_id,
        //                        u.phone,
        //                        u.email,`;

        // let queryFrom = `FROM users u
        // `;

        // let queryWhere = ``;

        // let query = querySelect + queryFrom + queryWhere;


        const query = `
                        SELECT u.id AS user_id,
                               u.rut,
                               u.names,
                               u.last_names,
                               u.commune_id,
                               comm.name AS commune,
                               u.phone,
                               u.email,
                               prof.name AS professions,
                               disp.id AS disp_id,
                               disp.day_of_week,
                               disp.start_hour,
                               disp.end_hour,
                               prof.name AS profession_name
                        FROM users u
                        JOIN users_professions usp ON u.id = usp.user_id
                        JOIN disponibilities disp ON u.id = disp.user_id
                        JOIN professions prof ON usp.profession_id = prof.id
                        JOIN communes comm ON u.commune_id = comm.id
                        WHERE u.commune_id IN (${communes})
                        AND disp.day_of_week IN (${daysOfWeek})
                        AND usp.profession_id IN (${userProfessions})
                        AND disp.start_hour BETWEEN $1 AND $2
                        AND disp.end_hour BETWEEN $1 AND $2`;


        let { rows } = await connection.query(query, [body.startHour, body.endHour]);

        let result = _.chain(rows).groupBy('user_id').map((data, key) => ({
            data
        }))


        let response = result.map((res, index) => ({
            user_id: res.data[0].user_id,
            rut: res.data[0].rut,
            names: res.data[0].names,
            lastNames: res.data[0].last_names,
            communeId: res.data[0].commune_id,
            commune: res.data[0].commune,
            phone: res.data[0].phone,
            email: res.data[0].email,
            professions: res.data[0].professions.split(','),
            disponibilities: _.chain(res.data.map((disp, i) => ({
                dayOfWeek: disp.day_of_week,
                hours: res.data.filter(x => x.day_of_week === disp.day_of_week && x.user_id === disp.user_id)
                    .map(e => `${e.start_hour} - ${e.end_hour}`)
            }))).uniqBy("dayOfWeek")
        }))

        return response


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