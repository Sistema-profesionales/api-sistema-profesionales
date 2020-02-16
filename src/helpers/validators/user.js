const save = (user) => {
    const errors = {
        rut: [],
        names: [],
        lastnames: [],
        commune_id: [],
        login: [],
        password: [],
        phone: [],
        email: []
    };

    if(Object.keys(user).length === 0){
        return { user: ["Se requieren datos"] };
    }

    const {rut, names, lastnames, commune_id, login, password, phone, email} = user;


    
}