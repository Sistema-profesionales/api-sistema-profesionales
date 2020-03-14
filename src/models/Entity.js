const { connecting } = require('./connect');
const { camel, ucamel } = require('../helpers/utils/utilitiesFuctions');

const getAll = async () => {
    const connection = await connecting();

    try {
        const query = `
        SELECT *
        FROM
        entities
    `;

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

const getEntitiesByAreaAndCommune = async (idArea, idCommune) => {
    const connection = await connecting();
    try {
        const query = `SELECT *
                       FROM entities ent
                       JOIN communes com ON ent.commune_id = com.id
                       JOIN areas ar ON ent.area_id = ar.id
                       WHERE ar.id = $1 AND com.id = $2`;

        const result = await connection.query(query, [idArea, idCommune]);

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

const save = async (entity) => {
    const connection = await connecting();

    entity = camel(entity); 

    try {
        const query = `INSERT INTO entities
                       (name, company_name, address, phone, email, area_id, commune_id)
                       VALUES ($1, $2, $3, $4, $5, $6, $7)
                       RETURNING *`;
        
        const values = [entity.name, entity.companyName, entity.address, entity.phone, entity.email, entity.areaId, entity.communeId];
        const result = await connection.query(query, values);

        let data = result.rows[0];
        return data ? camel(data) : null;

        
    } catch (error) {
        
    } finally {
        connection.release();
    }
}

// const checkIfExist = (idEntity) => {
//     const connection = await connecting();

//     try {
        
//     } catch (error) {
        
//     } finally {

//     }
// }


module.exports = {
    getAll,
    getEntitiesByAreaAndCommune,
    save
}