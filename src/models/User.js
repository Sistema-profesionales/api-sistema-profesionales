const { connecting } = require('./connect');
const { camel, paginate } = require('../helpers/utils/utilitiesFuctions');
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
        const query = `SELECT  u.*, 
                              c.id AS commune_id,
                              c.name AS commune_name,
                              p.id AS province_id,
                              p.name as province_name,
                              r.id AS region_id,
                              r.name AS region_name,
                              ARRAY(SELECT name from professions proff 
                                INNER JOIN users_professions upf ON proff.id = upf.profession_id 
                                WHERE upf.user_id = $1
                                GROUP BY proff.id) AS professions,
                              ARRAY(SELECT name FROM specialities sp
                                INNER JOIN users_specialities usp ON sp.id = usp.speciality_id
                                WHERE usp.user_id = $1
                                GROUP BY sp.id) AS specialities
                       FROM users u
                       LEFT OUTER JOIN communes c ON u.commune_id = c.id
                       LEFT OUTER JOIN provinces p ON c.province_id = p.id
                       LEFT OUTER JOIN regions r ON p.region_id = r.id
                       LEFT OUTER JOIN users_specialities usp ON u.id = usp.user_id
                       LEFT OUTER JOIN specialities sp ON usp.speciality_id = sp.id
                       WHERE u.id = $1`;

        const result = await connection.query(query, [id]);
        console.log(result.rows);

        let data = result.rows[0] || null;
        if (data) delete data.password;
        return data ? camel(data) : null;

    } catch (error) {
        console.log(error);
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


const getUserWithFilter = async (body, page, usersCount) => {
    const connection = await connecting();

    let usersPerPage = "";

    if (usersCount == undefined) {
        usersPerPage = 5
    } else {
        usersPerPage = usersCount;
    }

    let communes = "";
    let daysOfWeek = "";
    let userProfessions = "";
    let values = [];

    if (body.hasOwnProperty("communes")) {
        communes = body.communes.join(', ');
    }

    if (body.hasOwnProperty("daysOfWeek")) {
        daysOfWeek = body.daysOfWeek.join(`', '`);
        daysOfWeek = `'${daysOfWeek}'`;
    }

    if (body.hasOwnProperty("professions")) {
        userProfessions = body.professions.join(', ');
    }


    try {
        let querySelect = `SELECT u.id AS user_id,
                               u.rut,
                               u.names,
                               u.last_names,
                               u.commune_id,
                               u.phone,
                               prof.name AS professions,
                               u.email,disp.id AS disp_id,
                               disp.day_of_week,
                               disp.start_hour,
                               disp.end_hour`;

        let queryFrom = ` FROM users u
                          JOIN disponibilities disp ON u.id = disp.user_id
                          JOIN users_professions usp ON u.id = usp.user_id
                          JOIN professions prof ON usp.profession_id = prof.id`;
        let queryWhere = ``;


        if (body.hasOwnProperty("communes")) {
            querySelect += `,  comm.name AS commune`;
            queryFrom += ` JOIN communes comm ON u.commune_id = comm.id`;
            if (queryWhere == "") {
                queryWhere += ` WHERE u.commune_id IN (${communes})`;
            } else {
                queryWhere += ` AND u.commune_id IN (${communes})`;
            }
        }

        if (body.hasOwnProperty("daysOfWeek")) {
            if (body.daysOfWeek.length > 0) {
                if (queryWhere == "") {
                    queryWhere += ` WHERE disp.day_of_week IN (${daysOfWeek})`;

                } else {
                    queryWhere += ` AND disp.day_of_week IN (${daysOfWeek}) `;
                }

                if (body.startHour && body.endHour) {
                    values.push(body.startHour);
                    values.push(body.endHour);
                    queryWhere += ` AND disp.start_hour BETWEEN $1 AND $2
                                    AND disp.end_hour BETWEEN $1 AND $2`;
                } else {
                    if (body.startHour) {
                        values.push(body.startHour);
                        queryWhere += ` AND disp.start_hour BETWEEN $1 AND '1:00'`;
                    }

                    if (body.endHour) {
                        values.push(body.endHour);
                        queryWhere += ` AND disp.end_hour BETWEEN '6:00' AND $1`;
                    }
                }
            }
        }


        if (body.hasOwnProperty("professions")) {
            if (body.professions.length > 0) {

                if (queryWhere == "") {
                    queryWhere += `WHERE usp.profession_id IN(${userProfessions})`;
                } else {
                    queryWhere += `AND usp.profession_id IN(${userProfessions})`;
                }
            }
        }


        let query = querySelect + queryFrom + queryWhere;

        // console.log(query);

        let { rows } = await connection.query(query, values);


        let result = _.chain(rows).groupBy('user_id').map((data, key) => ({
            data
        })).value()



        let response = result.map((res, index) => ({
            user_id: res.data[0].user_id,
            rut: res.data[0].rut,
            names: res.data[0].names,
            lastNames: res.data[0].last_names,
            communeId: res.data[0].commune_id,
            commune: res.data[0].commune,
            phone: res.data[0].phone,
            email: res.data[0].email,
            professions: res.data[0].professions ? res.data[0].professions.split(',') : res.data[0].professions,
            disponibilities: _.chain(res.data.map((disp, i) => ({
                dayOfWeek: disp.day_of_week,
                hours: res.data.filter(x => x.day_of_week === disp.day_of_week && x.user_id === disp.user_id)
                    .map(e => `${e.start_hour} - ${e.end_hour} `)
            })))
        }))

        let countResult = response.length;

        // console.log(response);

        if (page != undefined) response = paginate(response, usersPerPage, page);


        return { response, countResult };


    } catch (error) {
        throw { error }
    } finally {
        connection.release();
    }
}

const updateUser = async (idUser, body) => {
    const connection = await connecting();
    try {

        let queryToUpdate = "";

        if (body.hasOwnProperty('names')) {
            queryToUpdate = ` SET names = '${body.names}' `;
        }

        if (body.hasOwnProperty('lastNames')) {
            queryToUpdate = ` SET last_names = '${body.lastNames}' `;
        }

        if (body.hasOwnProperty('entityId')) {
            queryToUpdate = ` SET entity_id = '${body.entityId}' `;
        }

        if (body.hasOwnProperty('commune_id')) {
            queryToUpdate = ` SET commune_id = '${body.communeId}' `;
        }

        if (body.hasOwnProperty('phone')) {
            queryToUpdate = ` SET phone = '${body.phone}' `;
        }

        if (body.hasOwnProperty('email')) {
            queryToUpdate = ` SET email = '${body.email}' `;
        }

        if (body.hasOwnProperty('premium')) {
            queryToUpdate = ` SET premium = '${body.premium}' `;
        }

        const query = `UPDATE users 
                       ${queryToUpdate}
                       WHERE id = ${idUser}
                       RETURNING *`;


        const result = await connection.query(query);
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
    getAll,
    getById,
    remove,
    insertUserProfession,
    insertUserSpeciality,
    checkIfRutExist,
    checkIfEmailExist,
    getByLogin,
    getUserWithFilter,
    updateUser
}