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
    
    } finally {
    
    }   
}

module.exports = {
    getAll,
    getById,
    getCommunesByProvId
}