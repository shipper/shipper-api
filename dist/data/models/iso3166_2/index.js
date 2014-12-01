var DataModel, riak, schema;

DataModel = require('../lib/model');

riak = require('./riak');

schema = require('./schema');

module.exports = DataModel.define("iso3166_2", "iso3166_2", schema, riak);
