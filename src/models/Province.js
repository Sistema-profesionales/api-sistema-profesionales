const { connecting } = require('./connect');

const getAll = async () => {
    const connection = await connecting();

    try {
        const query = `SELECT * 
                       FROM provinces`;

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
                       FROM provinces
                       WHERE id = $1`;
            
        const result = await connection.query(query, [id]);
        return result.rows;
    
    } catch (error) {
    
    } finally {
        connection.release();
    }
}

module.exports = {
    getAll,
    getById
}