const save = (user) => {
    const errors = {
        rut: []
    };

    const {rut} = user;

    //rut validations
    if(rut.trim().length < 4 ){
        errors.rut.push("El rut es requerido");
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