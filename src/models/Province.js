const { connecting } = require('./connect');
const { camel } = require('../helpers/utils/utilitiesFuctions');

const getAll = async () => {
    const connection = await connecting();

    try {
        const query = `SELECT * 
                       FROM provinces`;

        const result = await connection.query(query);
        let rows = result.rows;
        
        for(let i = 0; i < rows.length; i++) {
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
                       FROM provinces
                       WHERE id = $1`;
            
        const result = await connection.query(query, [id]);
        return result.rows;
    
    } catch (error) {
    
    } finally {
        connection.release();
    }
}

const getCommunesByProvId = async (id) => {
    const connection = await connecting();
    try {
        const query = `SELECT *
                       FROM communes
                       WHERE province_id = $1`;

        const result = await connection.query(query, [id]);
        let rows = result.rows;

        for(let i = 0; i < rows.length; i++){
            rows[i] = camel(rows[i]);
        }

        return rows;
    
    } catch (error) {
        throw { error }
    } finally {
        connection.release();
    }   
}

const getCommunesByProvinceAndUserId = async (userId) => {
    const connection = await connecting();
    try {
        const query = `
        select *
        from communes
        where province_id = (
                select pro.id 
                from provinces as pro
                inner join communes as com on com.province_id = pro.id 
                inner join users as u on com.id = u.commune_id
                where u.id = $1
        )`;

        const result = await connection.query(query, [userId]);
        let rows = result.rows;

        for(let i = 0; i < rows.length; i++){
            rows[i] = camel(rows[i]);
        }

        return rows;
    } catch (error) {
        
    } finally {
        connection.release();
    }
}

module.exports = {
    getAll,
    getById,
    getCommunesByProvId,
    getCommunesByProvinceAndUserId
}