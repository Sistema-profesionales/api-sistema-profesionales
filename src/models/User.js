const { connecting } = require('./connect');

const save = async (usuario) => {
    const connection = await connecting();
    const query = `INSERT INTO usuarios 
                  (rut, nombres, apellidos, entidad_id, comuna_id, login, password, telefono, email)
                  VALUES($1, $2, $3, $4, $5, $6, $7, $8 , $9)
                  RETURNING *`;
    
    const values = [usuario.rut, usuario.nombres, usuario.apellidos, usuario.entidad_id, usuario.comuna_id, usuario.login, usuario.password, usuario.telefono, usuario.email];
    const result = await connection.query(query, values);
    connection.release();
    return result.rows[0];
}

module.exports = {
    save
}