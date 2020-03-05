const { hasNumber,validator } = require('../utils/utilitiesFuctions');
const save = (user) => {
    const errors = {
        rut: [],
        names: [],
        lastnames: []
    };

    let { rut, names, lastnames } = user;

    //rut validations
    if (!rut) {
        errors.rut.push("El rut es requerido");
    } else {
        if (rut.trim().length < 8 || rut.trim().length > 10) {
            errors.rut.push("El rut debe contener de 8 a 10 caracteres");
        }
        if(!validator.validaRut(rut)){
            errors.rut.push("El rut debe ser válido (Formato: 11111111-1)");
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

    if(!lastnames){
        errors.names.push('El apellido es requerido');
    }else{
        if (lastnames.length < 5) {
            errors.lastnames.push('Los apellidos debe contener mínimo 6 caracteres');
        }

        if(hasNumber(lastnames)){
            errors.lastnames.push('Los apellidos no deben contener números');
        }
    }

    if (errors.rut.length > 0 ||
        errors.names.length > 0 ||
        errors.lastnames > 0 ) {
        return errors;
    } else {
        return undefined;
    }
}

module.exports = {
    save
}