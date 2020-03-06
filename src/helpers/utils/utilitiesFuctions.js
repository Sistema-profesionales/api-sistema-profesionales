const camel = (el) => {
    let obj = {};
    for (let k in el) {
        let arrKey = k.split('_');
        let name = arrKey[0].toLowerCase();
        for (let i = 1; i < arrKey.length; ++i) name += arrKey[i][0].toUpperCase() + arrKey[i].substr(1);
        if (el[k] !== null && typeof el[k] === 'object' && !el[k].addDays) {
            obj[name] = typeof el[k].length === 'undefined' ? camel(el[k]) : el[k];
        } else {
            obj[name] = el[k];
        }
    }
    return obj;
}

const hasNumber = (myString) => {
    return /\d/.test(myString);
}

const validator = {
    // Valida el rut con su cadena completa "XXXXXXXX-X"
    validaRut: function (rutCompleto) {
        if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto))
            return false;
        var tmp = rutCompleto.split('-');
        var digv = tmp[1];
        var rut = tmp[0];
        if (digv == 'K') digv = 'k';
        return (validator.dv(rut) == digv);
    },
    dv: function (T) {
        var M = 0, S = 1;
        for (; T; T = Math.floor(T / 10))
            S = (S + T % 10 * (9 - M++ % 6)) % 11;
        return S ? S - 1 : 'k';
    }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = {
    camel,
    hasNumber,
    validator,
    validateEmail
}