const { connecting } = require('./connect');
const { camel, ucamel } = require('../helpers/utils/utilitiesFuctions');

const save = async (body) => {
    const connection = await connecting();

    try {
        const query = `INSERT INTO disponibility
                      (user_id, )`
    } catch (error) {

    } finally {

    }
}

module.exports = {
    save
}