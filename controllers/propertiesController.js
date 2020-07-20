const db = require('../data/MOCK_DATA.json');

module.exports = {
    findAll: function() {
        return db;
    }

};