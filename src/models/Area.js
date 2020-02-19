const { connecting } = require('./connect');
const { camel, ucamel } = require('../helpers/utils/utilitiesFuctions');

const save = async (body) => {
    try {
        // connect to database
        return await body || undefined;
    } catch (error) {
        throw { error };
    } finally {
        //close connection
    }
}

const getAll = async () => {
    try {
        // connect to database
        return await data;
    } catch (error) {
        throw { error };
    } finally {
        //close connection
    }
}

const getById = async (id) => {
    try {
        // connect to database
        return await data.find(x => x.id === id) || undefined;
    } catch (error) {
        throw { error };
    } finally {
        //close connection
    }
}

const updateById = async (id, body) => {
    try {
        // connect to database
        return await body || undefined;
    } catch (error) {
        throw { error };
    } finally {
        //close connection
    }
}

const deleteById = async (id) => {
    try {
        // connect to database
        return await data.find(x => x.id === id) || undefined;
    } catch (error) {
        throw { error };
    } finally {
        //close connection
    }
}

module.exports = {
    save,
    getAll,
    getById,
    updateById,
    deleteById
}