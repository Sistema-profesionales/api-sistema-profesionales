exports.save = (area) => {
    const validaciones = {};

    //valido que vengan campos
    if (Object.keys(area).length === 0) {
        return { area : ["Se requieren datos"] };
    }

    //Prop. "nombre"
    if (!area.nombre) {
        validaciones.nombre = [
            "El nombre del area es requerido",
        ];
    } else {
        const largo = area.nombre.length;
        if (largo < 1 || largo > 64) {
            validaciones.nombre = [
                "El nombre del area puede tener entre 1 y 64 caracteres"
            ];
        }
    }

    const tieneErrores = Object.keys(validaciones).length > 0;

    return tieneErrores ? validaciones : undefined;

};