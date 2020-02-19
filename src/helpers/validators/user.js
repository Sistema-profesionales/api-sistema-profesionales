const { hasNumber } = require('../utils/utilitiesFuctions');
const save = (user) => {
    const errors = {
        rut: [],
        names: []
    };

    let { rut, names } = user;

    //rut validations
    if (!rut) {
        errors.rut.push("El rut es requerido");
    } else {
        if (rut.trim().length < 8 || rut.trim().length > 10) {
            errors.rut.push("El rut debe contener de 8 a 10 caracteres");
        }
    }

    //names validation
    if (!names) {
        errors.names.push('El nombre es requerido');
    } else {
        if (names.length < 5) {
            errors.names.push('Los nombres debe contener mínimo 6 caracteres');
        }

        if(hasNumber(names)){
            errors.names.push('Los nombres no deben contener números');
        }
    }

    if (errors.rut.length > 0 ||
        errors.names.length > 0) {
        return errors;
    } else {
        return undefined;
    }
}

module.exports = {
    save
}