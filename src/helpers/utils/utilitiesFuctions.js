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

const ucamel = (el) => {
    let obj = {};
    for (let k in el) {
        let arrKey = k.split('');
        let name = '';
        for (let i = 0; i < arrKey.length; ++i) {
            name += (arrKey[i] < 'a') ? ('_' + arrKey[i].toLowerCase()) : arrKey[i];
        }
        if (el[k] && typeof el[k] === 'object') {
            obj[name] = typeof el[k].length === 'undefined' ? ucamel(el[k]) : el[k];
        } else {
            obj[name] = el[k];
        }
    }
    return obj;
}


module.exports = {
    camel,
    ucamel
}