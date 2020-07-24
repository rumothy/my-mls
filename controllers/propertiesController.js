const db = require('../data/MOCK_DATA.json');

module.exports = {
    findAll: function() {
        return db;
    },

    findAllUnits: function() {
        if (!db || !Array.isArray(db)) return [];
        const reducer = (units, property) => units.concat(property.units);
        return db.reduce(reducer, []);
    }
};