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

const hasNumber = (myString) =>  {
    return /\d/.test(myString);
  }

module.exports = {
    camel,
    hasNumber
}