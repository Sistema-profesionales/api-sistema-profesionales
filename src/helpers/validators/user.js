const { hasNumber, validator } = require('../utils/utilitiesFuctions');

const save = (user) => {

    const errors = {
        rut: [],
        names: [],
        lastnames: [],
        communeId: [],
        password: [],
        phone: [],
        email: [],
        professions: [],
        entityId: []
    };

    let { rut, names, lastnames, communeId, password, phone, email } = user;

    //rut validations
    if (!rut) {
        errors.rut.push("El rut es requerido");
    } else {
        // if (rut.trim().length < 8 || rut.trim().length > 10) {
        //     errors.rut.push("El rut debe contener de 8 a 10 caracteres");
        // }
        if (!validator.validaRut(rut)) {
            errors.rut.push("El rut debe ser válido (Formato: 11111111-1)");
        }
    }

    if (user.hasOwnProperty("professions")) {
        if (!Array.isArray(user.professions)) {
            errors.professions.push("Profesiones debe contener items");
        } else {
            if (user.professions.length < 1) {
                errors.professions.push("Profesiones debe tener al menos 1 item");
            }
        }
    }

    if (user.hasOwnProperty("entityId")) {
        if (!user.entityId) {
            errors.entityId.push('Entidad es requerido');
        } else {
            if (!Number.isInteger(user.entityId)) {
                errors.entityId.push('Entidad debe ser número');
            }

        }
    }

    //names validation
    if (user.hasOwnProperty("names")) {
        if (!names) {
            errors.names.push('El nombre es requerido');
        } else {
            if (names.length < 5) {
                errors.names.push('Los nombres debe contener mínimo 6 caracteres');
            }

            if (hasNumber(names)) {
                errors.names.push('Los nombres no deben contener números');
            }
        }
    }

    //lastnames validation
    if (user.hasOwnProperty("lastnames")) {
        if (!lastnames) {
            errors.lastnames.push('El apellido es requerido');
        } else {
            if (lastnames.length < 3) {
                errors.lastnames.push('Los apellidos debe contener mínimo 3 caracteres');
            }

            if (hasNumber(lastnames)) {
                errors.lastnames.push('Los apellidos no deben contener números');
            }
        }
    }

    //commune id validation
    if (user.hasOwnProperty("communeId")) {
        if (!communeId) {
            errors.communeId.push("Comuna es requerida");
        }
        else {
            if (!hasNumber(communeId)) {
                errors.communeId.push('Id de comuna debe ser valor numérico');
            }
        }
    }

    if (user.hasOwnProperty("password")) {
        if (!password) {
            errors.password.push('Password es requerido');
        } else {
            if (password.length < 7) {
                errors.password.push('El campo password debe contener mínimo 7 caracteres');
            }
        }
    }


    //phone validation
    if (user.hasOwnProperty("phone")) {
        if (phone) {
            if (isNaN(phone)) {
                errors.phone.push("El teléfono debe ser sólo números");
            }

            if (phone.length < 7) {
                errors.phone.push("El teléfono debe tener mínimo 7 números");
            }
        }
    }



    //email validator
    if (user.hasOwnProperty("email")) {
        if (!email) {
            errors.email.push("El email es requerido");
        } else {
            if (!validator.validateEmail(email)) {
                errors.email.push("El email es inválido");
            }
        }
    }

    if (errors.rut.length > 0 ||
        errors.names.length > 0 ||
        errors.lastnames.length > 0 ||
        errors.communeId.length > 0 ||
        errors.phone.length > 0 ||
        errors.email.length > 0 ||
        errors.password.length > 0 ||
        errors.professions.length > 0 ||
        errors.entityId.length > 0) {
        return errors;
    } else {
        return undefined;
    }
}

const validateRut = (rutReq) => {
    const errors = {
        rut: []
    };

    let rut = rutReq;

    if (!rut) {
        errors.rut.push("El rut es requerido");
    } else {
        // if (rut.trim().length < 8 || rut.trim().length > 10) {
        //     errors.rut.push("El rut debe contener de 8 a 10 caracteres");
        // }
        if (!validator.validaRut(rut)) {
            errors.rut.push("El rut debe ser válido (Formato: 11111111-1)");
        }
    }

    if (errors.rut.length > 0) {
        return errors;
    } else {
        return undefined;
    }


}

module.exports = {
    save,
    validateRut
}