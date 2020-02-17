const save = (user) => {
    const errors = {
        rut: []
    };

    const {rut} = user;

    //rut validations
    if(!rut ){
        errors.rut.push("El rut es requerido");
    }else{
        if(rut.trim().length < 8 || rut.trim().length > 10){
            errors.rut.push("El rut es requerido");
        }
    }

    if(errors.rut.length > 0){
        return errors;
    }else{
        return undefined;
    }
}

module.exports = {
    save
}
900000-7