const { connecting } = require('./connect');
const { camel } = require('../helpers/utils/utilitiesFuctions');

const save = async (body) => {
    try {
        // connect to database
        return await body || undefined;
    } catch (error) {
        throw { error };
    } finally {
        //close connection
    }
}

const getAll = async () => {
    const connection = await connecting();
    try {
        const query = `SELECT * 
                       FROM areas`;

        const result = await connection.query(query);
        let rows = result.rows;

        for (let i = 0; i < rows.length; i++) {
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
                       FROM areas
                       WHERE id = $1`;

        const result = await connection.query(query,[id]);
        let data = result.rows[0];

        return data ? camel(data) : null;
    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}

const getProfessionsByAreaId = async (id) => {
    const connection = await connecting();
    try {
        const query = `SELECT *
                       FROM professions
                       WHERE area_id = $1`;
        const result = await connection.query(query, [id]);

        let rows = result.rows;

        for(let i = 0; i < rows.length; i++){
            rows[i] = camel(rows[i]);
        }

        return rows;

    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}

const updateById = async (id, body) => {
    try {
        // connect to database
        return await body || undefined;
    } catch (error) {
        throw { error };
    } finally {
        //close connection
    }
}

const deleteById = async (id) => {
    try {
        // connect to database
        return await data.find(x => x.id === id) || undefined;
    } catch (error) {
        throw { error };
    } finally {
        //close connection
    }
}

module.exports = {
    save,
    getAll,
    getById,
    updateById,
    deleteById,
    getProfessionsByAreaId
}