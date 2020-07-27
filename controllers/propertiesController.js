const db = require('../data/MOCK_DATA.json');
// const db = require('../data/testDb.json');
const pics = require('../data/pictures.json');
const vids = require('../data/videos.json');

module.exports = {
    handleQuery: function(query){
        const { locationsOnly, location } = query;

        if (locationsOnly.toLowerCase() === 'true') return this.findLocations();

        if (this.isName(location)) return this.findByName(query);

        if (this.isStreet(location)) return this.findByStreet(query);

        if (this.isCity(location)) return this.findByCity(query);

        if (this.isState(location)) return this.findByState(query);

        return this.Nothing;
    },

    findLocations: function() {
        if (!db || !Array.isArray(db)) return [];
        return {
            propertyData: [],
            locationData: this.getAllNames()
                .concat(this.getAllStreets())
                .concat(this.getAllCities())
                .concat(this.getAllStates()),
            mapKey: ''
        };
    },

    
    findByName: function(query) {
        if (!db || !Array.isArray(db)) return this.Nothing;
        const property = db.find(property => property.name === query.location);
        if (!property) return this.Nothing;
        const decoratedProperty = this.decorateProperty(property, query);
        return { 
            propertyData: [decoratedProperty], 
            locationData: [],
            mapKey: property.name
        };
    },

    findByStreet: function(query) {
        if (!db || !Array.isArray(db)) return this.Nothing;
        const property = db.find(property => property.street === query.location);
        if (!property) return this.Nothing;
        const decoratedProperty = this.decorateProperty(property, query);
        return { 
            propertyData: [decoratedProperty], 
            locationData: [],
            mapKey: property.street
        };
    },

    findByCity: function(query) {
        if (!db || !Array.isArray(db)) return this.Nothing;
        const properties = db.filter(property => property.city === query.location);
        if (properties.length < 1) return this.Nothing;
        const decoratedProperties = this.decorateProperties(properties, query);
        return { 
            propertyData: decoratedProperties, 
            locationData: [],
            mapKey: query.location
        };
    },

    findByState: function(query) {
        if (!db || !Array.isArray(db)) return this.Nothing;
        const properties = db.filter(property => property.state === query.location);
        if (properties.length < 1) return this.Nothing;
        const decoratedProperties = this.decorateProperties(properties, query);
        return { 
            propertyData: decoratedProperties, 
            locationData: [],
            mapKey: query.location
        };
    },

    decorateProperties: function(properties, query) {
        const ret = [];
        for (let i=0; i < properties.length; i++) {
            ret.push(this.decorateProperty(properties[i], query));
        }
        return ret;
    },

    decorateProperty: function(property, query) {
        let units = property.units;
        if (parseFloat(query.price) > 0){
            units = property.units.filter(unit => 
                this.priceToNum(unit.price) <= parseFloat(query.price));
        }
        if (parseInt(query.bedrooms) > 0){
            units = units.filter(unit => unit.bedrooms === parseInt(query.bedrooms));
        }
        const priceRange = this.getUnitPriceRange(units);
        const randoVid = Math.floor((Math.random() * vids.length) + 1);
        const randoPic = Math.floor((Math.random() * pics.length) + 1);
        const video = vids[randoVid - 1];
        const picture = pics[randoPic - 1];
        return {
            id: property.id,
            name: property.name,
            street: property.street,
            city: property.city,
            state: property.state,
            available: property.available,
            sales_status: property.sales_status,
            construction_status: property.construction_status,
            developer: property.developer,
            floors: property.floors,
            priceRange: priceRange,
            video: video,
            picture: picture,
            units: units,
        };
    },

    getAllNames: function() {
        if (!db || !Array.isArray(db)) return [];
        const result = [];
        db.forEach(property => {
            result.push(property.name);
        });
        result.sort();
        return result;
    },

    getAllSearchKeys: function() {
        if (!db || !Array.isArray(db)) return [];
        return this.getAllNames(db)
            .concat(this.getAllStreets(db))
            .concat(this.getAllCities(db))
            .concat(this.getAllStates(db));
    },
    
    getAllStreets: function() {
        if (!db || !Array.isArray(db)) return [];
        const result = [];
        db.forEach(property => {
            result.push(property.street);
        });
        result.sort();
        return result;
    },
    
    getAllCities: function() {
        if (!db || !Array.isArray(db)) return [];
        const result = [];
        db.forEach(property => {
            if (result.find(x=> x === property.city) === undefined)
            result.push(property.city);
        });
        result.sort();
        return result;
    },
    
    getAllStates: function() {
        if (!db || !Array.isArray(db)) return [];
        const result = [];
        db.forEach(property => {
            if (result.find(x=> x === property.state) === undefined)
            result.push(property.state);
        });
        result.sort();
        return result;
    },

    isName: function(arg) {
        return this.getAllNames().find(x => x === arg) !== undefined;
    },

    isStreet: function(arg) {
        return this.getAllStreets().find(x => x === arg) !== undefined;
    },

    isCity: function(arg) {
        return this.getAllCities().find(x => x === arg) !== undefined;
    },

    isState: function(arg) {
        return this.getAllStates().find(x => x === arg) !== undefined;
    },

    getUnitPriceRange: function(units){
        if (!units || units.length === 0) return { min: '$0', max: '$0' };
        units.sort(this.byPrice);
        const highest = units[0].price ? units[0].price : '$0';
        const lowest = units[units.length-1].price ? units[units.length-1].price : '$0';
        return { min: lowest, max: highest };
    },

    byPrice: function(unitA, unitB){
        const priceToNum = function(price){
            const num= price.slice(-price.length + 1);
            return Number.parseFloat(num).toFixed(2);
        };
        const priceA = priceToNum(unitA.price);
        const priceB = priceToNum(unitB.price);
        return priceB-priceA;
    },

    priceToNum: function(price){
        const num= price.slice(-price.length + 1);
        return Number.parseFloat(num).toFixed(2);
    },

    Nothing: { propertyData: [], locationData: [], mapKey: '' },
};
