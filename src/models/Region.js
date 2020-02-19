const { connecting} = require('./connect');
const { camel } = require('../helpers/utils/utilitiesFuctions');

const getAll = async () => {
    const connection = await connecting();
    try {
        const query = `SELECT * 
                       FROM regions`;
        
        const result = await connection.query(query);
        return result.rows;
    } catch (error) {
        throw { error }
    } finally {
        connection.release();
    }
}

const getById = async (id) => {
    const connection = await connecting();
    
    try {
        const query = `SELECT *
                       FROM regions
                       WHERE id = $1`;

        const result = await connection.query(query, [id]);
        return result.rows;
    
    } catch (error) {
        throw { error };
    } finally {
        connection.release();
    }
}

const getProvincesByRegionId = async (id) => {
    const connection = await connecting();

    try {
        const query = `SELECT *
                       FROM provinces
                       WHERE region_id = $1`;

        const result = await connection.query(query, [id]);
        let rows = result.rows;

        for(let i = 0; i < rows.length; i++){
            rows[i] = camel(rows[i]);
        }

        return rows;
    
    } catch (error) {
        throw { error }
    } finally {
        connection.release()
    }
}

module.exports = {
    getAll,
    getById,
    getProvincesByRegionId
}